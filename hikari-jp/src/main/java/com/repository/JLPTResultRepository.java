package com.repository;

import com.model.JLPTTestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JLPTResultRepository extends JpaRepository<JLPTTestResult, Integer> {

    @Query("SELECT DISTINCT jt FROM JLPTTestResult jt " +
            "WHERE jt.user.id = :userID")
    List<JLPTTestResult> findByJLPTResultByUserID(@Param("userID") int userID);

}
