package com.repository;

import com.model.TestLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestLevelRepository extends JpaRepository<TestLevel, Integer> {
}
