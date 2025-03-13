package com.hikari.hikari_jp.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/")
    public String home() {
        System.out.println("HomeController");
        return "index";
    }
}
