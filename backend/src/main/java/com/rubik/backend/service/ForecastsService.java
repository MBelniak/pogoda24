package com.rubik.backend.service;

import com.rubik.backend.entity.Forecast;
import com.rubik.backend.repository.ForecastsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ForecastsService {
    private ForecastsRepository forecastsRepository;

    @Autowired
    public ForecastsService(ForecastsRepository forecastsRepository) {
        this.forecastsRepository = forecastsRepository;
    }

    public List<Forecast> getForecastsOrderedByDate() {
        return forecastsRepository.findAll();
    }

    public Page<Forecast> getForecastsOrderedByDate(int page, int count) {
        Pageable pageable = PageRequest.of(page, count, Sort.by("postDate").descending());
        return forecastsRepository.findAll(pageable);
    }

    public Forecast getForecastById(Long id) {
        return forecastsRepository.findAllById(id);
    }

    public void saveForecast(Forecast forecast) {
        forecastsRepository.saveAndFlush(forecast);
    }

    public void deleteForecast(Long id) {
        forecastsRepository.deleteById(id);
    }

    public Long getForecastsCount() {
        return forecastsRepository.count();
    }
}
