package com.foodnow.dto;

import com.foodnow.model.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {
    private int id;
    private String restaurantName;
    private String customerName;
    private List<OrderItemDto> items;
    private double totalPrice;
    private OrderStatus status;
    private LocalDateTime orderTime;
    private boolean hasReview; // ADD THIS FIELD
   private Integer reviewRating;
    private String reviewComment;
      private String deliveryAddressLine1;
    private String deliveryCity;
    private String deliveryPostalCode;
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public LocalDateTime getOrderTime() { return orderTime; }
    public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }
    public boolean isHasReview() { return hasReview; } // ADD THIS GETTER
    public void setHasReview(boolean hasReview) { this.hasReview = hasReview; } // ADD THIS SETTER
    public Integer getReviewRating() { return reviewRating; } // ADD THIS GETTER
    public void setReviewRating(Integer reviewRating) { this.reviewRating = reviewRating; } // ADD THIS SETTER
    public String getReviewComment() { return reviewComment; } // ADD THIS GETTER
    public void setReviewComment(String reviewComment) { this.reviewComment = reviewComment; } // ADD THIS SETTER
public String getDeliveryAddressLine1() {
        return deliveryAddressLine1;
    }

    public void setDeliveryAddressLine1(String deliveryAddressLine1) {
        this.deliveryAddressLine1 = deliveryAddressLine1;
    }

    public String getDeliveryCity() {
        return deliveryCity;
    }

    public void setDeliveryCity(String deliveryCity) {
        this.deliveryCity = deliveryCity;
    }

    public String getDeliveryPostalCode() {
        return deliveryPostalCode;
    }

    public void setDeliveryPostalCode(String deliveryPostalCode) {
        this.deliveryPostalCode = deliveryPostalCode;
}
}