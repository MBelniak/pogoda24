package com.rubik.backend.dto;

import com.rubik.backend.entity.Warning;

import java.sql.Timestamp;

public class WarningAsPostDTO {

    private Long id;

    private Timestamp postDate;

    private String description;

    private String imagesPublicIds;

    public WarningAsPostDTO(Warning warning) {
        this.id = warning.getId();
        this.postDate = warning.getPostDate();
        this.description = warning.getDescription();
        this.imagesPublicIds = warning.getImagesPublicIds();
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

    public String getImagesPublicIds() {
        return imagesPublicIds;
    }

    public void setImagesPublicIds(String imagesPublicIds) {
        this.imagesPublicIds = imagesPublicIds;
    }
}
