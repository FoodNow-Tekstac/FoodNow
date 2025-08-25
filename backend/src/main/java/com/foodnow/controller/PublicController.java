package com.foodnow.controller;

import com.foodnow.dto.RestaurantDto;
import com.foodnow.service.PublicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    
    private static final Logger logger = LoggerFactory.getLogger(PublicController.class);

    @Autowired
    private PublicService publicService;

    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants() {
        logger.info("Fetching all restaurants for customer dashboard");
        
        List<RestaurantDto> restaurants = publicService.getAllActiveRestaurants();
        
        // Log the image URLs for debugging
        restaurants.forEach(restaurant -> 
            logger.info("Restaurant: {}, ImageUrl: {}", restaurant.getName(), restaurant.getImageUrl())
        );
        
        // Set cache headers on server side only to prevent aggressive caching
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noCache().mustRevalidate())
                .header("Pragma", "no-cache")
                .header("Expires", "0")
                .body(restaurants);
    }

    @GetMapping("/restaurants/{restaurantId}/menu")
    public ResponseEntity<RestaurantDto> getRestaurantMenu(@PathVariable int restaurantId) {
        logger.info("Fetching menu for restaurant ID: {}", restaurantId);
        
        try {
            RestaurantDto restaurant = publicService.getRestaurantWithMenu(restaurantId);
            logger.info("Restaurant menu fetched: {}, ImageUrl: {}", restaurant.getName(), restaurant.getImageUrl());
            
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES)) // Cache menu for 5 minutes
                    .body(restaurant);
        } catch (RuntimeException e) {
            logger.error("Restaurant not found with ID: {}", restaurantId, e);
            return ResponseEntity.notFound().build();
        }
    }
}