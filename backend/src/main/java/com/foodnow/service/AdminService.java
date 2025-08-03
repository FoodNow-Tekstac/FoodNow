package com.foodnow.service;

import com.foodnow.dto.*;
import com.foodnow.model.*;
import com.foodnow.repository.OrderRepository;
import com.foodnow.repository.RestaurantRepository;
import com.foodnow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import this

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private OrderRepository orderRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserDto)
                .collect(Collectors.toList());
    }

    public List<RestaurantDto> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::toRestaurantDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true) // THIS IS THE FIX
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toOrderDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getDeliveryAgents() {
        return userRepository.findByRole(Role.DELIVERY_PERSONNEL).stream()
                .map(this::toUserDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true) // Also good practice to add this here
    public AnalyticsDto getAnalytics() {
        AnalyticsDto dto = new AnalyticsDto();
        dto.setTotalUsers(userRepository.count());
        dto.setTotalRestaurants(restaurantRepository.count());
        
        List<Order> allOrders = orderRepository.findAll();
        dto.setTotalOrders(allOrders.size());
        dto.setPendingOrders(allOrders.stream().filter(o -> o.getStatus() == OrderStatus.PENDING || o.getStatus() == OrderStatus.CONFIRMED).count());
        dto.setDeliveredOrders(allOrders.stream().filter(o -> o.getStatus() == OrderStatus.DELIVERED).count());
        
        List<Map<String, Object>> ordersPerRestaurant = allOrders.stream()
                .filter(o -> o.getRestaurant() != null)
                .collect(Collectors.groupingBy(o -> o.getRestaurant().getName(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("restaurantName", entry.getKey());
                    map.put("orderCount", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
        dto.setOrdersPerRestaurant(ordersPerRestaurant);

        return dto;
    }

    // --- DTO Conversion Helpers ---

    private UserDto toUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole());
        return dto;
    }

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
        
        if (restaurant.getOwner() != null) {
            dto.setOwnerName(restaurant.getOwner().getName());
        } else {
            dto.setOwnerName("N/A");
        }

        if (restaurant.getMenu() != null) {
            dto.setMenu(restaurant.getMenu().stream().map(this::toFoodItemDto).collect(Collectors.toList()));
        }
        return dto;
    }

    private OrderItemDto toOrderItemDto(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setItemName(item.getFoodItem() != null ? item.getFoodItem().getName() : "N/A");
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        return dto;
    }

    private OrderDto toOrderDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setRestaurantName(order.getRestaurant() != null ? order.getRestaurant().getName() : "N/A");
        
        if (order.getCustomer() != null) {
            dto.setCustomerName(order.getCustomer().getName());
        } else {
            dto.setCustomerName("N/A");
        }

        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setOrderTime(order.getOrderTime());
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(this::toOrderItemDto).collect(Collectors.toList()));
        }
        if (order.getReview() != null) {
            dto.setReviewRating(order.getReview().getRating());
            dto.setReviewComment(order.getReview().getComment());
        }
        return dto;
    }
}
