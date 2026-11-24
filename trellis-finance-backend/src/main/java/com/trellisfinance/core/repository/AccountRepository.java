package com.trellisfinance.core.repository;

import com.trellisfinance.core.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    List<Account> findAllByOrganizationId(UUID organizationId);

    @Query("SELECT SUM(a.currentBalance) FROM Account a WHERE a.organizationId = :orgId")
    BigDecimal sumBalanceByOrganizationId(@Param("orgId") UUID orgId);

    long countByOrganizationId(UUID organizationId);
}
