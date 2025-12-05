package com.licensing.portal.controller;

import com.licensing.portal.model.EgrnExtract;
import com.licensing.portal.service.EgrnExtractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/egrn-extracts")
@CrossOrigin(origins = "*")
public class EgrnExtractController {

    @Autowired
    private EgrnExtractService service;

    @PostMapping
    public ResponseEntity<EgrnExtract> createExtract(@RequestBody EgrnExtract extract) {
        return ResponseEntity.ok(service.createExtract(extract));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EgrnExtract> getExtractById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getExtractById(id));
    }

    @GetMapping
    public ResponseEntity<List<EgrnExtract>> getAllExtracts() {
        return ResponseEntity.ok(service.getAllExtracts());
    }
}
