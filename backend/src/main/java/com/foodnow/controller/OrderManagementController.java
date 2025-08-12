package com.foodnow.controller;

import com.foodnow.dto.OrderDto;
import com.foodnow.dto.UpdateOrderStatusRequest;
import com.foodnow.model.Order;
import com.foodnow.model.Restaurant;
import com.foodnow.security.UserDetailsImpl;
import com.foodnow.service.OrderManagementService;
import com.foodnow.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manage/orders")
public class OrderManagementController {

    @Autowired private OrderManagementService orderManagementService;
    @Autowired private RestaurantService restaurantService;

    @GetMapping("/restaurant")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<List<Order>> getRestaurantOrders(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Restaurant currentRestaurant = restaurantService.getRestaurantByOwnerId(userDetails.getId());
        return ResponseEntity.ok(orderManagementService.getOrdersForRestaurant(currentRestaurant.getId()));
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN', 'DELIVERY_PERSONNEL', 'CUSTOMER')")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable int orderId, @RequestBody UpdateOrderStatusRequest request) {
            System.out.println(">>> Entered updateOrderStatus for order " + orderId);

        // The service now returns the DTO directly.
        OrderDto updatedOrderDto = orderManagementService.updateOrderStatus(orderId, request.getStatus());
        return ResponseEntity.ok(updatedOrderDto);
    }

    @GetMapping("/delivery")
    @PreAuthorize("hasRole('DELIVERY_PERSONNEL')")
    public ResponseEntity<List<Order>> getMyDeliveries(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(orderManagementService.getOrdersForDeliveryPersonnel(userDetails.getId()));
    }
    
    // DTO helper methods are no longer needed here.
}
