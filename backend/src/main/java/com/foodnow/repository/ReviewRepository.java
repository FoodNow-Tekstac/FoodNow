package com.foodnow.repository;

import com.foodnow.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    Optional<Review> findByOrderId(int orderId);
}
