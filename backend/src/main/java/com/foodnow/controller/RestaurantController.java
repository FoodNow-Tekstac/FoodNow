package com.foodnow.controller;

import com.foodnow.dto.FoodItemDto;
import com.foodnow.dto.RestaurantDashboardDto;
import com.foodnow.dto.RestaurantDto;
import com.foodnow.dto.UpdateRestaurantImageRequest;
import com.foodnow.model.FoodItem;
import com.foodnow.model.Restaurant;
import com.foodnow.service.FileStorageService;
import com.foodnow.service.RestaurantService;
import org.slf4j.Logger; // 1. Import Logger
import org.slf4j.LoggerFactory; // 2. Import LoggerFactory
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/restaurant")
@PreAuthorize("hasRole('RESTAURANT_OWNER')")
public class RestaurantController {

    // 3. Add a logger instance
    private static final Logger logger = LoggerFactory.getLogger(RestaurantController.class);

    @Autowired
    private RestaurantService restaurantService;
    
    @Autowired
    private FileStorageService fileStorageService;

    // ... your other endpoints ...

    @PostMapping("/profile/upload-image")
    public ResponseEntity<RestaurantDto> uploadAndUpdateRestaurantImage(@RequestParam("file") MultipartFile file) {
        // 4. Add a log to see if the method is being called
        logger.info("Attempting to upload and update restaurant profile image...");
        
        if (file.isEmpty()) {
            logger.error("Upload failed because the file was empty.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            logger.info("File received: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());
            
            // First, save the file using the storage service
            String filePath = fileStorageService.storeFile(file);
            
            // 5. Add a log to see the new file path
            logger.info("File successfully stored at path: {}", filePath);

            // Then, update the database with the new file path
            Restaurant updatedRestaurant = restaurantService.updateRestaurantImage(filePath);
            
            return ResponseEntity.ok(toRestaurantDto(updatedRestaurant));
        } catch (Exception e) {
            // 6. THIS IS THE MOST IMPORTANT LOG: It will print the exact error
            logger.error("Failed to upload restaurant image due to an exception.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ... all other methods and helper methods ...
    
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
    
    @PutMapping("/profile/image")
    public ResponseEntity<RestaurantDto> updateRestaurantImage(@RequestBody UpdateRestaurantImageRequest request) {
        Restaurant updatedRestaurant = restaurantService.updateRestaurantImage(request.getImageUrl());
        return ResponseEntity.ok(toRestaurantDto(updatedRestaurant));
    }

    @GetMapping("/menu")
    public ResponseEntity<List<FoodItemDto>> getMenu() {
        List<FoodItem> menu = restaurantService.getMenuByCurrentOwner();
        List<FoodItemDto> dtoList = menu.stream().map(this::toFoodItemDto).collect(Collectors.toList());
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
        item.setCategory(foodItemDto.getCategory());
        item.setDietaryType(foodItemDto.getDietaryType());
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
        existingItem.setCategory(foodItemDto.getCategory());
        existingItem.setDietaryType(foodItemDto.getDietaryType());
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
    
    private FoodItemDto toFoodItemDto(FoodItem item) {
        FoodItemDto dto = new FoodItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setImageUrl(item.getImageUrl());
        dto.setAvailable(item.isAvailable());
        dto.setCategory(item.getCategory());
        dto.setDietaryType(item.getDietaryType());
        return dto;
    }

    private RestaurantDto toRestaurantDto(Restaurant restaurant) {
        RestaurantDto dto = new RestaurantDto();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setAddress(restaurant.getAddress());
        dto.setPhoneNumber(restaurant.getPhoneNumber());
        dto.setBusinessId(restaurant.getBusinessId());
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