package com.foodnow.repository;

import com.foodnow.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomerId(int customerId);
        @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.restaurant.id = :restaurantId")
    List<Order> findByRestaurantIdWithItems(@Param("restaurantId") int restaurantId);
    // Added queries for Module 5
    List<Order> findByRestaurantId(int restaurantId);
    List<Order> findByDeliveryPersonnelId(int deliveryPersonnelId);


}