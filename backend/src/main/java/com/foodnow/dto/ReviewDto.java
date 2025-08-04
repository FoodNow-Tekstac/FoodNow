package com.foodnow.dto;

import java.time.LocalDateTime;

public class ReviewDto {
    private int rating;
    private String comment;
    private String customerName;
    private LocalDateTime reviewDate;

    // Getters and Setters
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }
}