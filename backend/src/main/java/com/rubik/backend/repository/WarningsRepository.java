package com.rubik.backend.repository;

import com.rubik.backend.entity.Warning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarningsRepository extends JpaRepository<Warning, Long> {
}
