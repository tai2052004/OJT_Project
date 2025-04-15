package com.controller;

import com.model.TransactionHistory;
import com.model.UserDetail;
import com.model.Users;
import com.repository.TransactionHistoryRepository;
import com.repository.UserDetailRepository;
import com.repository.UserRepository;
import com.service.UserDetailService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

@Controller
public class ProfileController {
    @Autowired
    private UserDetailService userDetailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionHistoryRepository transactionHistoryRepository;

    @Autowired
    private UserDetailRepository userDetailRepository;

    @GetMapping("/profile")
    public String profile(Model model, HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        UserDetail userDetail = userDetailService.getUserDetailById(user.getId());
        model.addAttribute("user", user);
        model.addAttribute("userDetail", userDetail);
        return "profile";
    }

    @PostMapping("/profile")
    public String updateProfile(@RequestParam String fullName, @RequestParam String email, @RequestParam String phoneNumber, @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate birthdate,
                                HttpSession session, RedirectAttributes redirectAttributes) {
        Users currentUser = (Users) session.getAttribute("user");
        if (currentUser == null) {
            redirectAttributes.addFlashAttribute("error", "User not logged in!");
            return "redirect:/landingPage";
        }

        // Lấy thông tin user detail hiện tại
        UserDetail userDetail = userDetailService.getUserDetailById(currentUser.getId());
        if (userDetail != null) {
            userDetail.setFullName(fullName);
            userDetail.setPhoneNumber(phoneNumber);
            userDetail.setBirthdate(birthdate);
            userDetailRepository.save(userDetail);
        }
        redirectAttributes.addFlashAttribute("success", "Edit Profile Successfully!");
        return "redirect:/profile";
    }

    @GetMapping("/transaction-history")
    public String transactionHistory(Model model, HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        UserDetail userDetail = userDetailService.getUserDetailById(user.getId());
        List<TransactionHistory> trans = transactionHistoryRepository.findAllById(user.getId());
        model.addAttribute("user", user);
        model.addAttribute("userDetail", userDetail);
        model.addAttribute("trans", trans);
        return "Transaction";
    }

    @GetMapping("/security")
    public String changePassword(Model model, HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        UserDetail userDetail = userDetailService.getUserDetailById(user.getId());
        model.addAttribute("user", user);
        model.addAttribute("userDetail", userDetail);
        return "Security";
    }

    @PostMapping("/security")
    public String changePassword(@RequestParam String oldPassword, @RequestParam String newPassword, @RequestParam String reNewPassword, Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        Users user = (Users) session.getAttribute("user");
        if (!user.getPassword().equals(oldPassword)) {
            redirectAttributes.addFlashAttribute("error", "Old password not correct!");
            model.addAttribute("oldPassword", oldPassword);
            model.addAttribute("newPassword", newPassword);
            return "security";
        }
        if (!newPassword.equals(reNewPassword)) {
            redirectAttributes.addFlashAttribute("error", "Confirm new password do not match!");
            model.addAttribute("oldPassword", oldPassword);
            model.addAttribute("newPassword", newPassword);
            return "security";
        }

        user.setPassword(newPassword);
        userRepository.save(user);
        redirectAttributes.addFlashAttribute("success", "Password changed successfully!");
        return "redirect:/security";
    }

    @PostMapping("/update-avatar")
    public String updateAvatar(@RequestParam("avatar") MultipartFile file, RedirectAttributes redirectAttributes, HttpSession session) {
        try {
            if (file.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "No file selected!");
                return "redirect:/profile";
            }

            // Tạo tên file duy nhất
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadDir = "upload/";
            File uploadDirFile = new File(uploadDir);
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs(); // Tạo thư mục nếu chưa có
            }
            Path path = Paths.get(uploadDir, filename);

            // Lưu file vào thư mục tĩnh
            file.transferTo(path);

            Users user = (Users) session.getAttribute("user");
            userDetailService.updateUserAvatar(user.getId(), filename);
            redirectAttributes.addFlashAttribute("success", "Avatar updated successfully!");
            return "redirect:/profile";
        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("error", "Failed to upload avatar.");
            return "redirect:/profile";
        }
    }
}
