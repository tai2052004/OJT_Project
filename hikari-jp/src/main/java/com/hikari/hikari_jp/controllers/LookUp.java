package com.hikari.hikari_jp.controllers;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.IOException;

@WebServlet(name = "LookUp", value = "/LookUp")
public class LookUp extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        String keyword = request.getParameter("keyword");

        if (keyword != null && !keyword.isEmpty()) {
            request.setAttribute("keyword", keyword);
            request.getRequestDispatcher("rs_lookup.html").forward(request, response);
        } else {
            request.setAttribute("keyword", "");
            request.getRequestDispatcher("rs_lookup.html").forward(request, response);
        }
    }
}