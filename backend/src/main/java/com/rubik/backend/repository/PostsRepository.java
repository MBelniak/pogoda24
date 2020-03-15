package com.rubik.backend.repository;

import com.rubik.backend.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostsRepository extends JpaRepository<Post, Long> {

    Post findPostById(Long id);

    List<Post> findAll();

    Page<Post> findAll(Pageable pageable);
}
