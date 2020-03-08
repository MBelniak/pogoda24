package com.rubik.pogoda24.service;

import com.rubik.pogoda24.config.ApiConfig;
import com.rubik.pogoda24.entity.ForecastMap;
import com.rubik.pogoda24.entity.ImageURLSOnly;
import com.rubik.pogoda24.repository.ForecastMapsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ForecastMapsService {

    private final ForecastMapsRepository forecastMapsRepository;
    private final ResourceLoader resourceLoader;
    private ApiConfig apiConfig;

    @Autowired
    public ForecastMapsService(ForecastMapsRepository forecastMapsRepository, ResourceLoader resourceLoader,
        ApiConfig apiConfig) {
        this.forecastMapsRepository = forecastMapsRepository;
        this.resourceLoader = resourceLoader;
        this.apiConfig = apiConfig;
    }

    public Resource getRawImage(String url) {

        return resourceLoader.getResource("file:"+apiConfig.getImagesDir()+"/"+url);
    }

    public List<String> getImagesURLs() {
        List<ForecastMap> forecastMapsURLs = forecastMapsRepository.findAll();
        return forecastMapsURLs.stream().map(ForecastMap::getImageUrl).collect(Collectors.toList());
    }

    public List<String> getImagesURLs(Long postId) {
        List<ImageURLSOnly> forecastMapsURLs = forecastMapsRepository.findAllByPostId(postId, ImageURLSOnly.class);
        return forecastMapsURLs.stream().map(ImageURLSOnly::getImageUrl).collect(Collectors.toList());
    }
}
