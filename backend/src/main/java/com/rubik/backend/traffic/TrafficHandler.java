package com.rubik.backend.traffic;

import com.rubik.backend.service.PostService;
import com.rubik.backend.service.SiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

import javax.annotation.PreDestroy;

@Component
@SessionScope
public class TrafficHandler {

    private PostService postService;

    private SiteService siteService;

    @Autowired
    public TrafficHandler(PostService postService, SiteService siteService) {
        this.postService = postService;
        this.siteService = siteService;
    }

    @PreDestroy
    private void saveTrafficData() {

    }
}
