package com.foodnow.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsDto {
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
