package com.rubik.backend.service;

import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.SiteTraffic;
import com.rubik.backend.repository.PostRepository;
import com.rubik.backend.repository.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TrafficService {

    private SiteRepository siteRepository;

    private PostRepository postRepository;

    @Autowired
    public TrafficService(SiteRepository siteRepository, PostRepository postRepository) {
        this.siteRepository = siteRepository;
        this.postRepository = postRepository;
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

    @Transactional
    public void addViewsForPost(Long postId, Long views) {
        Post post = postRepository.findFirstById(postId);
        if (post != null) {
            Long currentViews = post.getViews();
            post.setViews(currentViews == null ? 1 : currentViews + views);
            postRepository.save(post);
        }
    }

    public Long getViewsForPost(Long postId) {
        return postRepository.getViewsByPostId(postId);
    }

    public List<SiteTraffic> getViewsForSite(Integer daysBack) {
        Date today = Calendar.getInstance().getTime();
        Calendar c = Calendar.getInstance();
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        c.add(Calendar.DATE, -daysBack);
        List<SiteTraffic> siteViews = siteRepository.getAllByDateBetween(c.getTime(), today);
        siteViews.sort((leftSiteViews, rightSiteViews) -> {
            long left = leftSiteViews.getDate().getTime();
            long right = rightSiteViews.getDate().getTime();
            return Long.compare(right, left);
        });
        return siteViews;
    }

    public List<SiteTraffic> getAllSiteTraffic() {
        return siteRepository.findAll();
    }
}
