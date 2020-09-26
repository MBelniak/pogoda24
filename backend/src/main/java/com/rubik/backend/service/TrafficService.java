package com.rubik.backend.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.SiteTraffic;
import org.joda.time.DateTimeZone;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

import static com.rubik.backend.constants.ServiceConstants.POSTS_COLLECTION;
import static com.rubik.backend.constants.ServiceConstants.SITE_TRAFFIC;

@Service
public class TrafficService {

    private Firestore firestore;

    @Autowired
    public TrafficService(Firestore firestore) {
        this.firestore = firestore;
    }

    public void incrementSiteViewsForToday() {
        LocalDate localDate = new LocalDate();
        Date today = localDate.toDateTimeAtStartOfDay(DateTimeZone.UTC).toDate();
        CollectionReference collectionReference = firestore.collection(SITE_TRAFFIC);

        ApiFuture<QuerySnapshot> query = collectionReference.whereEqualTo("date", today).get();

        try {
            QuerySnapshot snapshot = query.get();
            if (snapshot.size() == 0) {
                collectionReference.document().set(new SiteTraffic(null, today, 1L));
            } else if (snapshot.size() == 1){
                snapshot.getDocuments().get(0).getReference().update("views", FieldValue.increment(1L));
            } else { //transaction not working - PERMISSION DENIED
                Long views1 = snapshot.getDocuments().get(0).getLong("views");
                Long views2 = snapshot.getDocuments().get(1).getLong("views");
                snapshot.getDocuments().get(views1 > views2 ? 0 : 1).getReference().update("views", FieldValue.increment(1L + (views1 > views2 ? views2 : views1)));
                snapshot.getDocuments().get(views1 > views2 ? 1 : 0).getReference().delete();
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    public void addViewsForPost(String postId, Long views) {
        DocumentReference document = firestore.collection(POSTS_COLLECTION).document(postId);
        document.update("views", FieldValue.increment(views));
    }

    public Long getViewsForPost(String postId) {
        DocumentReference docRef = firestore.collection(POSTS_COLLECTION).document(postId);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        try {
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                return document.toObject(Post.class).getViews();
            } else {
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<SiteTraffic> getViewsForSite(Integer daysBack) {
        LocalDate localDate = new LocalDate();
        Date today = localDate.toDateTimeAtStartOfDay(DateTimeZone.UTC).toDate();
        Calendar c = Calendar.getInstance();
        c.setTime(today);
        c.add(Calendar.DATE, -daysBack);
        Date back = c.getTime();

        Query query = firestore.collection(SITE_TRAFFIC)
                .whereGreaterThanOrEqualTo("date", back)
                .whereLessThanOrEqualTo("date", today);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        try {
            return querySnapshot.get().toObjects(SiteTraffic.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<SiteTraffic> getAllSiteTraffic() {
        CollectionReference posts = firestore.collection(SITE_TRAFFIC);
        ApiFuture<QuerySnapshot> querySnapshot = posts.get();
        try {
            return querySnapshot.get().toObjects(SiteTraffic.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
