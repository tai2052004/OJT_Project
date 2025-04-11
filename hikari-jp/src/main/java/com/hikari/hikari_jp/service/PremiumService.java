package com.hikari.hikari_jp.service;

import com.hikari.hikari_jp.entity.PremiumPlan;
import com.hikari.hikari_jp.entity.TransactionHistory;
import com.hikari.hikari_jp.entity.UserPremium;
import com.hikari.hikari_jp.repository.PremiumPlanRepository;
import com.hikari.hikari_jp.repository.TransactionHistoryRepository;
import com.hikari.hikari_jp.repository.UserPremiumRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class PremiumService {

    @Autowired
    private PremiumPlanRepository premiumPlanRepo;

    @Autowired
    private UserPremiumRepository userPremiumRepo;

    @Autowired
    private TransactionHistoryRepository transactionHistoryRepo;

    public List<PremiumPlan> getAllPlans() {
        return premiumPlanRepo.findAll();
    }

    public UserPremium getUserPremium(Long userId) {
        return userPremiumRepo.findByUserId(userId);
    }

    public PremiumPlan getPremiumPlanByPlanId(Long premiumPlanId) {
        return premiumPlanRepo.findPremiumPlanById(premiumPlanId);
    }

    public int getRemainingDays(UserPremium userPremium) {
        if (userPremium.getEndDate() == null) return -1;
        return (int) ChronoUnit.DAYS.between(LocalDate.now(), userPremium.getEndDate());
    }

    @Transactional
    public void buyPremium(Long userId, Long planId) {
        PremiumPlan plan = premiumPlanRepo.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));

        UserPremium userPremium = userPremiumRepo.findByUserId(userId);
        if (userPremium == null) {
            userPremium = new UserPremium();
        }
        userPremium.setUserId(userId);
        userPremium.setPlanId(planId);
//        userPremium.setPremiumPlan(plan);
        userPremium.setStartDate(LocalDate.now());

        if (plan.getDurationInDays() != null) {
            LocalDate endDate = userPremium.getEndDate();
            if (endDate != null && endDate.isAfter(LocalDate.now())) {
                endDate = endDate.plusDays(plan.getDurationInDays());
            } else {
                endDate = LocalDate.now().plusDays(plan.getDurationInDays());
            }
            userPremium.setEndDate(endDate);
        } else {
            userPremium.setEndDate(null); // Vĩnh viễn
        }

        userPremiumRepo.save(userPremium);

        TransactionHistory transaction = new TransactionHistory();
        transaction.setUserId(userId);
        transaction.setPlanId(planId);
        transaction.setAmount(plan.getPrice());
        transaction.setPaymentMethod("credit card"); // test chi dung credit card
        transaction.setTransactionDate(LocalDateTime.now());

        transactionHistoryRepo.save(transaction);
    }


}

