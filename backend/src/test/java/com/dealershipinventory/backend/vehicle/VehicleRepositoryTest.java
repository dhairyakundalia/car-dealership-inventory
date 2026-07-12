package com.dealershipinventory.backend.vehicle;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

@DataJpaTest
class VehicleRepositoryTest {

    @Autowired
    private VehicleRepository vehicleRepository;

    private Vehicle vehicle1;
    private Vehicle vehicle2;

    @BeforeEach
    void setUp() {
        vehicle1 = Vehicle.builder()
            .make("Toyota")
            .model("Camry")
            .category("Sedan")
            .price(new BigDecimal("25000.00"))
            .quantity(10)
            .build();

        vehicle2 = Vehicle.builder()
            .make("Ford")
            .model("Mustang")
            .category("Coupe")
            .price(new BigDecimal("45000.00"))
            .quantity(5)
            .build();
    }

    @Test
    void saveVehicle_ShouldPersistWithGeneratedId() {
        Vehicle saved = vehicleRepository.save(vehicle1);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getMake()).isEqualTo("Toyota");
        assertThat(saved.getModel()).isEqualTo("Camry");
        assertThat(saved.getCategory()).isEqualTo("Sedan");
        assertThat(saved.getPrice()).isEqualByComparingTo(new BigDecimal("25000.00"));
        assertThat(saved.getQuantity()).isEqualTo(10);
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
    }

    @Test
    void findAll_ShouldReturnAllVehicles() {
        vehicleRepository.save(vehicle1);
        vehicleRepository.save(vehicle2);

        List<Vehicle> vehicles = vehicleRepository.findAll();

        assertThat(vehicles).hasSize(2);
    }

    @Test
    void searchWithSpecification_ByMake_ShouldFilter() {
        vehicleRepository.save(vehicle1);
        vehicleRepository.save(vehicle2);

        var spec = VehicleSpecification.hasMake("Toyota");
        List<Vehicle> result = vehicleRepository.findAll(spec);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getMake()).isEqualTo("Toyota");
    }

    @Test
    void searchWithSpecification_ByPriceRange_ShouldFilter() {
        vehicleRepository.save(vehicle1);
        vehicleRepository.save(vehicle2);

        var spec = VehicleSpecification.priceBetween(
            new BigDecimal("20000.00"), new BigDecimal("30000.00"));
        List<Vehicle> result = vehicleRepository.findAll(spec);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getMake()).isEqualTo("Toyota");
    }
}
