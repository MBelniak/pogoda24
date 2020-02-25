package com.rubik.pogoda24.controller.html;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class GeneratorController {

    @RequestMapping("/generator")
    public String getGeneratorPage() {
        return "generator/generator";
    }
}
