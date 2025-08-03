package com.foodnow.dto;

public class OrderItemDto {
    private String itemName;
    private int quantity;
    private double price;
        private String imageUrl; // ADD THIS FIELD


    // Getters and Setters
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
     public String getImageUrl() { return imageUrl; } // ADD THIS GETTER
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; } // ADD THIS SETTER
}
