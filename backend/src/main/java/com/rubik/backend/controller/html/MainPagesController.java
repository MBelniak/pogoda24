package com.rubik.backend.controller.html;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainPagesController {

    @RequestMapping(value = {"/write", "/writer", "/elist", "/traffic"})
    public String getWritePage() {
        return "admin/index";
    }

    @RequestMapping(value = {"/", "/prognozy", "/about", "/ciekawostki"})
    public String getIndexPage() {
        return "index";
    }
}
