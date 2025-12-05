package com.licensing.portal.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "egrn_extracts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EgrnExtract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "applicant_type")
    private String applicantType;

    private String phone;
    private String email;

    @Column(name = "cadastral_number")
    private String cadastralNumber;

    @Column(name = "object_type")
    private String objectType;

    private String mvz;

    @Enumerated(EnumType.STRING)
    private EgrnStatus status = EgrnStatus.DRAFT;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApplicantType() {
        return applicantType;
    }

    public void setApplicantType(String applicantType) {
        this.applicantType = applicantType;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCadastralNumber() {
        return cadastralNumber;
    }

    public void setCadastralNumber(String cadastralNumber) {
        this.cadastralNumber = cadastralNumber;
    }

    public String getObjectType() {
        return objectType;
    }

    public void setObjectType(String objectType) {
        this.objectType = objectType;
    }

    public String getMvz() {
        return mvz;
    }

    public void setMvz(String mvz) {
        this.mvz = mvz;
    }

    public EgrnStatus getStatus() {
        return status;
    }

    public void setStatus(EgrnStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public enum EgrnStatus {
        DRAFT, SUBMITTED, PROCESSING, COMPLETED, REJECTED
    }
}
