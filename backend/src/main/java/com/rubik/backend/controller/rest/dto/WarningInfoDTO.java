package com.rubik.backend.controller.rest.dto;

import com.rubik.backend.entity.Post;

import java.util.Date;

public class WarningInfoDTO {
    private String postId;

    private Date dueDate;

    private String title;

    public WarningInfoDTO() {
    }

    public WarningInfoDTO(Post post) {
        this.postId = post.getId();
        this.dueDate = post.getDueDate();
        this.title = post.getTitle();
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
