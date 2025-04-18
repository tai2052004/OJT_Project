package com.service;

import com.model.JLPTTestResult;
import com.repository.JLPTResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JLPTResultService {

    @Autowired
    JLPTResultRepository jlptResultRepository;

    public List<JLPTTestResult> findByJLPTResultByUserID(int userID) {
        return jlptResultRepository.findByJLPTResultByUserID(userID);
    }

    public void saveJLPTResult(JLPTTestResult jlptResult) {
         jlptResultRepository.save(jlptResult);
    }
}
