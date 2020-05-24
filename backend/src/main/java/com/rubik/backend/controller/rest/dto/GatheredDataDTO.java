package com.rubik.backend.controller.rest.dto;

public class GatheredDataDTO {
    private Long allPostsViews;
    private Long allSiteViews;
    private Integer postsCount;
    private Double averageViewsPerPost;

    public GatheredDataDTO(Long allPostsViews, Long allSiteViews, Integer postsCount, Double averageViewsPerPost) {
        this.allPostsViews = allPostsViews;
        this.allSiteViews = allSiteViews;
        this.postsCount = postsCount;
        this.averageViewsPerPost = averageViewsPerPost;
    }

    public Long getAllPostsViews() {
        return allPostsViews;
    }

    public void setAllPostsViews(Long allPostsViews) {
        this.allPostsViews = allPostsViews;
    }

    public Long getAllSiteViews() {
        return allSiteViews;
    }

    public void setAllSiteViews(Long allSiteViews) {
        this.allSiteViews = allSiteViews;
    }

    public Integer getPostsCount() {
        return postsCount;
    }

    public void setPostsCount(Integer postsCount) {
        this.postsCount = postsCount;
    }

    public Double getAverageViewsPerPost() {
        return averageViewsPerPost;
    }

    public void setAverageViewsPerPost(Double averageViewsPerPost) {
        this.averageViewsPerPost = averageViewsPerPost;
    }
}
