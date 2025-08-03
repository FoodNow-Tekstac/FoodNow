package com.foodnow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "food_items")
public class FoodItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private int id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String description;
    @Column(nullable = false) private double price;
    private String imageUrl;
    @Column(nullable = false) private boolean available = true;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DietaryType dietaryType;


    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "restaurant_id", nullable = false) @JsonIgnore private Restaurant restaurant;

    // Getters and Setters...
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
    public Restaurant getRestaurant() { return restaurant; }
    public void setRestaurant(Restaurant restaurant) { this.restaurant = restaurant; }
        public FoodCategory getCategory() { return category; } // ADD THIS GETTER
    public void setCategory(FoodCategory category) { this.category = category; } // ADD THIS SETTER
    public DietaryType getDietaryType() { return dietaryType; } // ADD THIS GETTER
    public void setDietaryType(DietaryType dietaryType) { this.dietaryType = dietaryType;}
}