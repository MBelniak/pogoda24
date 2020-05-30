package com.rubik.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.google.cloud.firestore.annotation.DocumentId;

import javax.validation.constraints.NotNull;
import java.util.Date;

public class SiteTraffic {

    @DocumentId
    private String id;

    @NotNull(message = "Property 'date' cannot be null.")
    @JsonFormat(timezone="GMT+02", shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date;

    private Long views;

    public SiteTraffic() {
    }

    public SiteTraffic(String id, @NotNull(message = "Property 'date' cannot be null.") Date date, Long views) {
        this.id = id;
        this.date = date;
        this.views = views;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getViews() {
        return views;
    }

    public void setViews(Long views) {
        this.views = views;
    }
}
