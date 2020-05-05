package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.SiteTraffic;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/views")
public interface TrafficController {

    @PostMapping("/registerViews")
    void registerViews(@RequestBody List<PostViewsDTO> postViewsDTO);

    @GetMapping("{id}")
    Long getViewsForPost(@PathVariable Long id);

    @GetMapping("/site")
    List<SiteTraffic> getViewsForSite(@RequestParam Integer daysBack);

    @GetMapping("/gathered")
    GatheredData getGatheredData();
}
