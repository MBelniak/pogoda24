package com.rubik.backend.repository;

import com.rubik.backend.entity.Fact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FactsRepository extends JpaRepository<Fact, Long> {

    Fact findAllById(Long id);

    List<Fact> findAll();

    Page<Fact> findAll(Pageable pageable);
}
