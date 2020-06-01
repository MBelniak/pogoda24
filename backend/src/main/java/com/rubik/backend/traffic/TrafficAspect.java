package com.rubik.backend.traffic;

import com.rubik.backend.service.TrafficService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Aspect
@Component
public class TrafficAspect {

    private TrafficService trafficService;

    @Autowired
    public TrafficAspect(TrafficService trafficService) {
        this.trafficService = trafficService;
    }

    @AfterReturning("execution(com.rubik.backend.entity.Post com.rubik.backend.controller.rest.PostController.getPost(..))")
    private void registerPostView(JoinPoint joinPoint) {
        String postId = (String) joinPoint.getArgs()[0];
        HttpServletRequest request = (HttpServletRequest) joinPoint.getArgs()[1];
        registerPostViewIfNotAdminPage(postId, request.getHeader("referer"));
    }

    public void registerPostViewIfNotAdminPage(String postId, String referer) {
        Pattern p = Pattern.compile("posts");
        Matcher m = p.matcher(referer);
        if (m.find()) {
            trafficService.addViewsForPost(postId, 1L);
        }
    }
}
