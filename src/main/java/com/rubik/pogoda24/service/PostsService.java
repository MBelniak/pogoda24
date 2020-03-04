package com.rubik.pogoda24.service;

import com.rubik.pogoda24.entity.Post;
import com.rubik.pogoda24.repository.PostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PostsService {

    private PostsRepository postsRepository;

    @Autowired
    public PostsService(PostsRepository postsRepository) {
        this.postsRepository = postsRepository;
    }

    public Page<Post> getOrderedByDate(int page, int count) {
        Pageable pageable = PageRequest.of(page, count, Sort.by("timestamp").descending());
        return postsRepository.findAll(pageable);
    }
}
