package com.licensing.portal.controller;

import com.licensing.portal.model.Region;
import com.licensing.portal.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
public class RegionController {

    @Autowired
    private RegionService regionService;

    @GetMapping
    public ResponseEntity<List<Region>> getAllRegions() {
        return ResponseEntity.ok(regionService.getAllRegions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Region> getRegionById(@PathVariable Long id) {
        return ResponseEntity.ok(regionService.getRegionById(id));
    }

    @PostMapping
    public ResponseEntity<Region> createRegion(@RequestBody Region region) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(regionService.createRegion(region));
    }

    // @PutMapping("/{id}")
    // public ResponseEntity<Region> updateRegion(@PathVariable Long id,
    // @RequestBody Region region) {
    // return ResponseEntity.ok(regionService.updateRegion(id, region));
    // }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteRegion(@PathVariable Long id) {
    // regionService.deleteRegion(id);
    // return ResponseEntity.noContent().build();
    // }

    @GetMapping("/search")
    public ResponseEntity<List<Region>> searchRegions(@RequestParam String name) {
        return ResponseEntity.ok(regionService.searchByName(name));
    }

    @GetMapping("/by-license-type")
    public ResponseEntity<List<Region>> getByLicenseType(@RequestParam String licenseType) {
        return ResponseEntity.ok(regionService.getByLicenseType(licenseType));
    }
}
