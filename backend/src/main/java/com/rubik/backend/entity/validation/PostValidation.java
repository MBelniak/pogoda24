package com.rubik.backend.entity.validation;

import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.PostType;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PostValidation implements ConstraintValidator<ValidPost, Post> {
    public void initialize(ValidPost validPostAnnotation) {
    }

    public boolean isValid(Post post, ConstraintValidatorContext context) {
        if (PostType.WARNING.toString().equals(post.getPostType().toString())) {
            return post.getDueDate() != null;
        }
        return true;
    }
}