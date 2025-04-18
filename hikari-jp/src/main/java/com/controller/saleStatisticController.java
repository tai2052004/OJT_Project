package com.controller;

import com.model.TransactionHistory;
import com.model.UserDetail;
import com.model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.repository.TransactionHistoryRepository;

import java.util.List;

@Controller
public class saleStatisticController {
    @Autowired
    private TransactionHistoryRepository transactionHistoryRepository;
    @GetMapping("/saleStatistic")
    public String saleStatistic(Model model) {
        List<TransactionHistory> trans = transactionHistoryRepository.findAll();
        model.addAttribute("trans", trans);
        return "saleStatistic";
    }
}
