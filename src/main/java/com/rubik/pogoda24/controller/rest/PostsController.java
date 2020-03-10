package com.rubik.pogoda24.controller.rest;

import com.rubik.pogoda24.entity.Post;
import com.rubik.pogoda24.service.PostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@RestApiController("api")
public class PostsController {

    private PostsService postsService;

    @Autowired
    public PostsController(PostsService postsService) {
        this.postsService = postsService;
    }


    @GetMapping("/posts")
    public List<Post> getPosts(@RequestParam int page, @RequestParam int count) {
        Page<Post> posts = postsService.getOrderedByDate(page, count);
        if (posts == null || posts.isEmpty()) {
            return new ArrayList<>();
        }

        return posts.toList();
    }
}
