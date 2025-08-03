package com.foodnow.service;

import com.foodnow.dto.ReviewRequest;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.*;
import com.foodnow.repository.OrderRepository;
import com.foodnow.repository.ReviewRepository;
import com.foodnow.repository.UserRepository;
import com.foodnow.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ReviewService {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;

    @Transactional
    public Review createReview(int orderId, ReviewRequest reviewRequest) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        // Validation checks
        if (order.getCustomer().getId() != currentUser.getId()) {
            throw new SecurityException("You can only review your own orders.");
        }
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new IllegalStateException("You can only review delivered orders.");
        }
        if (reviewRepository.findByOrderId(orderId).isPresent()) {
            throw new IllegalStateException("This order has already been reviewed.");
        }

        Review review = new Review();
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());
        review.setReviewDate(LocalDateTime.now());
        review.setOrder(order);
        review.setUser(currentUser);
        review.setRestaurant(order.getRestaurant());

        return reviewRepository.save(review);
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
