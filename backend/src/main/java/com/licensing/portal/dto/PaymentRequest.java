package com.licensing.portal.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

public class PaymentRequest {

    @NotNull(message = "Task ID is required")
    private Long taskId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String notes;

    private com.licensing.portal.model.Payment.PaymentType type;

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public com.licensing.portal.model.Payment.PaymentType getType() {
        return type;
    }

    public void setType(com.licensing.portal.model.Payment.PaymentType type) {
        this.type = type;
    }
}
