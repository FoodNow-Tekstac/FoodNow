package com.foodnow.dto;

import com.foodnow.model.DietaryType;
import com.foodnow.model.FoodCategory;

public class FoodItemDto {
    private int id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private boolean available;
    private String restaurantName;
    private int restaurantId;
    private FoodCategory category;
    private DietaryType dietaryType;

    // --- NEW FIELDS FOR RATING ---
    private double averageRating;
    private int ratingCount;

    // Getters and Setters for all fields...
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }
    public int getRestaurantId() { return restaurantId; }
    public void setRestaurantId(int restaurantId) { this.restaurantId = restaurantId; }
    public FoodCategory getCategory() { return category; }
    public void setCategory(FoodCategory category) { this.category = category; }
    public DietaryType getDietaryType() { return dietaryType; }
    public void setDietaryType(DietaryType dietaryType) { this.dietaryType = dietaryType; }
    public double getAverageRating() { return averageRating; } // ADD THIS
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; } // ADD THIS
    public int getRatingCount() { return ratingCount; } // ADD THIS
    public void setRatingCount(int ratingCount) { this.ratingCount = ratingCount; } // ADD THIS
}
