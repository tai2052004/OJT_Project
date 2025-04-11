package com.repository;

import com.model.PremiumPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PremiumPlanRepository  extends JpaRepository<PremiumPlan, Long> {
    PremiumPlan findPremiumPlanById(Long id);
}
