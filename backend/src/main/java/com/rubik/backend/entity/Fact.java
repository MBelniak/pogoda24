package com.rubik.backend.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
public class Fact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Timestamp postDate;

    private String description;

    @Transient
    private JsonNode imagesPublicIdsJSON;

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

    public JsonNode getImagesPublicIdsJSON() {
        return imagesPublicIdsJSON;
    }

    public void setImagesPublicIdsJSON(JsonNode json) {
        this.imagesPublicIdsJSON = json;
    }

    @Column(name ="images_public_ids_json")
    public String getJsonString() { // This is for JPA
        return this.imagesPublicIdsJSON.toString();
    }

    public void setJsonString(String jsonString) {  // This is for JPA
        // parse from String to JsonNode object
        ObjectMapper mapper = new ObjectMapper();
        try {
            this.imagesPublicIdsJSON = mapper.readTree(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
