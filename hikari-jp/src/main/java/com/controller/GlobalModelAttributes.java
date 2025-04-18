package com.controller;

import com.model.UserPremium;
import com.model.Users;
import com.service.PremiumService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalModelAttributes {

    @Autowired
    private PremiumService premiumService;
//
    @ModelAttribute
    public void addGlobalAttributes(Model model, HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if (user != null) {
            UserPremium userPremium = premiumService.getUserPremium(user.getId());
            if (userPremium != null) {
                model.addAttribute("userPremium", userPremium);
                model.addAttribute("isPremium", true);
                return;
            }
        }
        model.addAttribute("isPremium", false);
    }
}

