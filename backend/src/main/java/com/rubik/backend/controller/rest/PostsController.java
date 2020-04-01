package com.rubik.backend.controller.rest;

import com.rubik.backend.dtos.PostDTO;
import com.rubik.backend.entity.Post;
import com.rubik.backend.service.ForecastMapsService;
import com.rubik.backend.service.PostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@RestController
@RequestMapping("api")
public class PostsController {

    private PostsService postsService;
    private ForecastMapsService forecastMapsService;

    @Autowired
    public PostsController(PostsService postsService, ForecastMapsService forecastMapsService) {
        this.postsService = postsService;
        this.forecastMapsService = forecastMapsService;
    }


    @GetMapping("/posts")
    public List<Post> getPosts(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer count) {
        if (page == null || count == null)
            return postsService.getOrderedByDate();

        Page<Post> posts = postsService.getOrderedByDate(page, count);
        if (posts == null) {
            return new ArrayList<>();
        }

        return posts.getContent();
    }

    @GetMapping("/fullPosts")
    public List<PostDTO> getFullPosts(@RequestParam int page, @RequestParam int count) {
        Page<Post> posts = postsService.getOrderedByDate(page, count);
        List<PostDTO> fullPosts = new LinkedList<>();
        posts.getContent().forEach(post -> {
            PostDTO postDTO = new PostDTO(post);
            postDTO.setImagesIds(forecastMapsService.getImagesPublicIds(post.getId()));
            fullPosts.add(postDTO);
        });

        return fullPosts;
    }
}
