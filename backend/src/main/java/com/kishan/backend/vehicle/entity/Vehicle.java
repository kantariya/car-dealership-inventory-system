package com.kishan.backend.vehicle.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * JPA entity representing a vehicle in the inventory.
 */
@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, precision = 38, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;
}
