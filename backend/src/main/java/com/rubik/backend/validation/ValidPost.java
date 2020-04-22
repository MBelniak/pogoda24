package com.rubik.backend.validation;

import javax.validation.Constraint;
import javax.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Target(TYPE)
@Retention(RUNTIME)
@Constraint(validatedBy = { PostValidation.class })
public @interface ValidPost {
    String message() default "Post of type 'warning' must have 'shortDescription' and 'isAddedToTopBar' properties specified.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
