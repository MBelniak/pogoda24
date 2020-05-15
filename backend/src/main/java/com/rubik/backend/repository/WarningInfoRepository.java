package com.rubik.backend.repository;

import com.rubik.backend.entity.WarningInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface WarningInfoRepository extends JpaRepository<WarningInfo, Long> {

    WarningInfo findFirstByPostId(Long id);

    @Query(value = "SELECT * FROM warning_info w WHERE w.due_date >= ?1",
            nativeQuery = true)
    List<WarningInfo> findAllValidWarnings(Timestamp date);

}
