package com.rubik.backend.controller.rest;

public class PostViewsDTO {
    private Long postId;

    private Long views;

    public PostViewsDTO() {
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Long getViews() {
        return views;
    }

    public void setViews(Long views) {
        this.views = views;
    }
}
