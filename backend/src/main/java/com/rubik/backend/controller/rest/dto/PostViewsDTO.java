package com.rubik.backend.controller.rest.dto;

public class PostViewsDTO {
    private String postId;

    private Long views;

    public PostViewsDTO() {}

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public Long getViews() {
        return views;
    }

    public void setViews(Long views) {
        this.views = views;
    }
}
