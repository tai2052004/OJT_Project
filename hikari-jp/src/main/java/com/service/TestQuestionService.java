package com.service;

import com.model.TestQuestion;
import com.repository.TestQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestQuestionService {

    @Autowired
    TestQuestionRepository testQuestionRepository;

    public TestQuestion findById(int id) {
        return testQuestionRepository.findById(id).orElse(null);
    }
}
