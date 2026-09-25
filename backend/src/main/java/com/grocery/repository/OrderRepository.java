package com.grocery.repository;

import com.grocery.entity.DeliveryPerson;
import com.grocery.entity.Order;
import com.grocery.entity.OrderStatus;
import com.grocery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    
    List<Order> findByDeliveryPersonOrderByCreatedAtDesc(DeliveryPerson deliveryPerson);
    
    List<Order> findByDeliveryPersonAndStatusOrderByCreatedAtDesc(DeliveryPerson deliveryPerson, OrderStatus status);

    Optional<Order> findByIdAndDeliveryPerson(Long id, DeliveryPerson deliveryPerson);

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    long countByStatus(OrderStatus status);

    long countByDeliveryPersonAndStatus(DeliveryPerson deliveryPerson, OrderStatus status);

    long countByDeliveryPerson(DeliveryPerson deliveryPerson);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED' AND o.createdAt >= :startOfDay")
    BigDecimal sumTodayRevenue(@Param("startOfDay") LocalDateTime startOfDay);
}
