package com.foodnow.dto;

public class RestaurantApplicationRequest {

    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;
    private String locationPin; // Add this new field
    private String imageUrl; // Field for the image path

    // Getters and Setters
    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }
    public String getRestaurantAddress() { return restaurantAddress; }
    public void setRestaurantAddress(String restaurantAddress) { this.restaurantAddress = restaurantAddress; }
    public String getRestaurantPhone() { return restaurantPhone; }
    public void setRestaurantPhone(String restaurantPhone) { this.restaurantPhone = restaurantPhone; }
    public String getLocationPin() { return locationPin; }
    public void setLocationPin(String locationPin) { this.locationPin = locationPin; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
}