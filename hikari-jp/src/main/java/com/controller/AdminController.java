package com.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.model.UserDetail;
import com.model.Users;
import com.repository.UserDetailRepository;
import com.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

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
    public ResponseEntity<?> deleteUser(@PathVariable Long id, HttpSession session) {
        Users currentUser = (Users) session.getAttribute("user");
        if (id.equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot delete your own account.");
        }
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add-user")
    @ResponseBody
    public ResponseEntity<?> addUser(
            @RequestParam("userData") String userDataJson,
            @RequestParam(value = "avatar", required = false) MultipartFile avatarFile) {

        try {
            // Parse user data from JSON
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            Users newUser = objectMapper.readValue(userDataJson, Users.class);

            // Check if username or email already exists
            if (userRepository.findByUsername(newUser.getUsername()) != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Username already exists");
            }

            if (userRepository.findByEmail(newUser.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Email already exists");
            }

            // Create user detail if not exists
            UserDetail userDetail = newUser.getUserDetail();
            if (userDetail == null) {
                userDetail = new UserDetail();
                newUser.setUserDetail(userDetail);
            }

            // Handle avatar upload
            if (avatarFile != null && !avatarFile.isEmpty()) {
                String fileName = saveFile(avatarFile);
                userDetail.setAvatar(fileName);
            }
            newUser.setUserDetail(userDetail);

            // Save user and user detail
            userRepository.save(newUser);

            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding user: " + e.getMessage());
        }
    }

    // Helper method to save file
    private String saveFile(MultipartFile file) throws IOException {
        // Tạo tên file duy nhất
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + extension;
        String uploadDir = "upload/";
        File uploadDirFile = new File(uploadDir);

        // Tạo thư mục nếu chưa có
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }

        // Lưu file vào thư mục tĩnh
        Path path = Paths.get(uploadDir, newFilename);
        file.transferTo(path);

        return newFilename;
    }
}
