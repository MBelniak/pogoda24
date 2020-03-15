package com.rubik.backend.dtos;

import com.rubik.backend.entity.Post;

import java.sql.Timestamp;
import java.util.List;

public class PostDTO {
    private Long id;

    private Timestamp postDate;

    private String description;

    private List<String> imagesIds;

    public PostDTO(Post post) {
        this.id = post.getId();
        this.postDate = post.getPostDate();
        this.description = post.getDescription();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Timestamp getPostDate() {
        return postDate;
    }

    public void setPostDate(Timestamp postDate) {
        this.postDate = postDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getImagesIds() {
        return imagesIds;
    }

    public void setImagesIds(List<String> imagesIds) {
        this.imagesIds = imagesIds;
    }
}
