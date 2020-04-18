package com.rubik.backend.repository;

import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Post findAllById(Long id);

    List<Post> findAllByPostType(PostType postType);

    List<Post> findAll();

    Page<Post> findAll(Pageable pageable);

    Page<Post> findAllByPostType(PostType postType, Pageable pageable);

    Long countByPostType(PostType postType);

    @Query(value = "SELECT * FROM post p WHERE p.post_type = 'WARNING' AND p.post_date < ?1 AND p.due_date >= ?1",
            nativeQuery = true)
    List<Post> findAllValidWarnings(Timestamp date);

    @Query(value = "SELECT * FROM post p WHERE p.post_type = 'WARNING' AND p.post_date < ?1 AND p.due_date >= ?1 AND p.is_added_to_top_bar = ?2",
            nativeQuery = true)
    List<Post> findAllValidWarnings(Timestamp date, boolean isAddedToTopBar);
}
