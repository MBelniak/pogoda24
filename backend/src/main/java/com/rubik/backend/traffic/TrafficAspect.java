package com.rubik.backend.traffic;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Aspect
@Component
public class TrafficAspect {

    private TrafficHandler trafficHandler;

    @AfterReturning("execution(com.rubik.backend.entity.Post com.rubik.backend.controller.rest.PostController.getPost(..))")
    private void postView(JoinPoint joinPoint) {
        String postId = (String) joinPoint.getArgs()[0];
        HttpServletRequest request = (HttpServletRequest) joinPoint.getArgs()[1];
        trafficHandler.registerPostViewIfNotAdminPage(postId, request.getHeader("referer"));
    }

    @Autowired
    public void setTrafficHandler(TrafficHandler trafficHandler) {
        this.trafficHandler = trafficHandler;
    }
}
