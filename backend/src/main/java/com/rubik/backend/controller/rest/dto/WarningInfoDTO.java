package com.rubik.backend.controller.rest.dto;

import com.rubik.backend.entity.Post;

import java.util.Date;

public class WarningInfoDTO {
    private String postId;

    private Date dueDate;

    private String shortDescription;

    public WarningInfoDTO() {
    }

    public WarningInfoDTO(Post post) {
        this.postId = post.getId();
        this.dueDate = post.getDueDate();
        this.shortDescription = post.getShortDescription();
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }
}
