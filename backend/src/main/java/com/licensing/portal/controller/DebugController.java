package com.licensing.portal.controller;

import com.licensing.portal.model.Task;
import com.licensing.portal.model.User;
import com.licensing.portal.repository.TaskRepository;
import com.licensing.portal.repository.UserRepository;
import com.licensing.portal.service.LicenseRenewalScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/debug")
public class DebugController {

    @Autowired
    private LicenseRenewalScheduler licenseRenewalScheduler;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/trigger-renewal-tasks")
    public ResponseEntity<String> triggerRenewalTasks() {
        licenseRenewalScheduler.createRenewalTasks();
        return ResponseEntity.ok("License renewal task creation triggered successfully");
    }

    @PostMapping("/assign-tasks")
    public ResponseEntity<String> assignTasks() {
        User manager = userRepository.findByUsername("manager")
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        User user2 = userRepository.findByUsername("user2")
                .orElseThrow(() -> new RuntimeException("User2 not found"));

        List<Task> allTasks = taskRepository.findAll();
        int count = 0;
        java.util.Random random = new java.util.Random();
        Task.TaskStatus[] statuses = Task.TaskStatus.values();

        for (int i = 0; i < allTasks.size(); i++) {
            Task task = allTasks.get(i);
            // Assign 50/50
            if (i % 2 == 0) {
                task.setAssignee(manager);
            } else {
                task.setAssignee(user2);
            }

            // Randomize status
            Task.TaskStatus randomStatus = statuses[random.nextInt(statuses.length)];
            task.setStatus(randomStatus);

            if (randomStatus == Task.TaskStatus.SUSPENDED) {
                task.setStatusReason("Автоматически приостановлена для тестирования");
            } else {
                task.setStatusReason(null);
            }

            taskRepository.save(task);
            count++;
        }

        return ResponseEntity.ok("Assigned and randomized " + count + " tasks.");
    }

    @PostMapping("/fix-null-statuses")
    public ResponseEntity<String> fixNullStatuses() {
        List<Task> allTasks = taskRepository.findAll();
        int fixed = 0;

        for (Task task : allTasks) {
            if (task.getStatus() == null) {
                task.setStatus(Task.TaskStatus.ASSIGNED);
                taskRepository.save(task);
                fixed++;
            }
        }

        return ResponseEntity.ok("Fixed " + fixed + " tasks with null status.");
    }
}
