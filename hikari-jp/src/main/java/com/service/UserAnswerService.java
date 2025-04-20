package com.service;

import com.model.UserAnswer;
import com.repository.UserAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAnswerService {

    @Autowired
    UserAnswerRepository userAnswerRepository;

    public void saveUserAnswer(UserAnswer userAnswer) {
        userAnswerRepository.save(userAnswer);
    }
}
