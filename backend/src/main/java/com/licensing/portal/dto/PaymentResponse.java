package com.licensing.portal.dto;

import com.licensing.portal.model.Payment;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private Long id;
    private Long taskId;
    private String taskTitle;
    private BigDecimal amount;
    private Payment.PaymentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime paymentDate;
    private String paymentReference;
    private String notes;

    private Payment.PaymentType type;

    private String region;
    private String retailNetwork;
    private String legalEntity;
    private String paymentRecipient;
    private java.util.List<Long> storeIds;
    private String oktmo;
    private Boolean bankMarkRequired;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Payment.PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(Payment.PaymentStatus status) {
        this.status = status;
    }

    public Payment.PaymentType getType() {
        return type;
    }

    public void setType(Payment.PaymentType type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getRetailNetwork() {
        return retailNetwork;
    }

    public void setRetailNetwork(String retailNetwork) {
        this.retailNetwork = retailNetwork;
    }

    public String getLegalEntity() {
        return legalEntity;
    }

    public void setLegalEntity(String legalEntity) {
        this.legalEntity = legalEntity;
    }

    public String getPaymentRecipient() {
        return paymentRecipient;
    }

    public void setPaymentRecipient(String paymentRecipient) {
        this.paymentRecipient = paymentRecipient;
    }

    public java.util.List<Long> getStoreIds() {
        return storeIds;
    }

    public void setStoreIds(java.util.List<Long> storeIds) {
        this.storeIds = storeIds;
    }

    public String getOktmo() {
        return oktmo;
    }

    public void setOktmo(String oktmo) {
        this.oktmo = oktmo;
    }

    public Boolean getBankMarkRequired() {
        return bankMarkRequired;
    }

    public void setBankMarkRequired(Boolean bankMarkRequired) {
        this.bankMarkRequired = bankMarkRequired;
    }
}
