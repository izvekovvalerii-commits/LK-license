package com.licensing.portal.repository;

import com.licensing.portal.model.EgrnExtract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EgrnExtractRepository extends JpaRepository<EgrnExtract, Long> {
}
