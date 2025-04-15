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
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class QuizController {
    @Autowired
    private PremiumService premiumService;

    @GetMapping("/quizzInterface")
    public String quizInterface(@RequestParam(name = "level", required = false) String level, Model model, HttpSession session) {
        model.addAttribute("level", level);
        Users user = (Users) session.getAttribute("user");
        PremiumPlan premiumPlan = null;
        boolean isPremium = false;

        if (user == null) return "quizzInterface";
        UserPremium userPremium = premiumService.getUserPremium(user.getId());
        if (userPremium != null) {
            premiumPlan = premiumService.getPremiumPlanByPlanId(userPremium.getPlanId());
            model.addAttribute("premiumPlan", premiumPlan);
            model.addAttribute("userPremium", userPremium);
            isPremium = true;
        }
        model.addAttribute("isPremium", isPremium);
        return "quizzInterface";
    }
}
