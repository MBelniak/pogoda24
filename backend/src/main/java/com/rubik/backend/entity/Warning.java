package com.rubik.backend.entity;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.validation.annotation.Validated;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.sql.Timestamp;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Warning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Property 'postDate' cannot be null.")
    @JsonFormat(timezone="GMT+02")
    private Timestamp postDate;

    @NotNull(message = "Property 'description' cannot be null.")
    private String description;

    @JsonIgnore
    @Access(AccessType.PROPERTY)
    @Column(name ="images_public_ids")
    private String imagesPublicIds;

    @Transient
    private JsonNode imagesPublicIdsJSON;

    @NotNull(message = "Property 'isAddedToTopBar' cannot be null.")
    private Boolean isAddedToTopBar;

    @NotNull(message = "Property 'dueDate' cannot be null.")
    @JsonFormat(timezone="GMT+02")
    private Timestamp dueDate;

    @NotNull(message = "Property 'shortDescription' cannot be null.")
    private String shortDescription;

    public Warning(){}

    @JsonCreator
    public Warning(@JsonProperty(value = "postDate", required = true) Timestamp postDate,
                   @JsonProperty(value = "description", required = true) String description,
                   @JsonProperty(value = "isAddedToTopBar", required = true) Boolean isAddedToTopBar,
                   @JsonProperty("imagesPublicIdsJSON") String imagesPublicIds,
                   @JsonProperty(value = "daysValid", required = true) Integer daysValid,
                   @JsonProperty(value = "shortDescription", required = true) String shortDescription) {
        this.postDate = postDate;
        this.description = description;
        this.isAddedToTopBar = isAddedToTopBar;
        if (imagesPublicIds != null) {
            this.setImagesPublicIds(imagesPublicIds);
        }
        if (daysValid != null) {
            Date date = new Date(postDate.getTime());
            LocalDateTime localDateTime = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
            LocalDateTime endOfDay = localDateTime.with(LocalTime.MAX);
            date = Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.DATE, daysValid);
            this.dueDate = new Timestamp(calendar.getTime().getTime());
        }
        this.shortDescription = shortDescription;
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

    public Boolean getAddedToTopBar() {
        return isAddedToTopBar;
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
}
