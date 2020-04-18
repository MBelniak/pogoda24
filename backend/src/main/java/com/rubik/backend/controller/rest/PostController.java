package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.PostType;
import com.rubik.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("api/posts")
public class PostController {

    private PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/count")
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

    @GetMapping("")
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

    @PostMapping("")
    public ResponseEntity<Post> addPost(@RequestBody @Valid Post post, BindingResult bindingResult) throws BindException {
        if (!bindingResult.hasErrors()) {
            postService.savePost(post);
            post = postService.getPostById(post.getId());
            if (post != null) {
                return new ResponseEntity<>(post, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        throw new BindException(bindingResult);
    }

    @PutMapping("")
    public void updatePost(@RequestBody @Valid Post post, BindingResult bindingResult) throws BindException {
        if (!bindingResult.hasErrors()) {
            postService.savePost(post);
        } else {
            throw new BindException(bindingResult);
        }
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        if (id != null) {
            postService.deletePost(id);
        }
    }

    @GetMapping(value = "/warnings/topBarWarning", produces = "text/plain")
    public String getLatestWarningDescription() {
        List<Post> warnings = postService.getCurrentWarnings(true);
        if (warnings.size() == 0) {
            return null;
        }
        warnings.sort(Comparator.comparing(Post::getPostDate));
        return warnings.get(warnings.size() - 1).getShortDescription();
    }

    @GetMapping("/validWarnings")
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
