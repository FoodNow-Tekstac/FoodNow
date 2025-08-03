package com.foodnow.controller;

import com.foodnow.dto.ReviewRequest;
import com.foodnow.model.Review;
import com.foodnow.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('CUSTOMER')")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/orders/{orderId}/review")
    public ResponseEntity<Review> createReview(@PathVariable int orderId, @RequestBody ReviewRequest reviewRequest) {
        Review newReview = reviewService.createReview(orderId, reviewRequest);
        return ResponseEntity.ok(newReview);
    }
}