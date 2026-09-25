package com.grocery.repository;

import com.grocery.entity.ExpiryRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpiryRuleRepository extends JpaRepository<ExpiryRule, Long> {
    List<ExpiryRule> findByActiveTrue();
}
