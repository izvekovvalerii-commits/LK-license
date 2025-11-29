package com.licensing.portal.repository;

import com.licensing.portal.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findByInn(String inn);

    List<Store> findByIsActive(Boolean isActive);

    List<Store> findByNameContainingIgnoreCase(String name);

    // Find stores with expiring alcohol licenses
    List<Store> findByIsActiveTrueAndAlcoholLicenseExpiryLessThanEqual(LocalDate date);

    // Find stores with expiring tobacco licenses
    List<Store> findByIsActiveTrueAndTobaccoLicenseExpiryLessThanEqual(LocalDate date);
}
