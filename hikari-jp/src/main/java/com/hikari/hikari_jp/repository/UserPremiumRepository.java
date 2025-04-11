package com.hikari.hikari_jp.repository;

import com.hikari.hikari_jp.entity.UserPremium;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserPremiumRepository extends JpaRepository<UserPremium, Long> {
    UserPremium findByUserId(Long userId);
}
