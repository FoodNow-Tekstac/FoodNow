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
    // These are the missing fields that caused your error
    private String restaurantName;
    private int restaurantId;
    // --- NEW FIELDS ---
    private FoodCategory category;
    private DietaryType dietaryType;
    // Constructors
    public FoodItemDto() {}

    // Getters and Setters for all fields
    public int getId() { 
        return id; 
    }
    
    public void setId(int id) { 
        this.id = id; 
    }
    
    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }
    
    public String getDescription() { 
        return description; 
    }
    
    public void setDescription(String description) { 
        this.description = description; 
    }
    
    public double getPrice() { 
        return price; 
    }
    
    public void setPrice(double price) { 
        this.price = price; 
    }
    
    public String getImageUrl() { 
        return imageUrl; 
    }
    
    public void setImageUrl(String imageUrl) { 
        this.imageUrl = imageUrl; 
    }
    
    public boolean isAvailable() { 
        return available; 
    }
    
    public void setAvailable(boolean available) { 
        this.available = available; 
    }
    
    // These were missing - causing your compilation error
    public String getRestaurantName() { 
        return restaurantName; 
    }
    
    public void setRestaurantName(String restaurantName) { 
        this.restaurantName = restaurantName; 
    }
    
    public int getRestaurantId() { 
        return restaurantId; 
    }
    
    public void setRestaurantId(int restaurantId) { 
        this.restaurantId = restaurantId; 
    }

     public FoodCategory getCategory() { return category; } // ADD THIS GETTER
    public void setCategory(FoodCategory category) { this.category = category; } // ADD THIS SETTER
    public DietaryType getDietaryType() { return dietaryType; } // ADD THIS GETTER
    public void setDietaryType(DietaryType dietaryType) { this.dietaryType = dietaryType; } // ADD THIS SETTER
}