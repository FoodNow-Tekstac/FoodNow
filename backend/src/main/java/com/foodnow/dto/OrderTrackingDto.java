package com.foodnow.dto;

import com.foodnow.model.OrderStatus;

/**
 * A DTO specifically for the order tracking page. 
 * It includes the restaurant's location pin needed for the map,
 * as well as a structured delivery address.
 */


/**
 * A DTO specifically for the order tracking page. 
 * It includes the restaurant's business ID.
 */
public class OrderTrackingDto extends OrderDto { // Extends the existing OrderDto
    
    private String restaurantBusinessId;

    
    // Getters and Setters updated
    public String getRestaurantBusinessId() {
        return restaurantBusinessId;
    }

    public void setRestaurantBusinessId(String restaurantBusinessId) {
        this.restaurantBusinessId = restaurantBusinessId;
    }
}
