package com.licensing.portal.service;

import com.licensing.portal.model.EgrnExtract;
import com.licensing.portal.repository.EgrnExtractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EgrnExtractService {

    @Autowired
    private EgrnExtractRepository repository;

    public EgrnExtract createExtract(EgrnExtract extract) {
        extract.setStatus(EgrnExtract.EgrnStatus.SUBMITTED);
        return repository.save(extract);
    }

    public EgrnExtract getExtractById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Extract not found"));
    }

    public List<EgrnExtract> getAllExtracts() {
        return repository.findAll();
    }
}
