package com.foodnow.repository;

import com.foodnow.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // --- THIS IS THE CORRECTED QUERY FOR THE RESTAURANT DASHBOARD ---
    // It now fetches BOTH the items AND the customer associated with each order.
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items LEFT JOIN FETCH o.customer WHERE o.restaurant.id = :restaurantId")
    List<Order> findByRestaurantIdWithItems(@Param("restaurantId") int restaurantId);

    // This query is for the CUSTOMER'S "My Orders" page. It is correct.
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.customer.id = :customerId")
    List<Order> findByCustomerIdWithItems(@Param("customerId") int customerId);

    // This query is for the "Track Order" page. It is correct.
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :orderId")
    Optional<Order> findByIdWithItems(@Param("orderId") int orderId);
    
    // --- Other methods ---
    List<Order> findByCustomerId(int customerId);
    List<Order> findByRestaurantId(int restaurantId);
    List<Order> findByDeliveryPersonnelId(int deliveryPersonnelId);
}