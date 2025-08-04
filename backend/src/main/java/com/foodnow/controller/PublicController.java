package com.foodnow.controller;

import com.foodnow.dto.RestaurantDto;
import com.foodnow.service.PublicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private PublicService publicService;

    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants() {
        return ResponseEntity.ok(publicService.getAllActiveRestaurants());
    }

    @GetMapping("/restaurants/{restaurantId}/menu")
    public ResponseEntity<RestaurantDto> getRestaurantMenu(@PathVariable int restaurantId) {
        try {
            return ResponseEntity.ok(publicService.getRestaurantWithMenu(restaurantId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
