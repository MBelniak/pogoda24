package com.rubik.backend.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.rubik.backend.controller.rest.dto.WarningInfoDTO;
import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.PostType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import static com.rubik.backend.constants.ServiceConstants.POSTS_COLLECTION;

@Service
public class PostService {

    private Firestore firestore;

    @Autowired
    public PostService(Firestore firestore) {
        this.firestore = firestore;
    }

    public Post getPostById(String id) {
        DocumentReference docRef = firestore.collection(POSTS_COLLECTION).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        try {
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                return document.toObject(Post.class);
            } else {
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Post> getPostsOrderedByDate() {
        return getPostsOrderedByDate(null, null);
    }

    public List<Post> getPostsOrderedByDate(PostType postType, String filter) {
        CollectionReference postsCollection = firestore.collection(POSTS_COLLECTION);
        Query query;

        if (filter != null) {
            query = postsCollection.orderBy("title").startAt(filter).endAt(filter + "\uf8ff");
        } else {
            query = postsCollection.orderBy("postDate", Query.Direction.DESCENDING);
        }

        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        try {
            if (postType != null) {
                List<Post> posts = querySnapshot.get().toObjects(Post.class);
                return posts.stream().filter(post -> post.getPostType() == postType).collect(Collectors.toList());
            } else {
                return querySnapshot.get().toObjects(Post.class);
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Post> getPostsOrderedByDate(String postType, Integer page, Integer pageSize, String filter) {
        if (page == null) {
            return this.getPostsOrderedByDate(PostType.valueOf(postType), filter);
        }

        CollectionReference postsCollection = firestore.collection(POSTS_COLLECTION);

        Query query;

        if (filter != null) {
            query = postsCollection.orderBy("title").startAt(filter).endAt(filter + "\uf8ff");
        } else {
            query = postsCollection.orderBy("postDate", Query.Direction.DESCENDING);
        }

        if (postType == null) {
            query = query.limit(pageSize).offset(page * pageSize);
            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            try {
                return querySnapshot.get().toObjects(Post.class);
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
                return null;
            }
        } else {
            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            try {
                List<Post> posts = querySnapshot.get().toObjects(Post.class);
                posts = posts.stream().filter(post -> post.getPostType() == PostType.valueOf(postType)).collect(Collectors.toList());
                if (page * pageSize + pageSize <= posts.size()) {
                    return posts.subList(page * pageSize, page * pageSize + pageSize);
                } else if (page * pageSize <= posts.size()) {
                    return posts.subList(page * pageSize, posts.size());
                } else {
                    return new ArrayList<>();
                }
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
                return null;
            }
        }
    }

    public String savePost(Post post) {
        if (post.getId() == null) {
            ApiFuture<DocumentReference> addedDocRef = firestore.collection(POSTS_COLLECTION).add(post);
            try {
                return addedDocRef.get().getId();
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
                return null;
            }
        } else {
            firestore.collection(POSTS_COLLECTION).document(post.getId()).set(post);
            return post.getId();
        }
    }

    public void deletePost(String id) {
        firestore.collection(POSTS_COLLECTION).document(id).delete();
    }

    public int getPostCount(String filter) {
        CollectionReference posts = firestore.collection(POSTS_COLLECTION);

        ApiFuture<QuerySnapshot> querySnapshot;

        if (filter != null) {
            Query query = posts.orderBy("title").startAt(filter).endAt(filter + "\uf8ff");
            querySnapshot = query.get();
        } else {
            querySnapshot = posts.get();
        }

        try {
            return querySnapshot.get().size();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return 0;
        }
    }

    public int getPostCount(PostType postType, String filter) {
        CollectionReference posts = firestore.collection(POSTS_COLLECTION);
        ApiFuture<QuerySnapshot> querySnapshot;

        if (filter != null) {
            Query query = posts.whereEqualTo("postType", postType.toString()).orderBy("title").startAt(filter).endAt(filter + "\uf8ff");
            querySnapshot = query.get();
        } else {
            querySnapshot = posts.whereEqualTo("postType", postType.toString()).get();
        }

        try {
            return querySnapshot.get().size();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return 0;
        }
    }

    public List<WarningInfoDTO> getCurrentWarnings() {
        CollectionReference postsRef = firestore.collection(POSTS_COLLECTION);
        Query query = postsRef.orderBy("postDate", Query.Direction.DESCENDING);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        try {
            List<Post> posts = querySnapshot.get().toObjects(Post.class);
            posts = posts.stream()
                    .filter(post -> post.getPostType() == PostType.WARNING
                                && post.getDueDate() != null
                                && post.getDueDate().getTime() >= new Date().getTime())
                    .collect(Collectors.toList());

            return posts.stream().map(WarningInfoDTO::new).collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }
}
