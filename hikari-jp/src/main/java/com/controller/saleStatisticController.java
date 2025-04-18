package com.controller;

import com.model.TransactionHistory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.repository.TransactionHistoryRepository;

import java.util.List;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class saleStatisticController {
    @Autowired
    private TransactionHistoryRepository transactionHistoryRepository;
    @GetMapping("/saleStatistic")
    public String saleStatistic(Model model) {
        List<TransactionHistory> trans = transactionHistoryRepository.findAll();
        model.addAttribute("trans", trans);
        Map<String, Double> salesData = trans.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getTransactionDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                        TreeMap::new, // Sorted by date
                        Collectors.summingDouble(TransactionHistory::getAmount)
                ));
        return "saleStatistic";
    }
}
