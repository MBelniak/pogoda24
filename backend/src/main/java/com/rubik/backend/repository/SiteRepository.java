package com.rubik.backend.repository;

import com.rubik.backend.entity.SiteTraffic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SiteRepository extends JpaRepository<SiteTraffic, Long> {

    SiteTraffic getFirstByDate(Date date);

    List<SiteTraffic> getAllByDateBetween(Date dateFrom, Date dateTo);
}
