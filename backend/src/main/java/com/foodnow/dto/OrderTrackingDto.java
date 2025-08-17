package com.foodnow.dto;

import com.foodnow.model.OrderStatus;

/**
 * A DTO specifically for the order tracking page. 
 * It includes the restaurant's location pin needed for the map,
 * as well as a structured delivery address.
 */
public class OrderTrackingDto extends OrderDto { // Extends the existing OrderDto
    
    private String restaurantLocationPin;

    
    // Getters and Setters
    public String getRestaurantLocationPin() {
        return restaurantLocationPin;
    }

    public void setRestaurantLocationPin(String restaurantLocationPin) {
        this.restaurantLocationPin = restaurantLocationPin;
    }

    
}
