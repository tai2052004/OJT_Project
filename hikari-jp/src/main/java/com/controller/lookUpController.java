package com.controller;

import com.model.UserPremium;
import com.model.Users;
import com.service.PremiumService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class lookUpController {
    @Autowired
    private PremiumService premiumService;

    @GetMapping("/lookUp")
    public String lookUp(Model model, HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if (user == null) {
            model.addAttribute("alertMessage", "Please sign in");
            return "lookUp";
        }

        // Lấy thông tin premium nếu có
        UserPremium userPremium = premiumService.getUserPremium(user.getId());

        // Kiểm tra trạng thái premium
        boolean isPremium = (userPremium != null);
        model.addAttribute("userPremium", userPremium);

        if (!isPremium) {
            // Người dùng không phải premium => check số lần tra cứu
            Integer searchCount = (Integer) session.getAttribute("searchCount");
            if (searchCount == null) {
                searchCount = 0;
            }

            if (searchCount >= 3) {
                model.addAttribute("alertMessage", "You have reached the maximum search limit of 3 words. Please upgrade to premium.");
                return "lookUp";
            }

            // Tăng số lần tra
            searchCount++;
            session.setAttribute("searchCount", searchCount);
        }

        // Nếu là premium thì cho qua, không giới hạn
        model.addAttribute("userPremium", userPremium);
        return "lookUp";
    }

}
