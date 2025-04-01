package com.hikari.hikari_jp.repository;

import com.hikari.hikari_jp.entity.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailRepository extends JpaRepository<UserDetail, Integer> {
    UserDetail findByUserId(Long userId);
}
