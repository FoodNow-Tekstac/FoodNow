package com.foodnow.controller;

import com.foodnow.dto.OrderDto;
import com.foodnow.dto.OrderItemDto;
import com.foodnow.dto.UpdateOrderStatusRequest;
import com.foodnow.model.Order;
import com.foodnow.model.OrderItem;
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
    public ResponseEntity<List<OrderDto>> getRestaurantOrders(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Restaurant currentRestaurant = restaurantService.getRestaurantByOwnerId(userDetails.getId());
        List<Order> orders = orderManagementService.getOrdersForRestaurant(currentRestaurant.getId());
        return ResponseEntity.ok(orders.stream().map(this::toOrderDto).collect(Collectors.toList()));
    }

    /**
     * THIS IS THE FIX:
     * Added 'DELIVERY_PERSONNEL' to the list of roles that can access this endpoint.
     */
    @PatchMapping("/{orderId}/status")
@PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN', 'DELIVERY_PERSONNEL', 'CUSTOMER')")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable int orderId, @RequestBody UpdateOrderStatusRequest request) {
        Order updatedOrder = orderManagementService.updateOrderStatus(orderId, request.getStatus());
        return ResponseEntity.ok(toOrderDto(updatedOrder));
    }

    @GetMapping("/delivery")
    @PreAuthorize("hasRole('DELIVERY_PERSONNEL')")
    public ResponseEntity<List<OrderDto>> getMyDeliveries(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Order> orders = orderManagementService.getOrdersForDeliveryPersonnel(userDetails.getId());
        return ResponseEntity.ok(orders.stream().map(this::toOrderDto).collect(Collectors.toList()));
    }
    
    private OrderDto toOrderDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setRestaurantName(order.getRestaurant().getName());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setOrderTime(order.getOrderTime());
        dto.setItems(order.getItems().stream().map(this::toOrderItemDto).collect(Collectors.toList()));
        return dto;
    }

    private OrderItemDto toOrderItemDto(OrderItem orderItem) {
        OrderItemDto dto = new OrderItemDto();
        dto.setItemName(orderItem.getFoodItem().getName()); 
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        return dto;
    }
}
