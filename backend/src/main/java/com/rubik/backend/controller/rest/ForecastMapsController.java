package com.rubik.backend.controller.rest;

import com.rubik.backend.service.ForecastMapsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLConnection;
import java.util.List;

@RestController
@RequestMapping("api/images")
public class ForecastMapsController {

    private ForecastMapsService forecastMapsService;

    @Autowired
    public ForecastMapsController(ForecastMapsService forecastMapsService) {
        this.forecastMapsService = forecastMapsService;
    }

    @GetMapping(value = "/urls")
    public @ResponseBody
    List<String> getImagesURLsByPost(@RequestParam(value = "postId", required = false) Long postId) {
        if (postId != null) {
            return forecastMapsService.getImagesURLs(postId);
        }
        return forecastMapsService.getImagesURLs();
    }

    @GetMapping("/{url}")
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
