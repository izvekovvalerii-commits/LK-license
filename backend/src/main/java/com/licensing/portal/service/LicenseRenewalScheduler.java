package com.licensing.portal.service;

import com.licensing.portal.model.Store;
import com.licensing.portal.model.Task;
import com.licensing.portal.model.User;
import com.licensing.portal.repository.StoreRepository;
import com.licensing.portal.repository.TaskRepository;
import com.licensing.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class LicenseRenewalScheduler {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // Run every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void createRenewalTasks() {
        System.out.println("Running license renewal task scheduler at " + LocalDate.now());

        LocalDate today = LocalDate.now();
        LocalDate threeMonthsFromNow = today.plusMonths(3);

        // Find default assignee (prefer manager, fallback to admin)
        User defaultAssignee = userRepository.findByUsername("manager")
                .orElse(userRepository.findByUsername("admin").orElse(null));

        // Process alcohol licenses
        processAlcoholLicenses(threeMonthsFromNow, defaultAssignee);

        // Process tobacco licenses
        processTobaccoLicenses(threeMonthsFromNow, defaultAssignee);

        System.out.println("License renewal task scheduler completed");
    }

    private void processAlcoholLicenses(LocalDate threeMonthsFromNow, User defaultAssignee) {
        List<Store> expiringStores = storeRepository
                .findByIsActiveTrueAndAlcoholLicenseExpiryLessThanEqual(threeMonthsFromNow);

        for (Store store : expiringStores) {
            if (store.getAlcoholLicenseExpiry() != null) {
                createRenewalTaskIfNeeded(store, Task.LicenseType.ALCOHOL, defaultAssignee);
            }
        }
    }

    private void processTobaccoLicenses(LocalDate threeMonthsFromNow, User defaultAssignee) {
        List<Store> expiringStores = storeRepository
                .findByIsActiveTrueAndTobaccoLicenseExpiryLessThanEqual(threeMonthsFromNow);

        for (Store store : expiringStores) {
            if (store.getTobaccoLicenseExpiry() != null) {
                createRenewalTaskIfNeeded(store, Task.LicenseType.TOBACCO, defaultAssignee);
            }
        }
    }

    private void createRenewalTaskIfNeeded(Store store, Task.LicenseType licenseType, User defaultAssignee) {
        // Check if an active renewal task already exists
        List<Task.TaskStatus> activeStatuses = Arrays.asList(
                Task.TaskStatus.ASSIGNED,
                Task.TaskStatus.IN_PROGRESS,
                Task.TaskStatus.SUSPENDED);

        boolean taskExists = taskRepository.existsByStoreIdAndLicenseTypeAndActionTypeAndStatusIn(
                store.getId(),
                licenseType,
                Task.ActionType.RENEWAL,
                activeStatuses);

        if (taskExists) {
            System.out.println("Renewal task already exists for store: " + store.getName() +
                    ", license: " + licenseType);
            return;
        }

        // Create new renewal task
        Task task = new Task();
        String licenseTypeRu = licenseType == Task.LicenseType.ALCOHOL ? "алкогольной" : "табачной";
        task.setTitle("Продление " + licenseTypeRu + " лицензии - " + store.getName());
        task.setDescription("Автоматически созданная задача на продление лицензии.");
        task.setLicenseType(licenseType);
        task.setActionType(Task.ActionType.RENEWAL);
        task.setStatus(Task.TaskStatus.ASSIGNED);
        task.setStore(store);
        task.setAssignee(defaultAssignee);
        task.setCreatedBy(defaultAssignee);

        // Set deadline to license expiry date (or today if already expired)
        LocalDate expiryDate = licenseType == Task.LicenseType.ALCOHOL
                ? store.getAlcoholLicenseExpiry()
                : store.getTobaccoLicenseExpiry();
        LocalDate deadline = expiryDate.isBefore(LocalDate.now()) ? LocalDate.now() : expiryDate;
        task.setDeadlineDate(deadline);

        taskRepository.save(task);
        System.out.println("Created renewal task for store: " + store.getName() +
                ", license: " + licenseType);
    }
}
