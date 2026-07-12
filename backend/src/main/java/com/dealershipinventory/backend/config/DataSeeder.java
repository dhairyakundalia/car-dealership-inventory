package com.dealershipinventory.backend.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.dealershipinventory.backend.auth.Role;
import com.dealershipinventory.backend.auth.User;
import com.dealershipinventory.backend.auth.UserRepository;
import com.dealershipinventory.backend.vehicle.Vehicle;
import com.dealershipinventory.backend.vehicle.VehicleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            User admin = User.builder()
                .email("admin@example.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ROLE_ADMIN)
                .build();
            userRepository.save(admin);
            log.info("Admin user seeded: admin@example.com");
        }

        if (vehicleRepository.count() == 0) {
            List<Vehicle> vehicles = List.of(
                Vehicle.builder().make("Toyota").model("Camry").category("Sedan")
                    .price(new BigDecimal("25000.00")).quantity(10).build(),
                Vehicle.builder().make("Honda").model("Accord").category("Sedan")
                    .price(new BigDecimal("28000.00")).quantity(8).build(),
                Vehicle.builder().make("Ford").model("Mustang").category("Coupe")
                    .price(new BigDecimal("45000.00")).quantity(5).build(),
                Vehicle.builder().make("Tesla").model("Model 3").category("Sedan")
                    .price(new BigDecimal("55000.00")).quantity(3).build(),
                Vehicle.builder().make("Chevrolet").model("Tahoe").category("SUV")
                    .price(new BigDecimal("60000.00")).quantity(4).build()
            );
            vehicleRepository.saveAll(vehicles);
            log.info("Sample vehicles seeded: {} vehicles", vehicles.size());
        }
    }
}
