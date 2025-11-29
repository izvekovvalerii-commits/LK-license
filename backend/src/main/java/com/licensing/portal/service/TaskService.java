package com.licensing.portal.service;

import com.licensing.portal.dto.TaskRequest;
import com.licensing.portal.dto.TaskResponse;
import com.licensing.portal.model.Store;
import com.licensing.portal.model.Task;
import com.licensing.portal.model.User;
import com.licensing.portal.repository.StoreRepository;
import com.licensing.portal.repository.TaskRepository;
import com.licensing.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Transactional
    public TaskResponse createTask(TaskRequest request, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setLicenseType(request.getLicenseType());
        task.setActionType(request.getActionType());
        task.setCreatedBy(creator);
        task.setDeadlineDate(request.getDeadlineDate());

        // Default status is ASSIGNED if not specified
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        } else {
            task.setStatus(Task.TaskStatus.ASSIGNED);
        }

        if (request.getStatusReason() != null) {
            task.setStatusReason(request.getStatusReason());
        }

        if (request.getStoreId() != null) {
            Store store = storeRepository.findById(request.getStoreId())
                    .orElseThrow(() -> new RuntimeException("Store not found"));
            task.setStore(store);
        }

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);
        return convertToResponse(savedTask);
    }

    public List<TaskResponse> getAllTasks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> tasks;
        if (user.getRoles() != null && user.getRoles().contains("ADMIN")) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findByAssigneeId(user.getId());
        }

        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return convertToResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDeadlineDate(request.getDeadlineDate());

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getStatusReason() != null) {
            task.setStatusReason(request.getStatusReason());
        }

        if (request.getStoreId() != null) {
            Store store = storeRepository.findById(request.getStoreId())
                    .orElseThrow(() -> new RuntimeException("Store not found"));
            task.setStore(store);
        }

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        }

        Task updatedTask = taskRepository.save(task);
        return convertToResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, Task.TaskStatus status, String reason) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        if (reason != null) {
            task.setStatusReason(reason);
        }
        Task updatedTask = taskRepository.save(task);
        return convertToResponse(updatedTask);
    }

    // Overload for backward compatibility if needed, though controller should use
    // the one with reason
    @Transactional
    public TaskResponse updateTaskStatus(Long id, Task.TaskStatus status) {
        return updateTaskStatus(id, status, null);
    }

    public List<TaskResponse> getUpcomingDeadlines(int days) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        return taskRepository.findTasksWithDeadlineBetween(today, futureDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private TaskResponse convertToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setLicenseType(task.getLicenseType());
        response.setActionType(task.getActionType());

        // Set status with null-safety - default to ASSIGNED if null
        if (task.getStatus() != null) {
            response.setStatus(task.getStatus());
        } else {
            response.setStatus(Task.TaskStatus.ASSIGNED);
        }

        response.setStatusReason(task.getStatusReason());
        response.setDeadlineDate(task.getDeadlineDate());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());

        if (task.getStore() != null) {
            response.setStoreId(task.getStore().getId());
            response.setStoreName(task.getStore().getName());
        }

        if (task.getAssignee() != null) {
            response.setAssigneeId(task.getAssignee().getId());
            response.setAssigneeName(task.getAssignee().getFullName());
        }

        if (task.getCreatedBy() != null) {
            response.setCreatedById(task.getCreatedBy().getId());
            response.setCreatedByName(task.getCreatedBy().getFullName());
        }

        // Set document and payment counts to 0 to avoid lazy loading issues
        // TODO: Add dedicated repository methods to count documents and payments if
        // needed
        response.setDocumentCount(0);
        response.setPaymentCount(0);

        return response;
    }
}
