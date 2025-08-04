package com.foodnow.dto;

public class CartItemDto {
    private int id;
    private FoodItemDto foodItem;
    private int quantity;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public FoodItemDto getFoodItem() { return foodItem; }
    public void setFoodItem(FoodItemDto foodItem) { this.foodItem = foodItem; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}