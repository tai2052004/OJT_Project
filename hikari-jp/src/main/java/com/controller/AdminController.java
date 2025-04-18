package com.controller;

import com.model.UserDetail;
import com.model.Users;
import com.repository.UserDetailRepository;
import com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    private UserDetailRepository userDetailRepository;

    @GetMapping("/userManagement")
    public String userManagement(Model model) {
        List<Users> usersWithDetails = userRepository.findAllUsersWithDetailsByRole();
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

    @GetMapping("/delete-user/{id}")
    @ResponseBody
    public ResponseEntity<Users> getDeleteUser(@PathVariable Long id) {
        Users user = userRepository.findUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    //Save User
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

    @GetMapping("/reset-password/{id}")
    @ResponseBody
    public ResponseEntity<Users> getResetUser(@PathVariable Long id) {
        Users user = userRepository.findUserById(id);

        if (user != null) {
            return ResponseEntity.ok(user); // Tra ve user voi HTTP 200
        } else {
            return ResponseEntity.notFound().build(); //Tra ve HTTP 404
        }
    }


    @PostMapping("/reset-password/{id}")
    public ResponseEntity<?> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Users user = userRepository.findUserById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        }

        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password cannot be empty!");
        }
        user.setPassword(newPassword);
        userRepository.save(user);
        return ResponseEntity.ok("Password updated successfully!");
    }

    @DeleteMapping("delete-user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
