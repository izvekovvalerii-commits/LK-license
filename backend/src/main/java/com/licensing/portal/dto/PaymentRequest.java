package com.licensing.portal.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

public class PaymentRequest {

    private Long taskId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String notes;

    private com.licensing.portal.model.Payment.PaymentType type;

    private String region;
    private String retailNetwork;
    private String legalEntity;
    private String paymentRecipient;
    private java.util.List<Long> storeIds;
    private String oktmo;
    private Boolean bankMarkRequired;

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
