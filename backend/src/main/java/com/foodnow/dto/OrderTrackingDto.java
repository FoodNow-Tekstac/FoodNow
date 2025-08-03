package com.foodnow.dto;

import com.foodnow.model.OrderStatus;

/**
 * A DTO specifically for the order tracking page. It includes the
 * restaurant's location pin needed for the map.
 */
public class OrderTrackingDto extends OrderDto { // Extends the existing OrderDto
    private String restaurantLocationPin;
    private String deliveryAddress; // For a dummy address

    // Getters and Setters
    public String getRestaurantLocationPin() { return restaurantLocationPin; }
    public void setRestaurantLocationPin(String restaurantLocationPin) { this.restaurantLocationPin = restaurantLocationPin; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
}
