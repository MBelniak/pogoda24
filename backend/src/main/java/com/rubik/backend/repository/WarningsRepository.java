package com.rubik.backend.repository;

import com.rubik.backend.entity.Warning;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarningsRepository extends JpaRepository<Warning, Long> {

    Warning findAllById(Long id);

    List<Warning> findAll();

    Page<Warning> findAll(Pageable pageable);
}
