package com.service;

import com.model.UserDetail;
import com.repository.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserDetailService {

    @Autowired
    private UserDetailRepository userDetailRepository;

    public UserDetail getUserDetailById(Long userId) {
        return userDetailRepository.findByUserId(userId);
    }

    public void updateUserAvatar(Long userid, String filename) {
        UserDetail user = userDetailRepository.findByUserId(userid);
        if (user != null) {
            user.setAvatar(filename);
            userDetailRepository.save(user);
        }
    }
}