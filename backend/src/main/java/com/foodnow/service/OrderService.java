package com.foodnow.service;

import com.foodnow.dto.OrderDto;
import com.foodnow.dto.OrderItemDto;
import com.foodnow.dto.OrderTrackingDto;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.*;
import com.foodnow.repository.CartItemRepository;
import com.foodnow.repository.CartRepository;
import com.foodnow.repository.OrderRepository;
import com.foodnow.repository.UserRepository;
import com.foodnow.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CartService cartService;
    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private TaskExecutor taskExecutor; // used for async

    @Transactional(readOnly = true)
    public OrderTrackingDto getOrderForTracking(int orderId) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getCustomer().getId() != currentUser.getId()) {
            throw new SecurityException("Unauthorized to view this order");
        }

        return toOrderTrackingDto(order);
    }

    @Transactional
    public OrderDto placeOrderFromCart() {
        User currentUser = getCurrentUser();

        Cart cart = cartService.getCartEntityForCurrentUser();
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot place an order with an empty cart.");
        }

        Order order = new Order();
        order.setCustomer(currentUser);
        order.setRestaurant(cart.getItems().get(0).getFoodItem().getRestaurant());
        order.setTotalPrice(cart.getTotalPrice());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderTime(LocalDateTime.now());

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFoodItem(cartItem.getFoodItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getFoodItem().getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);

        return toOrderDto(savedOrder);
    }

    @Transactional
    public OrderDto updateOrderStatus(int orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(newStatus);

if (newStatus == OrderStatus.OUT_FOR_DELIVERY && order.getDeliveryPersonnel() == null) {
List<User> availableAgents = userRepository.findByRoleAndDeliveryStatus(Role.DELIVERY_PERSONNEL, DeliveryAgentStatus.ONLINE);
            if (availableAgents.isEmpty()) {
                throw new IllegalStateException("No delivery agents available.");
            }

            User assignedAgent = availableAgents.get(new Random().nextInt(availableAgents.size()));
            assignedAgent.setDeliveryStatus(DeliveryAgentStatus.OFFLINE);
            userRepository.save(assignedAgent);

order.setDeliveryPersonnel(assignedAgent);
            order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
            orderRepository.save(order);

            taskExecutor.execute(() -> simulateDeliveryAndComplete(order.getId()));
        } else {
            orderRepository.save(order);
        }

        return toOrderDto(order);
    }

    public void simulateDeliveryAndComplete(int orderId) {
        try {
            Thread.sleep(10000);
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found during simulation"));

            order.setStatus(OrderStatus.DELIVERED);
User agent = order.getDeliveryPersonnel();
if (agent != null) {
    agent.setDeliveryStatus(DeliveryAgentStatus.ONLINE);
    userRepository.save(agent);
}

            orderRepository.save(order);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getMyOrders() {
        User currentUser = getCurrentUser();
        List<Order> orders = orderRepository.findByCustomerId(currentUser.getId());
        return orders.stream().map(this::toOrderDto).collect(Collectors.toList());
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private OrderTrackingDto toOrderTrackingDto(Order order) {
        OrderTrackingDto dto = new OrderTrackingDto();
        dto.setId(order.getId());
        dto.setRestaurantName(order.getRestaurant().getName());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setOrderTime(order.getOrderTime());
        dto.setItems(order.getItems().stream().map(this::toOrderItemDto).collect(Collectors.toList()));
        dto.setRestaurantLocationPin(order.getRestaurant().getLocationPin());
        dto.setDeliveryAddress("123 Main St, Your City"); // Dummy
        return dto;
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

    private OrderItemDto toOrderItemDto(OrderItem item) {
        OrderItemDto itemDto = new OrderItemDto();
        itemDto.setItemName(item.getFoodItem().getName());
        itemDto.setQuantity(item.getQuantity());
        itemDto.setPrice(item.getPrice());
        return itemDto;
    }
}