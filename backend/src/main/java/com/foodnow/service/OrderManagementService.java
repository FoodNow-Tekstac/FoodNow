package com.foodnow.service;

import com.foodnow.dto.OrderDto;
import com.foodnow.dto.OrderItemDto;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.*;
import com.foodnow.repository.OrderRepository;
import com.foodnow.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderManagementService {
private static final Logger log = LoggerFactory.getLogger(OrderManagementService.class);
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TaskScheduler taskScheduler;
    @Autowired private PaymentService paymentService;

    public List<Order> getOrdersForRestaurant(int restaurantId) {
        return orderRepository.findByRestaurantIdWithItems(restaurantId);
    }

    public List<Order> getOrdersForDeliveryPersonnel(int deliveryPersonnelId) {
        return orderRepository.findByDeliveryPersonnelId(deliveryPersonnelId);
    }

    @Transactional
    public OrderDto updateOrderStatus(int orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

if (newStatus == OrderStatus.CANCELLED && order.getStatus() == OrderStatus.PENDING) {
    try {
        log.info("Attempting to initiate refund for order ID: {}", orderId);
        paymentService.initiateRefund(orderId);
        log.info("Successfully initiated refund for order ID: {}", orderId);
    } catch (Exception e) {
        // This will log the specific error without crashing the server!
        log.error("CRITICAL: Failed to process refund for order ID: {}. Error: {}", orderId, e.getMessage(), e);
      
    }
}

        order.setStatus(newStatus);
                
        Order savedOrder = orderRepository.save(order);
        return toOrderDto(savedOrder); // Return the DTO from within the transaction
    }
    
    private OrderDto toOrderDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setRestaurantName(order.getRestaurant().getName());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setOrderTime(order.getOrderTime());
        if (order.getCustomer() != null) {
            dto.setCustomerName(order.getCustomer().getName());
        }
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(this::toOrderItemDto).collect(Collectors.toList()));
        }
        return dto;
    }

    private OrderItemDto toOrderItemDto(OrderItem orderItem) {
        OrderItemDto dto = new OrderItemDto();
        if (orderItem.getFoodItem() != null) {
            dto.setItemName(orderItem.getFoodItem().getName());
        }
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        return dto;
    }
}

