package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.Forecast;
import com.rubik.backend.service.ForecastsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
        return forecasts.getContent();
    }

    @PostMapping("")
    public ResponseEntity<Object> addForecast(@RequestBody Forecast forecast, BindingResult bindingResult) {
        if (!bindingResult.hasErrors()) {
            forecastsService.saveForecast(forecast);
            forecast = forecastsService.getForecastById(forecast.getId());
            if (forecast != null) {
                return new ResponseEntity<>(forecast, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(bindingResult.getAllErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList()), HttpStatus.BAD_REQUEST);
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
