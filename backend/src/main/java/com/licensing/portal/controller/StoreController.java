package com.licensing.portal.controller;

import com.licensing.portal.model.Store;
import com.licensing.portal.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/references/stores")
public class StoreController {

    @Autowired
    private StoreRepository storeRepository;

    @GetMapping
    public ResponseEntity<List<Store>> getAllStores() {
        return ResponseEntity.ok(storeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Store> getStoreById(@PathVariable Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        return ResponseEntity.ok(store);
    }

    @PostMapping
    public ResponseEntity<Store> createStore(@RequestBody Store store) {
        Store savedStore = storeRepository.save(store);
        return ResponseEntity.ok(savedStore);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Store> updateStore(@PathVariable Long id, @RequestBody Store storeDetails) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        store.setName(storeDetails.getName());
        store.setMvz(storeDetails.getMvz());
        store.setAddress(storeDetails.getAddress());
        store.setCfo(storeDetails.getCfo());
        store.setOktmo(storeDetails.getOktmo());
        store.setHasRestriction(storeDetails.getHasRestriction());
        store.setMunArea(storeDetails.getMunArea());
        store.setMunDistrict(storeDetails.getMunDistrict());
        store.setBe(storeDetails.getBe());
        store.setCloseDate(storeDetails.getCloseDate());
        store.setInn(storeDetails.getInn());
        store.setKpp(storeDetails.getKpp());
        store.setContactPerson(storeDetails.getContactPerson());
        store.setPhone(storeDetails.getPhone());
        store.setEmail(storeDetails.getEmail());
        store.setIsActive(storeDetails.getIsActive());

        Store updatedStore = storeRepository.save(store);
        return ResponseEntity.ok(updatedStore);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
