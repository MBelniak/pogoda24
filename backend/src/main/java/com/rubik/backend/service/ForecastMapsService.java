package com.rubik.backend.service;

import com.rubik.backend.config.ApiConfig;
import com.rubik.backend.entity.ForecastMap;
import com.rubik.backend.entity.ImagePublicIdOnly;
import com.rubik.backend.repository.ForecastMapsRepository;
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

    public List<String> getImagesPublicIds() {
        List<ForecastMap> forecastMapsURLs = forecastMapsRepository.findAll();
        return forecastMapsURLs.stream().map(ForecastMap::getImagePublicId).collect(Collectors.toList());
    }

    public List<String> getImagesPublicIds(Long postId) {
        List<ImagePublicIdOnly> forecastMapsURLs = forecastMapsRepository.findAllByPostId(postId, ImagePublicIdOnly.class);
        return forecastMapsURLs.stream().map(ImagePublicIdOnly::getImagePublicId).collect(Collectors.toList());
    }

    public List<ForecastMap> saveForecastMaps(List<ForecastMap> forecastMaps) {
        return forecastMapsRepository.saveAll(forecastMaps);
    }
}
