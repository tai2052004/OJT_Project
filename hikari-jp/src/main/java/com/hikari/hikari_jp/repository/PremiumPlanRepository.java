package com.hikari.hikari_jp.repository;

import com.hikari.hikari_jp.entity.PremiumPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PremiumPlanRepository  extends JpaRepository<PremiumPlan, Long> {
    PremiumPlan findPremiumPlanById(Long id);
}
