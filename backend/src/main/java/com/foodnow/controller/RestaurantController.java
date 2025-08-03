package com.foodnow.controller;

import com.foodnow.dto.FoodItemDto;
import com.foodnow.dto.RestaurantDashboardDto;
import com.foodnow.dto.RestaurantDto;
import com.foodnow.model.FoodItem;
import com.foodnow.model.Restaurant;
import com.foodnow.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/restaurant")
@PreAuthorize("hasRole('RESTAURANT_OWNER')")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/dashboard")
    public ResponseEntity<RestaurantDashboardDto> getDashboardData() {
        return ResponseEntity.ok(restaurantService.getDashboardData());
    }

    @PostMapping("/orders/{orderId}/ready")
    public ResponseEntity<Void> readyForPickup(@PathVariable int orderId) {
        restaurantService.readyForPickup(orderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<RestaurantDto> getRestaurantProfile() {
        Restaurant restaurant = restaurantService.getRestaurantByCurrentOwner();
        return ResponseEntity.ok(toRestaurantDto(restaurant));
    }

    @PutMapping("/profile")
    public ResponseEntity<RestaurantDto> updateRestaurantProfile(@RequestBody Restaurant restaurant) {
        Restaurant updatedRestaurant = restaurantService.updateRestaurantProfile(restaurant);
        return ResponseEntity.ok(toRestaurantDto(updatedRestaurant));
    }

    @GetMapping("/menu")
    public ResponseEntity<List<FoodItemDto>> getMenu() {
        List<FoodItem> menu = restaurantService.getMenuByCurrentOwner();
        List<FoodItemDto> dtoList = menu.stream()
                                      .map(this::toFoodItemDto)
                                      .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/menu")
    public ResponseEntity<FoodItemDto> addFoodItem(@RequestBody FoodItemDto foodItemDto) {
        FoodItem item = new FoodItem();
        item.setName(foodItemDto.getName());
        item.setDescription(foodItemDto.getDescription());
        item.setPrice(foodItemDto.getPrice());
        item.setImageUrl(foodItemDto.getImageUrl());
        item.setAvailable(true);

        FoodItem savedItem = restaurantService.addFoodItem(item);
        return ResponseEntity.ok(toFoodItemDto(savedItem));
    }

    @PutMapping("/menu/{itemId}")
    public ResponseEntity<FoodItemDto> updateFoodItem(@PathVariable int itemId, @RequestBody FoodItemDto foodItemDto) {
        FoodItem existingItem = restaurantService.getFoodItemById(itemId);
        existingItem.setName(foodItemDto.getName());
        existingItem.setDescription(foodItemDto.getDescription());
        existingItem.setPrice(foodItemDto.getPrice());
        existingItem.setImageUrl(foodItemDto.getImageUrl());

        FoodItem updated = restaurantService.updateFoodItem(itemId, existingItem);
        return ResponseEntity.ok(toFoodItemDto(updated));
    }

    @PatchMapping("/menu/{itemId}/availability")
    public ResponseEntity<FoodItemDto> toggleFoodItemAvailability(@PathVariable int itemId) {
        FoodItem updatedItem = restaurantService.toggleFoodItemAvailability(itemId);
        return ResponseEntity.ok(toFoodItemDto(updatedItem));
    }

    @DeleteMapping("/menu/{itemId}")
    public ResponseEntity<String> deleteFoodItem(@PathVariable int itemId) {
        restaurantService.deleteFoodItem(itemId);
        return ResponseEntity.ok("Food item deleted successfully.");
    }

    // --- Helper Methods for DTO Conversion ---
    private FoodItemDto toFoodItemDto(FoodItem item) {
        FoodItemDto dto = new FoodItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setImageUrl(item.getImageUrl());
        dto.setAvailable(item.isAvailable());
        return dto;
    }

    private RestaurantDto toRestaurantDto(Restaurant restaurant) {
        RestaurantDto dto = new RestaurantDto();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setAddress(restaurant.getAddress());
        dto.setPhoneNumber(restaurant.getPhoneNumber());
        dto.setLocationPin(restaurant.getLocationPin());
        dto.setImageUrl(restaurant.getImageUrl());

        if (restaurant.getMenu() != null) {
            List<FoodItemDto> menuDto = restaurant.getMenu().stream()
                .map(this::toFoodItemDto)
                .collect(Collectors.toList());
            dto.setMenu(menuDto);
        }
        return dto;
    }
}
