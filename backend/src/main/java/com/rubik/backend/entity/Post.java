package com.rubik.backend.entity;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rubik.backend.validation.ValidPost;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
@ValidPost
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

    @NotNull(message = "Property 'description' cannot be null.")
    private String description;

    @JsonIgnore
    @Access(AccessType.PROPERTY)
    @Column(name ="images_public_ids")
    private String imagesPublicIds;

    @Transient
    private JsonNode imagesPublicIdsJSON;

    private Boolean isAddedToTopBar;

    @JsonFormat(timezone="GMT+02", shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp dueDate;

    private String shortDescription;

    private Long views;

    public Post() {
    }

    @JsonCreator
    public Post(@JsonProperty("id") Long id,
                   @JsonProperty(value = "postDate", required = true) Timestamp postDate,
                   @JsonProperty(value = "postType", required = true) String postType,
                   @JsonProperty(value = "description", required = true) String description,
                   @JsonProperty("addedToTopBar") boolean isAddedToTopBar,
                   @JsonProperty("imagesPublicIds") String imagesPublicIds,
                   @JsonProperty("dueDate") Timestamp dueDate,
                   @JsonProperty("shortDescription") String shortDescription,
                   @JsonProperty("views") Long views) {
        this.id = id;
        this.postType = PostType.contains(postType) ? PostType.valueOf(postType) : null;
        this.postDate = postDate;
        this.description = description;
        this.isAddedToTopBar = this.postType == PostType.WARNING ? isAddedToTopBar : null;
        if (imagesPublicIds != null) {
            this.setImagesPublicIds(imagesPublicIds);
        }
        this.dueDate = this.postType == PostType.WARNING ? dueDate : null;
        this.shortDescription = this.postType == PostType.WARNING ? shortDescription : null;
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

    public Boolean getAddedToTopBar() {
        return isAddedToTopBar;
    }

    public void setAddedToTopBar(Boolean addedToTopBar) {
        isAddedToTopBar = addedToTopBar;
    }

    public Timestamp getDueDate() {
        return dueDate;
    }

    public void setDueDate(Timestamp dueDate) {
        this.dueDate = dueDate;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public Long getViews() {
        return views;
    }

    public void setViews(Long views) {
        this.views = views;
    }
}
