package com.licensing.portal.service;

import com.licensing.portal.model.Region;
import com.licensing.portal.repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RegionService {

    @Autowired
    private RegionRepository regionRepository;

    public List<Region> getAllRegions() {
        return regionRepository.findAll();
    }

    public Region getRegionById(Long id) {
        return regionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Region not found with id: " + id));
    }

    @Transactional
    public Region createRegion(Region region) {
        return regionRepository.save(region);
    }

    @Transactional
    public Region updateRegion(Long id, Region regionDetails) {
        Region existingRegion = getRegionById(id);

        // Update fields of the existing entity with values from regionDetails
        // Assuming Region has fields like name, licenseType, etc.
        // You should add setters for all fields that can be updated
        if (regionDetails.getName() != null) {
            existingRegion.setName(regionDetails.getName());
        }
        if (regionDetails.getLicenseType() != null) {
            existingRegion.setLicenseType(regionDetails.getLicenseType());
        }
        // Add other fields as necessary, e.g.:
        // if (regionDetails.getDescription() != null) {
        // existingRegion.setDescription(regionDetails.getDescription());
        // }

        // The id and createdAt fields should typically not be updated from the incoming
        // DTO
        // They are preserved from the existing entity.

        return regionRepository.save(existingRegion);
    }

    @Transactional
    public void deleteRegion(Long id) {
        Region region = getRegionById(id);
        regionRepository.delete(region);
    }

    public List<Region> searchByName(String name) {
        return regionRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Region> getByLicenseType(String licenseType) {
        return regionRepository.findByLicenseType(licenseType);
    }
}
