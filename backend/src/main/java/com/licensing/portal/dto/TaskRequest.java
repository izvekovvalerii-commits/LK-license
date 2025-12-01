package com.licensing.portal.dto;

import com.licensing.portal.model.Task;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private Task.LicenseType licenseType;
    private Task.ActionType actionType;
    private Long storeId;
    private Long assigneeId;
    private LocalDate deadlineDate;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Task.LicenseType getLicenseType() {
        return licenseType;
    }

    public void setLicenseType(Task.LicenseType licenseType) {
        this.licenseType = licenseType;
    }

    public Task.ActionType getActionType() {
        return actionType;
    }

    public void setActionType(Task.ActionType actionType) {
        this.actionType = actionType;
    }

    public Long getStoreId() {
        return storeId;
    }

    public void setStoreId(Long storeId) {
        this.storeId = storeId;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public LocalDate getDeadlineDate() {
        return deadlineDate;
    }

    public void setDeadlineDate(LocalDate deadlineDate) {
        this.deadlineDate = deadlineDate;
    }

    private Task.TaskStatus status;
    private String statusReason;
    private Task.SubtaskType subtaskType;

    public Task.TaskStatus getStatus() {
        return status;
    }

    public void setStatus(Task.TaskStatus status) {
        this.status = status;
    }

    public String getStatusReason() {
        return statusReason;
    }

    public void setStatusReason(String statusReason) {
        this.statusReason = statusReason;
    }

    public Task.SubtaskType getSubtaskType() {
        return subtaskType;
    }

    public void setSubtaskType(Task.SubtaskType subtaskType) {
        this.subtaskType = subtaskType;
    }

    private LocalDate plannedStartDate;
    private LocalDate plannedEndDate;

    public LocalDate getPlannedStartDate() {
        return plannedStartDate;
    }

    public void setPlannedStartDate(LocalDate plannedStartDate) {
        this.plannedStartDate = plannedStartDate;
    }

    public LocalDate getPlannedEndDate() {
        return plannedEndDate;
    }

    public void setPlannedEndDate(LocalDate plannedEndDate) {
        this.plannedEndDate = plannedEndDate;
    }
}
