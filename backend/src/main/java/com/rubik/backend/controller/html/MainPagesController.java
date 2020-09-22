package com.rubik.backend.controller.html;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainPagesController {

    @RequestMapping(value = {"/write", "/writer", "/list", "/traffic", "/factwriter", "/files"})
    public String getWritePage() {
        return "admin";
    }

    @RequestMapping(value = {"/", "/prognozy", "/ciekawostki", "/ostrzezenia", "/onas", "/posts/**"})
    public String getIndexPage() {
        return "index";
    }

    @RequestMapping(value = "/login")
    public String getLoginPage() {
        return "templates/login/loginPage";
    }
}
