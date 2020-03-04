package com.rubik.pogoda24.service;

import com.rubik.pogoda24.entity.ForecastMap;
import com.rubik.pogoda24.entity.ImageURLSOnly;
import com.rubik.pogoda24.repository.ForecastMapsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ForecastMapsService {

    private final ForecastMapsRepository forecastMapsRepository;
    private final ResourceLoader resourceLoader;

    @Value("${images.rootDir}")
    private static String IMAGES_ROOT_DIR;

    @Autowired
    public ForecastMapsService(ForecastMapsRepository forecastMapsRepository, ResourceLoader resourceLoader) {
        this.forecastMapsRepository = forecastMapsRepository;
        this.resourceLoader = resourceLoader;
    }

    public Resource getRawImage(String url) {
        return resourceLoader.getResource("file:"+IMAGES_ROOT_DIR+"/"+url);
    }

    public List<String> getImagesURLs() {
        List<ForecastMap> forecastMapsURLs = forecastMapsRepository.findAll();
        return forecastMapsURLs.stream().map(ForecastMap::getImageURL).collect(Collectors.toList());
    }

    public List<String> getImagesURLs(Long postId) {
        List<ImageURLSOnly> forecastMapsURLs = forecastMapsRepository.findAllByPostId(postId, ImageURLSOnly.class);
        return forecastMapsURLs.stream().map(ImageURLSOnly::getImageURL).collect(Collectors.toList());
    }
}
