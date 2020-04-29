package com.rubik.backend.traffic;

import com.rubik.backend.service.PostService;
import com.rubik.backend.service.SiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

import javax.annotation.PreDestroy;
import java.util.HashMap;
import java.util.Map;

@Component
@SessionScope
public class TrafficHandler {

    private PostService postService;

    private SiteService siteService;

    private Map<Long, Long> postViewsMap;   //could probably just use spring boot actuator, but let's keep it simple for now

    @Autowired
    public TrafficHandler(PostService postService, SiteService siteService) {
        this.postService = postService;
        this.siteService = siteService;
        postViewsMap = new HashMap<>();
    }

    public void registerPost(Long postId) {
        Long views = postViewsMap.get(postId);
        if (views == null) {
            postViewsMap.put(postId, 1L);
        } else {
            postViewsMap.replace(postId, ++views);
        }
    }

    public void registerPostViewIfNotAdminPage(Long postId, String referer) {
        if (referer.matches("prognozy")) {
            registerPost(postId);
        }
    }

    @PreDestroy
    private void saveTrafficData() {
        postViewsMap.forEach((key, value) -> postService.addViewsForPost(key, value));
        siteService.incrementSiteViewsForToday();
    }
}
