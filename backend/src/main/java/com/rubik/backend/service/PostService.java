package com.rubik.backend.service;

import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.PostType;
import com.rubik.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class PostService {

    private PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getPostsOrderedByDate() {
        return postRepository.findAll();
    }

    public List<Post> getPostsOrderedByDate(PostType postType) {
        return postRepository.findAllByPostType(postType);
    }

    public Page<Post> getPostsOrderedByDate(int page, int count) {
        Pageable pageable = PageRequest.of(page, count, Sort.by("postDate").descending());
        return postRepository.findAll(pageable);
    }

    public Page<Post> getPostsOrderedByDate(PostType postType, int page, int count) {
        Pageable pageable = PageRequest.of(page, count, Sort.by("postDate").descending());
        return postRepository.findAllByPostType(postType, pageable);
    }

    public Post getPostById(Long id) {
        return postRepository.findAllById(id);
    }

    public void savePost(Post post) {
        postRepository.saveAndFlush(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public Long getPostCount() {
        return postRepository.count();
    }

    public Long getPostCount(PostType postType) {
        return postRepository.countByPostType(postType);
    }

    public List<Post> getCurrentWarnings() {
        return postRepository.findAllValidWarnings(new Timestamp(new Date().getTime()));
    }

    public List<Post> getCurrentWarnings(boolean isAddedToTopBar) {
        return postRepository.findAllValidWarnings(new Timestamp(new Date().getTime()), isAddedToTopBar);
    }

    public void updateViewsForPost(Long postId, Long views) {
        Post post = this.getPostById(postId);
        post.setViews(post.getViews() + views);
        this.savePost(post);
    }
}
