package com.foodnow.dto;

import java.util.List;

public class CartDto {
    private int id;
    private List<CartItemDto> items;
    private double totalPrice;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
}