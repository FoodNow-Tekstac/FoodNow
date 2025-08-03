package com.foodnow.service;

import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.DeliveryAgentStatus;
import com.foodnow.model.Order;
import com.foodnow.model.OrderStatus;
import com.foodnow.model.Role;
import com.foodnow.model.User;
import com.foodnow.repository.OrderRepository;
import com.foodnow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class OrderManagementService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TaskScheduler taskScheduler;

    // This method was needed by another controller
    public List<Order> getOrdersForRestaurant(int restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public List<Order> getOrdersForDeliveryPersonnel(int deliveryPersonnelId) {
        return orderRepository.findByDeliveryPersonnelId(deliveryPersonnelId);
    }

 @Transactional
public Order updateOrderStatus(int orderId, OrderStatus newStatus) {
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

    // Auto-assign delivery personnel if going out for delivery
    if (newStatus == OrderStatus.OUT_FOR_DELIVERY && order.getDeliveryPersonnel() == null) {
        List<User> availableAgents = userRepository.findByRoleAndDeliveryStatus(Role.DELIVERY_PERSONNEL, DeliveryAgentStatus.ONLINE);

        if (availableAgents.isEmpty()) {
            throw new IllegalStateException("No delivery personnel available");
        }

        User assignedAgent = availableAgents.get(0); // Pick the first one (you could randomize or balance later)
        assignedAgent.setDeliveryStatus(DeliveryAgentStatus.OFFLINE); // Mark them busy
        userRepository.save(assignedAgent);

        order.setDeliveryPersonnel(assignedAgent);
    }

    order.setStatus(newStatus);

    // Reset delivery person back to ONLINE after 10 seconds if delivered
    if (newStatus == OrderStatus.DELIVERED && order.getDeliveryPersonnel() != null) {
        User agent = order.getDeliveryPersonnel();

        agent.setDeliveryStatus(DeliveryAgentStatus.OFFLINE);
        userRepository.save(agent);

        taskScheduler.schedule(() -> {
            User agentToUpdate = userRepository.findById(agent.getId()).orElse(null);
            if (agentToUpdate != null) {
                agentToUpdate.setDeliveryStatus(DeliveryAgentStatus.ONLINE);
                userRepository.save(agentToUpdate);
                System.out.println("Agent " + agentToUpdate.getName() + " is now back ONLINE.");
            }
        }, Instant.now().plusSeconds(10));
    }

    return orderRepository.save(order);
}

}
