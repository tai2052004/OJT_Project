package com.service;

import com.model.TestLevel;
import com.repository.TestLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestLevelService {

    @Autowired
    TestLevelRepository testLevelRepository;

    public TestLevel getTestLevelById(int id) {
        return testLevelRepository.findById(id).orElse(null);
    }
}
