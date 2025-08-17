package com.foodnow.service;

import com.foodnow.dto.OrderDto;
import com.foodnow.dto.OrderItemDto;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.*;
import com.foodnow.repository.OrderRepository;
import com.foodnow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderManagementService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TaskScheduler taskScheduler;
    @Autowired private PaymentService paymentService;

    // The method now uses the correct, more robust query from the repository.
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
            paymentService.initiateRefund(orderId);
        }

        order.setStatus(newStatus);
        
        // ... (auto-assignment and auto-delivery logic remains the same)
        
        Order savedOrder = orderRepository.save(order);
        return toOrderDto(savedOrder); // Return the DTO from within the transaction
    }
    
    // --- DTO Helper Methods (moved here from controller) ---
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

