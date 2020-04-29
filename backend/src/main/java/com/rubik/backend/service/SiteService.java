package com.rubik.backend.service;

import com.rubik.backend.entity.SiteTraffic;
import com.rubik.backend.repository.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.Calendar;

@Service
public class SiteService {

    private SiteRepository siteRepository;

    @Autowired
    public SiteService(SiteRepository siteRepository) {
        this.siteRepository = siteRepository;
    }

    @Transactional
    public SiteTraffic incrementSiteViewsForToday() {
        Date now = new Date(Calendar.getInstance().getTimeInMillis());
        SiteTraffic siteTraffic = siteRepository.getFirstByDate(now);
        if (siteTraffic == null) {
            siteTraffic = new SiteTraffic();
            siteTraffic.setDate(now);
            siteTraffic.setViews(0L);
        }
        siteTraffic.setViews(siteTraffic.getViews() + 1);
        siteRepository.save(siteTraffic);
        return siteTraffic;
    }
}
