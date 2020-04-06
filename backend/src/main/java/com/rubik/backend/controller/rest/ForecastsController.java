package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.Forecast;
import com.rubik.backend.service.ForecastsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/forecasts")
public class ForecastsController {

    private ForecastsService forecastsService;

    @Autowired
    public ForecastsController(ForecastsService forecastsService) {
        this.forecastsService = forecastsService;
    }

    @GetMapping("")
    public List<Forecast> getForecasts(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer count) {
        if (page == null || count == null)
            return forecastsService.getForecastsOrderedByDate();

        Page<Forecast> forecasts = forecastsService.getForecastsOrderedByDate(page, count);
        if (forecasts == null) {
            return new ArrayList<>();
        }

        return forecasts.getContent();
    }

    @PostMapping("")
    public Forecast addForecast(@RequestBody Forecast forecast) {
        if (forecast != null) {
            forecastsService.saveForecast(forecast);
            forecast = forecastsService.getForecastById(forecast.getId());
            if (forecast != null) {
                return forecast;
            }
            return null;
        }
        return null;
    }

    @PutMapping("")
    public void updateForecast(@RequestBody Forecast forecast) {
        if (forecast != null) {
            forecastsService.saveForecast(forecast);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteForecast(@PathVariable Long id) {
        if (id != null) {
            forecastsService.deleteForecast(id);
        }
    }
}
