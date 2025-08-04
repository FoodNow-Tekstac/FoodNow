package com.foodnow.model;

public enum OrderStatus {
    PENDING,        // Order placed, waiting for restaurant confirmation
    CONFIRMED,      // Restaurant has accepted the order
    PREPARING,      // Order is being prepared
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED       // Order was cancelled by user or restaurant
}