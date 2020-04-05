package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.ForecastMap;
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

    @GetMapping("/publicIds")
    public @ResponseBody
    List<String> getImagesPublicIdsByPost(@RequestParam(value = "postId", required = false) Long postId) {
        if (postId != null) {
            return forecastMapsService.getImagesPublicIds(postId);
        }
        return forecastMapsService.getImagesPublicIds();
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

    @PostMapping("")
    public String addForecastMaps(@RequestBody List<ForecastMap> forecastMaps) {
        if (forecastMaps != null) {
            List<ForecastMap> savedMaps = forecastMapsService.saveForecastMaps(forecastMaps);
            if (savedMaps != null) {
                return "Successfully saved forecast maps";
            }
            return null;
        }
        return null;
    }
}
