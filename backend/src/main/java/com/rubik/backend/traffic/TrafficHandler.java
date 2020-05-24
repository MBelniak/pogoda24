package com.rubik.backend.traffic;

import com.rubik.backend.service.TrafficService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

import javax.annotation.PreDestroy;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@SessionScope
public class TrafficHandler {

    private TrafficService trafficService;

    private Map<String , Long> postViewsMap;   //could probably just use spring boot actuator, but let's keep it simple for now

    @Autowired
    public TrafficHandler(TrafficService trafficService) {
        this.trafficService = trafficService;
        postViewsMap = new HashMap<>();
    }

    public void registerPost(String postId) {
        Long views = postViewsMap.get(postId);
        if (views == null) {
            postViewsMap.put(postId, 1L);
        } else {
            postViewsMap.replace(postId, ++views);
        }
    }

    public void registerPostViewIfNotAdminPage(String postId, String referer) {
        Pattern p = Pattern.compile("posts");
        Matcher m = p.matcher(referer);
        if (m.find()) {
            registerPost(postId);
        }
    }

    @PreDestroy
    private void saveTrafficData() {
        postViewsMap.forEach((key, value) -> trafficService.addViewsForPost(key, value));
        trafficService.incrementSiteViewsForToday();
    }
}
