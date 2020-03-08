package com.rubik.pogoda24.controller.rest;

import com.rubik.pogoda24.service.ForecastMapsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.net.URLConnection;
import java.util.List;

@RestApiController("api")
public class ForecastMapsController {

    private ForecastMapsService forecastMapsService;

    @Autowired
    public ForecastMapsController(ForecastMapsService forecastMapsService) {
        this.forecastMapsService = forecastMapsService;
    }

    @GetMapping(value = "/images/urls")
    public @ResponseBody
    List<String> getImagesURLsByPost(@RequestParam(value = "postId", required = false) Long postId) {
        if (postId != null) {
            return forecastMapsService.getImagesURLs(postId);
        }
        return forecastMapsService.getImagesURLs();
    }

    @GetMapping("/images/{url}")
    public ResponseEntity<?> getRawImage(@PathVariable("url") String url) {
        try {
            Resource resource = forecastMapsService.getRawImage(url);
            return ResponseEntity.ok()
                    .contentLength(resource.contentLength())
                    .contentType(MediaType.parseMediaType(URLConnection.guessContentTypeFromName(url)))
                    .body(new InputStreamResource(resource.getInputStream()));
        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body("Cannot find "+url+" => "+e.getMessage());
        }
    }
}
