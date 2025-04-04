package com.hikari.hikari_jp.controller;

import com.hikari.hikari_jp.entity.UserDetail;
import com.hikari.hikari_jp.entity.Users;
import com.hikari.hikari_jp.repository.UserDetailRepository;
import com.hikari.hikari_jp.repository.UserRepository;
import com.hikari.hikari_jp.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    private UserDetailRepository userDetailRepository;

    @GetMapping("/userManagement")
    public String userManagement(Model model) {
        List<Users> usersWithDetails = userRepository.findAllUsersWithDetails();
        model.addAttribute("users", usersWithDetails);
        return "user-management";
    }

    @GetMapping("/edit-user/{id}")
    @ResponseBody
    public ResponseEntity<Users> getUserById(@PathVariable Long id) {
        Users user = userRepository.findUserById(id);

        if (user != null) {
            return ResponseEntity.ok(user); // Tra ve user voi HTTP 200
        } else {
            return ResponseEntity.notFound().build(); //Tra ve HTTP 404
        }
    }

    @PostMapping("/save-user/{id}")
    @ResponseBody
    public ResponseEntity<Users> updateUser(@PathVariable Long id, @RequestBody Users updatedUser) {
        Users user = userRepository.findUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setRole(updatedUser.getRole());
        if (user.getUserDetail() == null) {
            user.setUserDetail(new UserDetail());  // Nếu chưa có userDetail, tạo mới
        }
        UserDetail userDetail = user.getUserDetail();
        userDetail.setFullName(updatedUser.getUserDetail().getFullName());
        userDetail.setPhoneNumber(updatedUser.getUserDetail().getPhoneNumber());
        userDetail.setBirthdate(updatedUser.getUserDetail().getBirthdate());


        userRepository.save(user);
        userDetailRepository.save(userDetail);
        return ResponseEntity.ok(user);
    }

}
