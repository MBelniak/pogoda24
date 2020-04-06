package com.rubik.backend.entity;

import com.fasterxml.jackson.databind.JsonNode;

import javax.persistence.*;
import java.util.Date;
import java.sql.Timestamp;

@Entity
public class Warning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Timestamp postDate;

    @Transient
    private JsonNode imagesPublicIdsJSON;

    private String description;

    private Boolean isAddedToTopBar;

    @Temporal(TemporalType.DATE)
    private Date dueDate;

    @Temporal(TemporalType.TIME)
    private Date dueTime;

    private String shortDescription;

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

    public Boolean getAddedToTopBar() {
        return isAddedToTopBar;
    }

    public void setAddedToTopBar(Boolean addedToTopBar) {
        isAddedToTopBar = addedToTopBar;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public Date getDueTime() {
        return dueTime;
    }

    public void setDueTime(Date dueTime) {
        this.dueTime = dueTime;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }
}
