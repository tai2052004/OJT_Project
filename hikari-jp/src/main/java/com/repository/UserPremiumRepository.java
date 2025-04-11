package com.repository;

import com.model.UserPremium;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPremiumRepository extends JpaRepository<UserPremium, Long> {
    UserPremium findByUserId(Long userId);
}
