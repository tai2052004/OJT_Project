package com.repository;

import com.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByUsername(String username);
    Users findByEmail(String email);

    @Query("SELECT u FROM Users u LEFT JOIN FETCH u.userDetail")
    List<Users> findAllUsersWithDetails();

    @Query("SELECT u FROM Users u LEFT JOIN FETCH u.userDetail WHERE u.role = 'user'")
    List<Users> findAllUsersWithDetailsByRole();

    @Query("SELECT u FROM Users u LEFT JOIN FETCH u.userDetail WHERE u.id = :userId")
    Users findUserById(@Param("userId") Long userId);


}
