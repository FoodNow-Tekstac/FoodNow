package com.foodnow.dto;

public class RestaurantApplicationRequest {

    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;
    private String businessId; // Renamed from locationPin
    private String imageUrl;

    // Getters and Setters
    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }
    public String getRestaurantAddress() { return restaurantAddress; }
    public void setRestaurantAddress(String restaurantAddress) { this.restaurantAddress = restaurantAddress; }
    public String getRestaurantPhone() { return restaurantPhone; }
    public void setRestaurantPhone(String restaurantPhone) { this.restaurantPhone = restaurantPhone; }
    public String getBusinessId() { return businessId; } // Updated getter
    public void setBusinessId(String businessId) { this.businessId = businessId; } // Updated setter
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
}