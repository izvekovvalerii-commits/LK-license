package com.licensing.portal.repository;

import com.licensing.portal.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssigneeId(Long assigneeId);

    List<Task> findByStoreId(Long storeId);

    List<Task> findByStatus(Task.TaskStatus status);

    List<Task> findByLicenseType(Task.LicenseType licenseType);

    @Query("SELECT t FROM Task t WHERE t.deadlineDate <= :date")
    List<Task> findTasksWithDeadlineBefore(LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.deadlineDate BETWEEN :startDate AND :endDate")
    List<Task> findTasksWithDeadlineBetween(LocalDate startDate, LocalDate endDate);

    // Check if renewal task already exists for a store and license type
    boolean existsByStoreIdAndLicenseTypeAndActionTypeAndStatusIn(
            Long storeId,
            Task.LicenseType licenseType,
            Task.ActionType actionType,
            Collection<Task.TaskStatus> statuses);
}
