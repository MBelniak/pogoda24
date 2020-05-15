package com.rubik.backend.entity;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Timestamp;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Property 'postType' cannot be null.")
    @Enumerated(EnumType.STRING)
    private PostType postType;

    @NotNull(message = "Property 'postDate' cannot be null.")
    @JsonFormat(timezone="GMT+02", shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp postDate;

    @NotNull(message = "Property 'title' cannot be null.")
    @Size(max=100)
    private String title;

    @NotNull(message = "Property 'description' cannot be null.")
    private String description;

    @JsonIgnore
    @Access(AccessType.PROPERTY)
    @Column(name ="images_public_ids")
    private String imagesPublicIds;

    @Transient
    private JsonNode imagesPublicIdsJSON;

    private Long views;

    public Post() {
        this.views = 0L;
    }

    @JsonCreator
    public Post(@JsonProperty("id") Long id,
                   @JsonProperty(value = "postDate", required = true) Timestamp postDate,
                   @JsonProperty(value = "postType", required = true) String postType,
                   @JsonProperty(value = "title", required = true) String title,
                   @JsonProperty(value = "description", required = true) String description,
                   @JsonProperty("imagesPublicIds") String imagesPublicIds,
                   @JsonProperty("views") Long views) {
        this.id = id;
        this.postType = PostType.contains(postType) ? PostType.valueOf(postType) : null;
        this.postDate = postDate;
        this.title = title;
        this.description = description;
        if (imagesPublicIds != null) {
            this.setImagesPublicIds(imagesPublicIds);
        }
        if (views != null) {
            this.views = views;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PostType getPostType() {
        return postType;
    }

    public void setPostType(PostType postType) {
        this.postType = postType;
    }

    public Timestamp getPostDate() {
        return postDate;
    }

    public void setPostDate(Timestamp postDate) {
        this.postDate = postDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Transient
    public JsonNode getImagesPublicIdsJSON() {
        return imagesPublicIdsJSON;
    }

    public void setImagesPublicIdsJSON(JsonNode json) {
        this.imagesPublicIdsJSON = json;
    }

    @JsonIgnore
    public String getImagesPublicIds() {
        if (imagesPublicIdsJSON == null) {
            return "";
        }
        return imagesPublicIdsJSON.toString();
    }

    @JsonIgnore
    public void setImagesPublicIds(String imagesPublicIds) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            imagesPublicIdsJSON = mapper.readTree(imagesPublicIds);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Long getViews() {
        return this.views == null ? 0L : this.views;
    }

    public void setViews(Long views) {
        this.views = views;
    }
}
