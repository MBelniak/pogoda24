package com.rubik.pogoda24.repository;

import com.rubik.pogoda24.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostsRepository extends JpaRepository<Post, Long> {

    public Post findPostById(Long id);

    public Page<Post> findAll(Pageable pageable);
}
