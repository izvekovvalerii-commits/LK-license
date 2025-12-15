package com.licensing.portal.controller;

import com.licensing.portal.dto.TaskRequest;
import com.licensing.portal.dto.TaskResponse;
import com.licensing.portal.model.Task;
import com.licensing.portal.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(taskService.getAllTasks(username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(taskService.createTask(request, username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,
            @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable Long id,
            @RequestParam Task.TaskStatus status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/deadlines/upcoming")
    public ResponseEntity<List<TaskResponse>> getUpcomingDeadlines(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(taskService.getUpcomingDeadlines(days));
    }

    @GetMapping("/{id}/subtasks")
    public ResponseEntity<List<TaskResponse>> getSubtasks(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getSubtasks(id));
    }

    @PostMapping("/{id}/subtasks")
    public ResponseEntity<TaskResponse> createSubtask(@PathVariable Long id,
            @RequestBody TaskRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(taskService.createSubtask(id, request, username));
    }

    @PutMapping("/{id}/planned-dates")
    public ResponseEntity<TaskResponse> updatePlannedDates(@PathVariable Long id,
            @RequestParam String plannedStartDate,
            @RequestParam String plannedEndDate) {
        return ResponseEntity.ok(taskService.updatePlannedDates(id, plannedStartDate, plannedEndDate));
    }
}
