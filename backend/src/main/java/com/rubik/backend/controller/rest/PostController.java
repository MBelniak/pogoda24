package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.Post;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;

@RequestMapping("api/posts")
public interface PostController {

    @GetMapping("/count")
    ResponseEntity<Long> getPostCount(@RequestParam(required = false) String postType);

    @GetMapping("")
    ResponseEntity<List<Post>> getPosts(@RequestParam(required = false) String postType,
                                               @RequestParam(required = false) Integer page,
                                               @RequestParam(required = false) Integer count);

    @GetMapping("/{id}")
    Post getPost(@PathVariable("id") Long postId, HttpServletRequest request);

    @Transactional
    @PostMapping("")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<Post> addPost(@RequestBody @Valid Post post, BindingResult bindingResult) throws BindException;

    @Transactional
    @PutMapping("")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity updatePost(@RequestBody @Valid Post post, BindingResult bindingResult,
                                     @RequestParam(required = false) Boolean temporary) throws BindException;

    @Transactional
    @GetMapping("/continuePostUpdate/{hash}")
    ResponseEntity continuePostUpdate(@PathVariable String hash, @RequestParam Boolean success);

    @Transactional
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    void deletePost(@PathVariable Long id);

    @GetMapping(value = "/warnings/topBarWarning", produces = "text/plain")
    String getLatestWarningDescription();

    @GetMapping("/validWarnings")
    List<Post> getValidWarnings(@RequestParam(required = false) Boolean isAddedToTopBar);
}
