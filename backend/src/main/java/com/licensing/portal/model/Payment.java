package com.licensing.portal.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(length = 100)
    private String paymentReference;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaymentType type;

    @Column(name = "task_id")
    private Long taskId;

    @Column(length = 100)
    private String region;

    @Column(name = "retail_network", length = 100)
    private String retailNetwork;

    @Column(name = "legal_entity", length = 100)
    private String legalEntity;

    @Column(name = "payment_recipient", length = 100)
    private String paymentRecipient;

    @Column(length = 20)
    private String oktmo;

    @Column(name = "bank_mark_required")
    private Boolean bankMarkRequired = false;

    @ManyToMany
    @JoinTable(name = "payment_stores", joinColumns = @JoinColumn(name = "payment_id"), inverseJoinColumns = @JoinColumn(name = "store_id"))
    private java.util.List<Store> stores;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, CANCELLED
    }

    public enum PaymentType {
        STATE_FEE, FINE, OTHER
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public PaymentType getType() {
        return type;
    }

    public void setType(PaymentType type) {
        this.type = type;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
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

    public java.util.List<Store> getStores() {
        return stores;
    }

    public void setStores(java.util.List<Store> stores) {
        this.stores = stores;
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
