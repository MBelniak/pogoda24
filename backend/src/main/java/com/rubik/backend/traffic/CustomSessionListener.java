package com.rubik.backend.traffic;

import com.rubik.backend.service.TrafficService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

@Component
public class CustomSessionListener implements HttpSessionListener {

    private TrafficService trafficService;

    @Autowired
    public CustomSessionListener(TrafficService trafficService) {
        this.trafficService = trafficService;
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        trafficService.incrementSiteViewsForToday();
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {

    }
}