package com.licensing.portal.repository;

import com.licensing.portal.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
    List<Region> findByNameContainingIgnoreCase(String name);

    List<Region> findByRegionCode(String regionCode);

    List<Region> findByLicenseType(String licenseType);
}
