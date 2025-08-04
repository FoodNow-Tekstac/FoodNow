package com.foodnow.dto;

import java.util.List;

// DTO for returning a restaurant with its menu
public class RestaurantDto {
    private int id;
    private String name;
    private String address;
    private String phoneNumber;
    private String locationPin;
    private String ownerName; // ADD THIS FIELD
    private List<FoodItemDto> menu;
    private String imageUrl; // ADD THIS FIELD

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getLocationPin() { return locationPin; }
    public void setLocationPin(String locationPin) { this.locationPin = locationPin; }
    public List<FoodItemDto> getMenu() { return menu; }
    public void setMenu(List<FoodItemDto> menu) { this.menu = menu; }
   public String getImageUrl() { return imageUrl; } // ADD THIS GETTER
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; } // ADD THIS SETTER
    // ADD THESE GETTER AND SETTER METHODS
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
}
