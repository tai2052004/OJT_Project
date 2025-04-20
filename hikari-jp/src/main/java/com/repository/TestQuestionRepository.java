package com.repository;

import com.model.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestion, Integer> {

}
