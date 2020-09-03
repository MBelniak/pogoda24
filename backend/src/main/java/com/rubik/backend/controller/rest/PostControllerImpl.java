package com.rubik.backend.controller.rest;

import com.rubik.backend.controller.rest.dto.WarningInfoDTO;
import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.PostType;
import com.rubik.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
public class PostControllerImpl implements PostController {

    private PostService postService;
    private Map<String, Post> hashToPostMap;

    @Autowired
    public PostControllerImpl(PostService postService) {
        this.postService = postService;
        this.hashToPostMap = new ConcurrentHashMap<>();
    }

    @Override
    public ResponseEntity<Integer> getPostCount(@RequestParam(required = false) String postType) {
        if (postType != null) {
            if (!PostType.contains(postType)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity<>(postService.getPostCount(PostType.valueOf(postType)), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(postService.getPostCount(), HttpStatus.OK);
    }

    @Override
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
                    return new ResponseEntity<>(postService.getPostsOrderedByDate(PostType.valueOf(postType), page, count), HttpStatus.OK);
                }
            }
        } else if (page == null || count == null) {
            return new ResponseEntity<>(postService.getPostsOrderedByDate(), HttpStatus.OK);
        }

        return new ResponseEntity<>(postService.getPostsOrderedByDate(page, count), HttpStatus.OK);
    }

    @Override
    public Post getPost(@PathVariable("id") String postId, HttpServletRequest request) {
        return postService.getPostById(postId);
    }

    @Override
    public ResponseEntity<String> addPost(@RequestBody Post post, BindingResult bindingResult) throws BindException {
        if (!bindingResult.hasErrors()) {
            String id = postService.savePost(post);
            return id != null ? new ResponseEntity<>(id, HttpStatus.CREATED) : new ResponseEntity<>(HttpStatus.OK);
        }
        throw new BindException(bindingResult);
    }

    @Override
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
            return new ResponseEntity(HttpStatus.CREATED);
        } else {
            throw new BindException(bindingResult);
        }
    }

    @Override
    public ResponseEntity continuePostUpdate(@PathVariable String hash, @RequestParam Boolean success) {
        Post postToSave = hashToPostMap.get(hash);
        if (postToSave == null) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        if (success) {
            postService.savePost(postToSave);
            return new ResponseEntity(HttpStatus.CREATED);
        }
        hashToPostMap.remove(hash);
        return new ResponseEntity(HttpStatus.OK);
    }

    @Override
    public void deletePost(@PathVariable String id) {
        if (id != null) {
            postService.deletePost(id);
        }
    }

    @Override
    public List<WarningInfoDTO> getCurrentWarnings() {
        return postService.getCurrentWarnings();
    }

}
