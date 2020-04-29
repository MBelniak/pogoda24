package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.PostType;
import com.rubik.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("api/posts")
public class PostControllerImpl implements PostController {

    private PostService postService;
    private Map<String, Post> hashToPostMap;

    @Autowired
    public PostControllerImpl(PostService postService) {
        this.postService = postService;
        this.hashToPostMap = new ConcurrentHashMap<>();
    }

    public ResponseEntity<Long> getPostCount(@RequestParam(required = false) String postType) {
        if (postType != null) {
            if (!PostType.contains(postType)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity<>(postService.getPostCount(PostType.valueOf(postType)), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(postService.getPostCount(), HttpStatus.OK);
    }

    public ResponseEntity<List<Post>> getPosts(@RequestParam(required = false) String postType,
                               @RequestParam(required = false) Integer page,
                               @RequestParam(required = false) Integer count) {
        if (postType != null) {
            if (!PostType.contains(postType)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                if (page == null || count == null) {
                    return new ResponseEntity<>(postService.getPostsOrderedByDate(PostType.valueOf(postType)), HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(postService.getPostsOrderedByDate(PostType.valueOf(postType), page, count).getContent(),
                            HttpStatus.OK);
                }
            }
        } else if (page == null || count == null) {
            return new ResponseEntity<>(postService.getPostsOrderedByDate(), HttpStatus.OK);
        }

        return new ResponseEntity<>(postService.getPostsOrderedByDate(page, count).getContent(), HttpStatus.OK);
    }

    public Post getPost(@PathVariable("id") Long postId, HttpServletRequest request) {
        return postService.getPostById(postId);
    }

    public ResponseEntity<Post> addPost(@RequestBody @Valid Post post, BindingResult bindingResult) throws BindException {
        if (!bindingResult.hasErrors()) {
            postService.savePost(post);
            return new ResponseEntity<>(post, HttpStatus.OK);
        }
        throw new BindException(bindingResult);
    }

    public ResponseEntity updatePost(@RequestBody @Valid Post post, BindingResult bindingResult,
                           @RequestParam(required = false) Boolean temporary) throws BindException {
        if (!bindingResult.hasErrors()) {
            if (temporary != null && temporary) {
                String pseudoHash = UUID.randomUUID().toString();
                while (hashToPostMap.get(pseudoHash) != null) {
                    pseudoHash = UUID.randomUUID().toString();
                }
                hashToPostMap.put(pseudoHash, post);
                return new ResponseEntity<>(pseudoHash, HttpStatus.OK);
            }
            postService.savePost(post);
            return new ResponseEntity(HttpStatus.OK);
        } else {
            throw new BindException(bindingResult);
        }
    }

    public ResponseEntity continuePostUpdate(@PathVariable String hash, @RequestParam Boolean success) {
        Post postToSave = hashToPostMap.get(hash);
        if (postToSave == null) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        if (success) {
            postService.savePost(postToSave);
            return new ResponseEntity(HttpStatus.OK);
        }
        hashToPostMap.remove(hash);
        return new ResponseEntity(HttpStatus.OK);
    }

    public void deletePost(@PathVariable Long id) {
        if (id != null) {
            postService.deletePost(id);
        }
    }

    public String getLatestWarningDescription() {
        List<Post> warnings = postService.getCurrentWarnings(true);
        if (warnings.size() == 0) {
            return null;
        }
        warnings.sort(Comparator.comparing(Post::getPostDate));
        return warnings.get(warnings.size() - 1).getShortDescription();
    }

    public List<Post> getValidWarnings(@RequestParam(required = false) Boolean isAddedToTopBar) {
        List<Post> warnings;
        if (isAddedToTopBar == null) {
            warnings = postService.getCurrentWarnings();
        } else {
            warnings = postService.getCurrentWarnings(isAddedToTopBar);
        }
        return warnings;
    }
}
