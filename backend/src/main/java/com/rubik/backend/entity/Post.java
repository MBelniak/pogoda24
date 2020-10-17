package com.rubik.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.cloud.firestore.annotation.DocumentId;
import com.rubik.backend.entity.validation.ValidPost;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@ValidPost
public class Post {

    @DocumentId
    private String id;

    @NotNull(message = "Property 'postType' cannot be null.")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private PostType postType;

    @NotNull(message = "Property 'postDate' cannot be null.")
    @JsonFormat(timezone="GMT+02", shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date postDate;

    @NotNull(message = "Property 'title' cannot be null.")
    @Size(max=100)
    private String title;

    @NotNull(message = "Property 'description' cannot be null.")
    private String description;

    private List<String> imagesPublicIds;

    private Long views;

    @JsonFormat(timezone="GMT+02", shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date dueDate;

    public Post() {
        this.views = 0L;
    }

    @JsonCreator
    public Post(@JsonProperty("id") String id,
                   @JsonProperty(value = "postDate", required = true) Date postDate,
                   @JsonProperty(value = "postType", required = true) String postType,
                   @JsonProperty(value = "title", required = true) String title,
                   @JsonProperty(value = "description", required = true) String description,
                   @JsonProperty("imagesPublicIds") List<String> imagesPublicIds,
                   @JsonProperty("views") Long views,
                   @JsonProperty("dueDate") Date dueDate)
    {
        if (id != null) {
            this.id = id;
        }
        this.postType = PostType.contains(postType) ? PostType.valueOf(postType) : null;
        this.postDate = postDate;
        this.title = title;
        this.description = description;
        if (imagesPublicIds != null) {
            this.imagesPublicIds = imagesPublicIds;
        } else {
            this.imagesPublicIds = new ArrayList<>();
        }
        if (views != null) {
            this.views = views;
        } else {
            this.views = 0L;
        }
        if (dueDate != null) {
            this.dueDate = dueDate;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public PostType getPostType() {
        return postType;
    }

    public void setPostType(PostType postType) {
        this.postType = postType;
    }

    public Date getPostDate() {
        return postDate;
    }

    public void setPostDate(Date postDate) {
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

    public List<String> getImagesPublicIds() {
        return imagesPublicIds;
    }

    public void setImagesPublicIds(List<String> imagesPublicIds) {
        this.imagesPublicIds = imagesPublicIds;
    }

    public Long getViews() {
        return this.views == null ? 0L : this.views;
    }

    public void setViews(Long views) {
        this.views = views;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }
}
