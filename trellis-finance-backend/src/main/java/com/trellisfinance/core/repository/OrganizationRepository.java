package com.trellisfinance.core.repository;

import com.trellisfinance.core.model.OrganizationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<OrganizationEntity, UUID> {
    List<OrganizationEntity> findAllByParentOrgId(UUID parentOrgId);
    List<OrganizationEntity> findAllByParentOrgIdIsNull();
}
