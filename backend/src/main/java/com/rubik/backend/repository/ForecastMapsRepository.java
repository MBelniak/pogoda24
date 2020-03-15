package com.rubik.backend.repository;

import com.rubik.backend.entity.ForecastMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForecastMapsRepository extends JpaRepository<ForecastMap, Long> {

    <T> List<T> findAllByPostId(Long postId, Class<T> type);

    List<ForecastMap> findAll();
}
