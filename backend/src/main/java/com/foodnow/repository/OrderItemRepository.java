package com.foodnow.repository;

import com.foodnow.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    // This repository is mainly used through the Order entity,
    // so it may not need custom query methods initially.
}