package com.rubik.backend.repository;

import com.rubik.backend.entity.SiteTraffic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Date;

@Repository
public interface SiteRepository extends JpaRepository<SiteTraffic, Long> {

    SiteTraffic getFirstByDate(Date date);
}
