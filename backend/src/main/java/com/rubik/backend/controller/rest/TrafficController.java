package com.rubik.backend.controller.rest;

import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RequestMapping("api/views")
public interface TrafficController {

    @PostMapping("/registerViews")
    void registerViews(@RequestBody List<PostViewsDTO> postViewsDTO);

    @GetMapping("{id}")
    Long getViewsForPost(@PathVariable Long id);

    @GetMapping("/site")
    Map<Date, Long> getViewsForSite(@RequestParam Integer daysBack);
}
