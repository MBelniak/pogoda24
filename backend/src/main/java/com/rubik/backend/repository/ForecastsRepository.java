package com.rubik.backend.repository;

import com.rubik.backend.entity.Forecast;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForecastsRepository extends JpaRepository<Forecast, Long> {

    Forecast findAllById(Long id);

    List<Forecast> findAll();

    Page<Forecast> findAll(Pageable pageable);
}
