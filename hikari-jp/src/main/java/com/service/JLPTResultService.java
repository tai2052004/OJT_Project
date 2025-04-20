package com.service;

import com.model.JLPTTestResult;
import com.model.UserAnswer;
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

    public JLPTTestResult saveJLPTResult(JLPTTestResult jlptResult) {
        JLPTTestResult savedResult = jlptResultRepository.save(jlptResult);
        return savedResult;
    }

    public List<UserAnswer> findUserAnswerByResultID(int rsID) {
        return jlptResultRepository.findUserAnswerByResultId(rsID);
    }

    public JLPTTestResult findById(int id) {
        return jlptResultRepository.findById(id).orElse(null);
    }
}
