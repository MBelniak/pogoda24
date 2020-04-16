package com.rubik.backend.repository;

import com.rubik.backend.entity.Warning;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface WarningsRepository extends JpaRepository<Warning, Long> {

    Warning findAllById(Long id);

    List<Warning> findAll();

    Page<Warning> findAll(Pageable pageable);

    @Query(value = "SELECT * FROM warning w WHERE w.post_date < ?1 AND w.due_date >= ?1",
            nativeQuery = true)
    List<Warning> findAllValidWarnings(Timestamp date);

    @Query(value = "SELECT * FROM warning w WHERE w.post_date < ?1 AND w.due_date >= ?1 AND w.is_added_to_top_bar = ?2",
            nativeQuery = true)
    List<Warning> findAllValidWarnings(Timestamp date, boolean isAddedToTopBar);
}
