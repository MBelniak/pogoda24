package com.rubik.backend.repository;

import com.rubik.backend.entity.Fact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FactsRepository extends JpaRepository<Fact, Long> {
}
