package com.rubik.backend.repository;

import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Post findFirstById(Long id);

    List<Post> findAllByIdIn(List<Long> ids);

    Page<Post> findAll(Pageable pageable);

    Page<Post> findAllByPostType(PostType postType, Pageable pageable);

    @Query(value = "SELECT * FROM post p ORDER BY p.post_date DESC", nativeQuery = true)
    List<Post> findAllOrderedByDate();

    @Query(value = "SELECT * FROM post p WHERE p.post_type = ?1 ORDER BY p.post_date DESC", nativeQuery = true)
    List<Post> findAllByPostTypeOrderedByDate(PostType postType);

    Long countByPostType(PostType postType);

    @Query(value = "SELECT views FROM post p WHERE p.id = ?1", nativeQuery = true)
    Long getViewsByPostId(Long id);
}
