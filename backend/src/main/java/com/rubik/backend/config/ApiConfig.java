package com.rubik.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "api")
public class ApiConfig {

    private String imagesDir;

    public String getImagesDir() {
        return imagesDir;
    }

    public void setImagesDir(String imagesDir) {
        this.imagesDir = imagesDir;
    }
}
