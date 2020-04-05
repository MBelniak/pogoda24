package com.rubik.backend.service;

import com.rubik.backend.entity.Post;
import com.rubik.backend.repository.PostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostsService {

    private PostsRepository postsRepository;

    @Autowired
    public PostsService(PostsRepository postsRepository) {
        this.postsRepository = postsRepository;
    }

    public List<Post> getOrderedByDate() {
        return postsRepository.findAll();
    }

    public Page<Post> getOrderedByDate(int page, int count) {
        Pageable pageable = PageRequest.of(page, count, Sort.by("postDate").descending());
        return postsRepository.findAll(pageable);
    }

    public Post savePost(Post post) {
        return postsRepository.save(post);
    }
}
