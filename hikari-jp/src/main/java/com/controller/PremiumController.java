package com.controller;

import com.model.PremiumPlan;
import com.model.UserPremium;
import com.model.Users;
import com.service.PremiumService;
import com.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.text.NumberFormat;
import java.util.Locale;

@Controller
public class PremiumController {

    @Autowired
    private PremiumService premiumService;

    @Autowired
    private VNPayService vnPayService;

    @GetMapping("/premium")
    public String viewMyPremium(Model model, HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if (user == null) return "premium";
        UserPremium userPremium = premiumService.getUserPremium(user.getId());
        PremiumPlan premiumPlan = premiumService.getPremiumPlanByPlanId(userPremium.getPlanId());
        int remainingDays = premiumService.getRemainingDays(userPremium);

        model.addAttribute("premiumPlan", premiumPlan);
        model.addAttribute("userPremium", userPremium);
        model.addAttribute("remainingDays", remainingDays);
        return "premium";
    }

    @PostMapping("/buy-premium")
    public String buyPremium(Model model, HttpSession session, @RequestParam Long planId) {
        Users user = (Users) session.getAttribute("user");
        if (user == null) return "login";
        PremiumPlan premiumPlan = premiumService.getPremiumPlanByPlanId(planId);
        NumberFormat formatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        String formattedPrice = formatter.format(premiumPlan.getPrice());

        model.addAttribute("premiumPlan", premiumPlan);
        model.addAttribute("formattedPrice", formattedPrice);
        return"Vnpay";
    }

    @PostMapping("/submitOrder")
    public String submidOrder(@RequestParam("amount") int orderTotal,
                              @RequestParam("orderInfo") String orderInfo,
                              @RequestParam("planId") Long planId,
                              HttpServletRequest request, HttpSession session) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        session.setAttribute("planId", planId);
        return "redirect:" + vnpayUrl;
    }

    @GetMapping("/vnpay-payment")
    public String GetMapping(HttpServletRequest request, Model model, HttpSession session) {
        int paymentStatus =vnPayService.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");
        Long planId = (Long) session.getAttribute("planId");

        model.addAttribute("orderId", orderInfo);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);

        if (paymentStatus == 1) {
            Users user = (Users) session.getAttribute("user");
            if (user != null && planId != null) {
                try {
                    premiumService.buyPremium(user.getId(), planId);
                } catch (NumberFormatException e) {
                    System.out.println(e.getMessage());
                }
            }
            return "ordersuccess";
        }

        return "orderfail";
    }

}
