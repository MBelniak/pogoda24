package com.rubik.backend.controller.html;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainPagesController {

    @RequestMapping(value = {"/write", "/writer", "/list", "/traffic", "/factwriter", "/files", "/generator"})
    public String getWritePage() {
        return "admin";
    }

    @RequestMapping(value = {"/", "/prognozy", "/ciekawostki", "/ostrzezenia", "/onas", "/posts/**"})
    public String getIndexPage() {
        return "index";
    }

    @RequestMapping(value = "/login")
    public String getLoginPage() {
        if (isAuthenticated()) {
            return "redirect:/write";
        }
        return "templates/login/loginPage";
    }

    private boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || AnonymousAuthenticationToken.class.
                isAssignableFrom(authentication.getClass())) {
            return false;
        }
        return authentication.isAuthenticated();
    }
}
