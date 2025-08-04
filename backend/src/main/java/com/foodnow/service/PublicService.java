package com.foodnow.service;

import com.foodnow.dto.FoodItemDto;
import com.foodnow.dto.RestaurantDto;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.FoodItem;
import com.foodnow.model.Restaurant;
import com.foodnow.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Transactional(readOnly = true)
    public List<RestaurantDto> getAllActiveRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::toRestaurantDtoWithMenu) // Use the detailed helper to send full menu
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RestaurantDto getRestaurantWithMenu(int restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + restaurantId));
        return toRestaurantDtoWithMenu(restaurant);
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
        dto.setCategory(item.getCategory());
        dto.setDietaryType(item.getDietaryType());
        return dto;
    }

    private RestaurantDto toRestaurantDtoWithMenu(Restaurant restaurant) {
        RestaurantDto dto = new RestaurantDto();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setAddress(restaurant.getAddress());
        dto.setPhoneNumber(restaurant.getPhoneNumber());
        dto.setLocationPin(restaurant.getLocationPin());
        dto.setImageUrl(restaurant.getImageUrl());
        
        List<FoodItemDto> menuDto = restaurant.getMenu().stream()
                                              .filter(FoodItem::isAvailable)
                                              .map(this::toFoodItemDto)
                                              .collect(Collectors.toList());
        dto.setMenu(menuDto);
        return dto;
    }
}
