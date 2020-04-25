package com.rubik.backend.traffic;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TrafficAspect {

    private TrafficHandler trafficHandler;

    @AfterReturning("execution(com.rubik.backend.entity.Post com.rubik.backend.controller.rest.PostController.getPost(..))")
    private void postView() {
        System.out.println("Getting post");
    }

    @Autowired
    public void setTrafficHandler(TrafficHandler trafficHandler) {
        this.trafficHandler = trafficHandler;
    }
}
