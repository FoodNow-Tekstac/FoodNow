package com.foodnow.dto;

import com.foodnow.model.Role;
import com.foodnow.model.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * This file contains all the DTOs used by the Admin panel.
 */
public class AdminDtos {

    // DTO for displaying user information
    public static class UserDto {
        private int id;
        private String name;
        private String email;
        private String phoneNumber;
        private Role role;

        // Getters and Setters
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
    }

    // DTO for displaying restaurant information
    public static class RestaurantDto {
        private int id;
        private String name;
        private String address;
        private String ownerName;

        // Getters and Setters
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getOwnerName() { return ownerName; }
        public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    }

    // DTO for displaying order information
    public static class OrderDto {
        private int id;
        private String restaurantName;
        private String customerName;
        private double totalPrice;
        private OrderStatus status;
        private LocalDateTime orderTime;
private Integer reviewRating;
        private String reviewComment;
        // Getters and Setters
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public String getRestaurantName() { return restaurantName; }
        public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public double getTotalPrice() { return totalPrice; }
        public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
        public OrderStatus getStatus() { return status; }
        public void setStatus(OrderStatus status) { this.status = status; }
        public LocalDateTime getOrderTime() { return orderTime; }
        public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }
        public Integer getReviewRating() { return reviewRating; } // ADD THIS GETTER
        public void setReviewRating(Integer reviewRating) { this.reviewRating = reviewRating; } // ADD THIS SETTER
        public String getReviewComment() { return reviewComment; } // ADD THIS GETTER
        public void setReviewComment(String reviewComment) { this.reviewComment = reviewComment; } // ADD THIS SETTER
    
    }
    
    // DTO for displaying analytics data
    public static class AnalyticsDto {
        private long totalUsers;
        private long totalRestaurants;
        private long totalOrders;
        private long pendingOrders;
        private long deliveredOrders;
        private List<Map<String, Object>> ordersPerRestaurant;

        // Getters and Setters
        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public long getTotalRestaurants() { return totalRestaurants; }
        public void setTotalRestaurants(long totalRestaurants) { this.totalRestaurants = totalRestaurants; }
        public long getTotalOrders() { return totalOrders; }
        public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
        public long getPendingOrders() { return pendingOrders; }
        public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }
        public long getDeliveredOrders() { return deliveredOrders; }
        public void setDeliveredOrders(long deliveredOrders) { this.deliveredOrders = deliveredOrders; }
        public List<Map<String, Object>> getOrdersPerRestaurant() { return ordersPerRestaurant; }
        public void setOrdersPerRestaurant(List<Map<String, Object>> ordersPerRestaurant) { this.ordersPerRestaurant = ordersPerRestaurant; }
    }
}
