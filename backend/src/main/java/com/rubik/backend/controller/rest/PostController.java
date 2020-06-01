package com.rubik.backend.controller.rest;

import com.rubik.backend.controller.rest.dto.WarningInfoDTO;
import com.rubik.backend.entity.Post;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@RequestMapping("api/posts")
public interface PostController {

    @GetMapping("/count")
    ResponseEntity<Integer> getPostCount(@RequestParam(required = false) String postType);

    @GetMapping("")
    ResponseEntity<List<Post>> getPosts(@RequestParam(required = false) String postType,
                                               @RequestParam(required = false) Integer page,
                                               @RequestParam(required = false) Integer count);

    @GetMapping("/{id}")
    Post getPost(@PathVariable("id") String postId, HttpServletRequest request);

    @PostMapping("")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<String> addPost(@RequestBody @Valid Post post, BindingResult bindingResult) throws BindException;

    @PutMapping("")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity updatePost(@RequestBody @Valid Post post, BindingResult bindingResult,
                                     @RequestParam(required = false) Boolean temporary) throws BindException;

    @GetMapping("/continuePostUpdate/{hash}")
    ResponseEntity continuePostUpdate(@PathVariable String hash, @RequestParam Boolean success);

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    void deletePost(@PathVariable String id);

    @GetMapping(value = "/currentWarnings")
    List<WarningInfoDTO> getCurrentWarnings();
}
