package com.rubik.backend.controller.rest;

import com.rubik.backend.service.TrafficService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
public class TrafficControllerImpl implements TrafficController {

    private TrafficService trafficService;

    @Autowired
    public TrafficControllerImpl(TrafficService trafficService) {
        this.trafficService = trafficService;
    }

    @Override
    public void registerViews(List<PostViewsDTO> postViewsDTO) {
        postViewsDTO.forEach(post -> trafficService.addViewsForPost(post.getPostId(), post.getViews()));
    }

    @Override
    public Long getViewsForPost(Long id) {
        return trafficService.getViewsForPost(id);
    }

    @Override
    public Map<Date, Long> getViewsForSite(@RequestParam Integer daysBack) {
        return trafficService.getViewsForSite(daysBack);
    }
}
