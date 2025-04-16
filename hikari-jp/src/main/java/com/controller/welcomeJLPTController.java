package com.controller;

import com.model.PremiumPlan;
import com.model.UserPremium;
import com.model.Users;
import com.service.PremiumService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class welcomeJLPTController {

    @Autowired
    private PremiumService premiumService;

    @GetMapping("/jlptTest")
    public String jlptTest(Model model, HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        UserPremium userPremium = null;
        if (user == null)
        {
            model.addAttribute("alertMessage", "Please sign in before taking the exam");
            return "landingPage";
        }
        userPremium =  premiumService.getUserPremium(user.getId());
        model.addAttribute("userPremium", userPremium);
        return "welcomeJLPT";
    }
}
