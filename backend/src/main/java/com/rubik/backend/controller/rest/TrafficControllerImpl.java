package com.rubik.backend.controller.rest;

import com.rubik.backend.controller.rest.dto.GatheredDataDTO;
import com.rubik.backend.controller.rest.dto.PostViewsDTO;
import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.SiteTraffic;
import com.rubik.backend.service.PostService;
import com.rubik.backend.service.TrafficService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TrafficControllerImpl implements TrafficController {

    private TrafficService trafficService;

    private PostService postService;

    @Autowired
    public TrafficControllerImpl(TrafficService trafficService, PostService postService) {
        this.trafficService = trafficService;
        this.postService = postService;
    }

    @Override
    public void registerViews(List<PostViewsDTO> postViewsDTO) {
        postViewsDTO.forEach(post -> trafficService.addViewsForPost(post.getPostId(), post.getViews()));
    }

    @Override
    public Long getViewsForPost(String id) {
        return trafficService.getViewsForPost(id);
    }

    @Override
    public List<SiteTraffic> getViewsForSite(@RequestParam Integer daysBack) {
        return trafficService.getViewsForSite(daysBack);
    }

    @Override
    public GatheredDataDTO getGatheredData() {
        List<Post> allPosts = postService.getPostsOrderedByDate();
        List<SiteTraffic> allSiteTraffic = trafficService.getAllSiteTraffic();

        Long allPostsViews = allPosts.stream().map(Post::getViews).reduce(0L, Long::sum);
        Long allSiteViews = allSiteTraffic.stream().map(SiteTraffic::getViews).reduce(0L, Long::sum);
        Integer postsCount = allPosts.size();
        Double averageViewsPerPost = allPostsViews.doubleValue() / postsCount.doubleValue();

        return new GatheredDataDTO(allPostsViews, allSiteViews, postsCount, averageViewsPerPost);
    }
}
