package com.licensing.portal.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "stores")
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mvz", length = 10)
    private String mvz;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 300)
    private String address;

    @Column(name = "cfo", length = 10)
    private String cfo;

    @Column(name = "oktmo", length = 11)
    private String oktmo;

    @Column(name = "has_restriction")
    private Boolean hasRestriction = false;

    @Column(name = "mun_area", length = 100)
    private String munArea;

    @Column(name = "mun_district", length = 100)
    private String munDistrict;

    @Column(name = "be", length = 200)
    private String be;

    @Column(name = "close_date")
    private LocalDate closeDate;

    @Column(name = "director_phone", length = 20)
    private String directorPhone;

    @Column(unique = true, nullable = false, length = 12)
    private String inn;

    @Column(length = 9)
    private String kpp;

    @Column(length = 100)
    private String contactPerson;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(name = "alcohol_license_expiry")
    private java.time.LocalDate alcoholLicenseExpiry;

    @Column(name = "tobacco_license_expiry")
    private java.time.LocalDate tobaccoLicenseExpiry;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDirectorPhone() {
        return directorPhone;
    }

    public void setDirectorPhone(String directorPhone) {
        this.directorPhone = directorPhone;
    }

    public String getInn() {
        return inn;
    }

    public void setInn(String inn) {
        this.inn = inn;
    }

    public String getKpp() {
        return kpp;
    }

    public void setKpp(String kpp) {
        this.kpp = kpp;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
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

    public java.time.LocalDate getAlcoholLicenseExpiry() {
        return alcoholLicenseExpiry;
    }

    public void setAlcoholLicenseExpiry(java.time.LocalDate alcoholLicenseExpiry) {
        this.alcoholLicenseExpiry = alcoholLicenseExpiry;
    }

    public java.time.LocalDate getTobaccoLicenseExpiry() {
        return tobaccoLicenseExpiry;
    }

    public void setTobaccoLicenseExpiry(java.time.LocalDate tobaccoLicenseExpiry) {
        this.tobaccoLicenseExpiry = tobaccoLicenseExpiry;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public Boolean isActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getMvz() {
        return mvz;
    }

    public void setMvz(String mvz) {
        this.mvz = mvz;
    }

    public String getCfo() {
        return cfo;
    }

    public void setCfo(String cfo) {
        this.cfo = cfo;
    }

    public String getOktmo() {
        return oktmo;
    }

    public void setOktmo(String oktmo) {
        this.oktmo = oktmo;
    }

    public Boolean getHasRestriction() {
        return hasRestriction;
    }

    public void setHasRestriction(Boolean hasRestriction) {
        this.hasRestriction = hasRestriction;
    }

    public String getMunArea() {
        return munArea;
    }

    public void setMunArea(String munArea) {
        this.munArea = munArea;
    }

    public String getMunDistrict() {
        return munDistrict;
    }

    public void setMunDistrict(String munDistrict) {
        this.munDistrict = munDistrict;
    }

    public String getBe() {
        return be;
    }

    public void setBe(String be) {
        this.be = be;
    }

    public LocalDate getCloseDate() {
        return closeDate;
    }

    public void setCloseDate(LocalDate closeDate) {
        this.closeDate = closeDate;
    }

}
