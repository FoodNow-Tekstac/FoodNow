package com.foodnow.service;

import com.foodnow.dto.FoodItemDto;
import com.foodnow.dto.OrderDto;
import com.foodnow.dto.OrderItemDto;
import com.foodnow.dto.RestaurantDashboardDto;
import com.foodnow.dto.RestaurantDto;
import com.foodnow.dto.ReviewDto;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.DeliveryAgentStatus;
import com.foodnow.model.FoodItem;
import com.foodnow.model.Order;
import com.foodnow.model.OrderItem;
import com.foodnow.model.OrderStatus;
import com.foodnow.model.Restaurant;
import com.foodnow.model.Review;
import com.foodnow.model.Role;
import com.foodnow.model.User;
import com.foodnow.repository.FoodItemRepository;
import com.foodnow.repository.OrderRepository;
import com.foodnow.repository.RestaurantRepository;
import com.foodnow.repository.UserRepository;
import com.foodnow.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private FoodItemRepository foodItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private TaskScheduler taskScheduler;

    @Transactional(readOnly = true)
    public RestaurantDashboardDto getDashboardData() {
        Restaurant restaurant = getRestaurantByCurrentOwner();
        RestaurantDashboardDto dashboardDto = new RestaurantDashboardDto();
        dashboardDto.setRestaurantProfile(toRestaurantDto(restaurant));

        // THIS IS THE FIX: Use the single, correct query to fetch orders with their items
        List<Order> orders = orderRepository.findByRestaurantIdWithItems(restaurant.getId());
        dashboardDto.setOrders(orders.stream().map(this::toOrderDto).collect(Collectors.toList()));

        List<FoodItem> menu = restaurant.getMenu();
        dashboardDto.setMenu(menu.stream().map(this::toFoodItemDto).collect(Collectors.toList()));

        List<Review> reviews = restaurant.getReviews();
        dashboardDto.setReviews(reviews.stream().map(this::toReviewDto).collect(Collectors.toList()));
        
        return dashboardDto;
    }

    @Transactional
    public void readyForPickup(int orderId) {
        Restaurant restaurant = getRestaurantByCurrentOwner();
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (order.getRestaurant().getId() != restaurant.getId()) {
            throw new SecurityException("Unauthorized to manage this order.");
        }
        
        List<User> availableAgents = userRepository.findByRoleAndDeliveryStatus(Role.DELIVERY_PERSONNEL, DeliveryAgentStatus.ONLINE);
        if (availableAgents.isEmpty()) {
            throw new IllegalStateException("No delivery agents are currently available to assign.");
        }
        
        User agentToAssign = availableAgents.get(0);
        order.setDeliveryPersonnel(agentToAssign);
        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        
        agentToAssign.setDeliveryStatus(DeliveryAgentStatus.OFFLINE);
        userRepository.save(agentToAssign);
        orderRepository.save(order);

        scheduleAutoDelivery(orderId, agentToAssign.getId());
    }

    private void scheduleAutoDelivery(int orderId, int agentId) {
        taskScheduler.schedule(() -> {
            updateOrderAndAgentStatus(orderId, agentId);
        }, Instant.now().plusSeconds(20));
    }

    @Transactional
    public void updateOrderAndAgentStatus(int orderId, int agentId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        User agent = userRepository.findById(agentId).orElse(null);

        if (order != null && agent != null) {
            order.setStatus(OrderStatus.DELIVERED);
            agent.setDeliveryStatus(DeliveryAgentStatus.ONLINE);
            orderRepository.save(order);
            userRepository.save(agent);
            System.out.println("Order #" + orderId + " automatically marked as DELIVERED.");
            System.out.println("Agent " + agent.getName() + " is now back ONLINE.");
        }
    }
    
    // --- All other existing methods from your file ---
    
    public Restaurant getRestaurantByOwnerId(int ownerId) {
        return restaurantRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found for owner ID: " + ownerId));
    }

    public Restaurant getRestaurantByCurrentOwner() {
        User currentUser = getCurrentUser();
        return getRestaurantByOwnerId(currentUser.getId());
    }

    public List<FoodItem> getMenuByCurrentOwner() {
        Restaurant restaurant = getRestaurantByCurrentOwner();
        return restaurant.getMenu();
    }

    @Transactional
    public FoodItem addFoodItem(FoodItem foodItem) {
        Restaurant restaurant = getRestaurantByCurrentOwner();
        foodItem.setRestaurant(restaurant);
        return foodItemRepository.save(foodItem);
    }

    @Transactional(readOnly = true)
    public FoodItem getFoodItemById(int itemId) {
        return foodItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with ID: " + itemId));
    }

    @Transactional
    public FoodItem updateFoodItem(int itemId, FoodItem updatedItem) {
        FoodItem existingItem = getFoodItemById(itemId);
        if (existingItem.getRestaurant().getId() != getRestaurantByCurrentOwner().getId()) {
            throw new SecurityException("Unauthorized to update this food item");
        }
        existingItem.setName(updatedItem.getName());
        existingItem.setDescription(updatedItem.getDescription());
        existingItem.setPrice(updatedItem.getPrice());
        existingItem.setImageUrl(updatedItem.getImageUrl());
        existingItem.setAvailable(updatedItem.isAvailable());
        existingItem.setCategory(updatedItem.getCategory());
        existingItem.setDietaryType(updatedItem.getDietaryType());
        return foodItemRepository.save(existingItem);
    }

    @Transactional
    public void deleteFoodItem(int itemId) {
        FoodItem item = getFoodItemById(itemId);
        if (item.getRestaurant().getId() != getRestaurantByCurrentOwner().getId()) {
            throw new SecurityException("Unauthorized to delete this food item");
        }
        foodItemRepository.delete(item);
    }

    @Transactional
    public FoodItem toggleFoodItemAvailability(int itemId) {
        FoodItem item = getFoodItemById(itemId);
        if (item.getRestaurant().getId() != getRestaurantByCurrentOwner().getId()) {
            throw new SecurityException("Unauthorized to update this food item");
        }
        item.setAvailable(!item.isAvailable());
        return foodItemRepository.save(item);
    }

    @Transactional
    public Restaurant updateRestaurantProfile(Restaurant updatedRestaurant) {
        Restaurant existingRestaurant = getRestaurantByCurrentOwner();
        existingRestaurant.setName(updatedRestaurant.getName());
        existingRestaurant.setAddress(updatedRestaurant.getAddress());
        existingRestaurant.setPhoneNumber(updatedRestaurant.getPhoneNumber());
        existingRestaurant.setImageUrl(updatedRestaurant.getImageUrl());
        existingRestaurant.setLocationPin(updatedRestaurant.getLocationPin());
        return restaurantRepository.save(existingRestaurant);
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userDetails.getId()));
    }

    // --- DTO Helper Methods ---
    private RestaurantDto toRestaurantDto(Restaurant restaurant) {
        RestaurantDto dto = new RestaurantDto();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setAddress(restaurant.getAddress());
        dto.setPhoneNumber(restaurant.getPhoneNumber());
        dto.setLocationPin(restaurant.getLocationPin());
        dto.setImageUrl(restaurant.getImageUrl());
        if (restaurant.getOwner() != null) {
            dto.setOwnerName(restaurant.getOwner().getName());
        }
        return dto;
    }

    private ReviewDto toReviewDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setReviewDate(review.getReviewDate());
        if (review.getUser() != null) {
            dto.setCustomerName(review.getUser().getName());
        }
        return dto;
    }

    private FoodItemDto toFoodItemDto(FoodItem item) {
        FoodItemDto dto = new FoodItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setAvailable(item.isAvailable());
        dto.setImageUrl(item.getImageUrl());
        dto.setCategory(item.getCategory());
        dto.setDietaryType(item.getDietaryType());
        return dto;
    }

    private OrderItemDto toOrderItemDto(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setItemName(item.getFoodItem() != null ? item.getFoodItem().getName() : "N/A");
        dto.setQuantity(item.getQuantity());
        return dto;
    }

    private OrderDto toOrderDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setCustomerName(order.getCustomer() != null ? order.getCustomer().getName() : "N/A");
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setOrderTime(order.getOrderTime());
        if (order.getReview() != null) {
            dto.setHasReview(true);
            dto.setReviewRating(order.getReview().getRating());
            dto.setReviewComment(order.getReview().getComment());
        } else {
            dto.setHasReview(false);
        }
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(this::toOrderItemDto).collect(Collectors.toList()));
        }
        return dto;
    }
}
