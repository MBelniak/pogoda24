package com.rubik.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
public class Forecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Timestamp postDate;

    private String description;

    @JsonIgnore
    @Access(AccessType.PROPERTY)
    @Column(name ="images_public_ids")
    private String imagesPublicIdsString;

    @Transient
    private JsonNode imagesPublicIds;

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

    @Transient
    public JsonNode getImagesPublicIds() {
        return imagesPublicIds;
    }

    public void setImagesPublicIds(JsonNode json) {
        this.imagesPublicIds = json;
    }

    @JsonIgnore
    public String getImagesPublicIdsString() {
        if (imagesPublicIds == null) {
            return "";
        }
        return imagesPublicIds.toString();
    }

    @JsonIgnore
    public void setImagesPublicIdsString(String imagesPublicIdsString) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            imagesPublicIds = mapper.readTree(imagesPublicIdsString);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
