package com.grocery.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "delivery_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliverySlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_name", nullable = false)
    private String slotName; // e.g. "Morning Slot", "Evening Slot"

    @Column(name = "start_time", nullable = false)
    private String startTime; // "06:00 AM"

    @Column(name = "end_time", nullable = false)
    private String endTime; // "09:00 AM"

    @Builder.Default
    @Column(name = "maximum_orders")
    private Integer maximumOrders = 50;

    @Builder.Default
    @Column(nullable = false)
    private Boolean available = true;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}
