package com.service;

import com.model.PremiumPlan;
import com.model.TransactionHistory;
import com.model.UserPremium;
import com.model.Users;
import com.repository.PremiumPlanRepository;
import com.repository.TransactionHistoryRepository;
import com.repository.UserPremiumRepository;
import com.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PremiumService {

    @Autowired
    UserRepository usersRepository;
    @Autowired
    private PremiumPlanRepository premiumPlanRepo;

    @Autowired
    private UserPremiumRepository userPremiumRepo;

    @Autowired
    private TransactionHistoryRepository transactionHistoryRepo;

    public List<PremiumPlan> getAllPlans() {
        return premiumPlanRepo.findAll();
    }

    public PremiumPlan getPlanById(long id) {return premiumPlanRepo.findPremiumPlanById(id);}

    public PremiumPlan getPremiumPlanByPlanId(Long premiumPlanId) {
        return premiumPlanRepo.findPremiumPlanById(premiumPlanId);
    }

    public UserPremium getUserPremium(Long userId) {
        UserPremium premiumUser = userPremiumRepo.findByUserId(userId);
        boolean isLifetime = false;
        if (premiumUser == null) {
            return null;
        }
        if (premiumUser.getPlanId() == 3){
            isLifetime = true;
        }
        boolean isActive = isLifetime ||
                (premiumUser.getEndDate() != null && premiumUser.getEndDate().isAfter(LocalDate.now()));

        premiumUser.setLifetime(isLifetime);
        premiumUser.setActive(isActive);

        return premiumUser;
    }

    @Transactional
    public void buyPremium(Long userId, Long planId, String transactionId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PremiumPlan plan = premiumPlanRepo.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));

        // Tim nguoi dung co goi khong
        UserPremium userPremium = userPremiumRepo.findByUserId(userId);
        if (userPremium == null) {
            userPremium = new UserPremium();
            userPremium.setUserId(userId);
        }
        userPremium.setPlanId(planId);
        userPremium.setStartDate(LocalDate.now());

        if (plan.getDurationInMonths() != null) {
            // Gói có thời hạn
            LocalDate newEndDate = LocalDate.now().plusMonths(plan.getDurationInMonths());
            userPremium.setEndDate(newEndDate);
        } else {
            // Gói vĩnh viễn
            userPremium.setEndDate(null);
        }

        // Lưu thông tin gói mới
        userPremiumRepo.save(userPremium);

        // Ghi log giao dịch
        TransactionHistory transaction = new TransactionHistory();
        transaction.setUser(user); // <-- set the entire User object
        transaction.setPlanId(planId);
        transaction.setTransactionId(transactionId);
        transaction.setAmount(plan.getPrice());
        transaction.setPaymentMethod("credit card"); // sandbox chi co credit
        transaction.setTransactionDate(LocalDateTime.now());

        transactionHistoryRepo.save(transaction);
    }


    private LocalDate addMonths(LocalDate date, Integer months) {
        if (months == null) return date;
        return date.plusMonths(months);
    }


}

