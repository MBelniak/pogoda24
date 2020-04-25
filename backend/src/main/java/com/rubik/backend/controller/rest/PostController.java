package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.Post;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;

public interface PostController {

    @GetMapping("/count")
    ResponseEntity<Long> getPostCount(@RequestParam(required = false) String postType);

    @GetMapping("")
    ResponseEntity<List<Post>> getPosts(@RequestParam(required = false) String postType,
                                               @RequestParam(required = false) Integer page,
                                               @RequestParam(required = false) Integer count);

    @GetMapping("/{id}")
    Post getPost(@PathVariable("id") Long postId);

    @Transactional
    @PostMapping("")
    ResponseEntity<Post> addPost(@RequestBody @Valid Post post, BindingResult bindingResult) throws BindException;

    @Transactional
    @PutMapping("")
    ResponseEntity updatePost(@RequestBody @Valid Post post, BindingResult bindingResult,
                                     @RequestParam(required = false) Boolean temporary) throws BindException;

    @Transactional
    @GetMapping("/continuePostUpdate/{hash}")
    ResponseEntity continuePostUpdate(@PathVariable String hash, @RequestParam Boolean success);

    @Transactional
    @DeleteMapping("/{id}")
    void deletePost(@PathVariable Long id);

    @GetMapping(value = "/warnings/topBarWarning", produces = "text/plain")
    String getLatestWarningDescription();

    @GetMapping("/validWarnings")
    List<Post> getValidWarnings(@RequestParam(required = false) Boolean isAddedToTopBar);
}
