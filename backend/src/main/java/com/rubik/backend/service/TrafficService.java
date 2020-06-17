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
        Date today = localDate.toDateTimeAtStartOfDay().toDate();
        System.out.println(today.toString());
        CollectionReference collectionReference = firestore.collection(SITE_TRAFFIC);

        Query query = collectionReference.whereEqualTo("date", today);

        firestore.runTransaction(transaction -> {
            List<QueryDocumentSnapshot> snapshot = transaction.get(query).get().getDocuments();
            if (snapshot.isEmpty()) {
                transaction.set(collectionReference.document(), new SiteTraffic(null, today, 1L));
            } else {
                DocumentSnapshot documentSnapshot = transaction.get(snapshot.get(0).getReference()).get();
                transaction.update(snapshot.get(0).getReference(), "views", documentSnapshot.getLong("views") + 1);
            }
            return null;
        });
    }

    public void addViewsForPost(String postId, Long views) {
        DocumentReference document = firestore.collection(POSTS_COLLECTION).document(postId);

        firestore.runTransaction(transaction -> {
            DocumentSnapshot snapshot = transaction.get(document).get();
            transaction.update(document, "views", snapshot.getLong("views") + views);
            return null;
        });
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
        Date today = localDate.toDate();
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
