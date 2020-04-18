package com.rubik.backend.entity;

import java.util.Arrays;

public enum PostType {
    FORECAST, WARNING, FACT;

    public static boolean contains(String test) {
        return Arrays.stream(PostType.values()).anyMatch(postType -> postType.name().equals(test));
    }
}
