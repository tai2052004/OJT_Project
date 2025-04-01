package com.hikari.hikari_jp.service;

import com.hikari.hikari_jp.entity.UserDetail;
import com.hikari.hikari_jp.repository.UserDetailRepository;
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
            user.setAvatar(filename);  // Cập nhật tên avatar vào cơ sở dữ liệu
            userDetailRepository.save(user);  // Lưu lại thông tin người dùng
        }
    }
}