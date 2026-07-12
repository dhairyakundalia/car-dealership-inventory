package com.dealershipinventory.backend.vehicle;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import com.dealershipinventory.backend.exception.ResourceNotFoundException;
import com.dealershipinventory.backend.vehicle.dto.VehicleRequest;
import com.dealershipinventory.backend.vehicle.dto.VehicleResponse;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    private VehicleService vehicleService;

    private Vehicle vehicle;
    private VehicleRequest vehicleRequest;
    private UUID vehicleId;

    @BeforeEach
    void setUp() {
        vehicleService = new VehicleService(vehicleRepository);
        vehicleId = UUID.randomUUID();
        vehicle = Vehicle.builder()
            .id(vehicleId)
            .make("Toyota")
            .model("Camry")
            .category("Sedan")
            .price(new BigDecimal("25000.00"))
            .quantity(10)
            .build();
        vehicleRequest = new VehicleRequest("Toyota", "Camry", "Sedan",
            new BigDecimal("25000.00"), 10);
    }

    @Test
    void createVehicle_ShouldReturnVehicleResponse() {
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        VehicleResponse response = vehicleService.createVehicle(vehicleRequest);

        assertThat(response.make()).isEqualTo("Toyota");
        assertThat(response.model()).isEqualTo("Camry");
        assertThat(response.category()).isEqualTo("Sedan");
        assertThat(response.price()).isEqualByComparingTo(new BigDecimal("25000.00"));
        assertThat(response.quantity()).isEqualTo(10);
    }

    @Test
    void getAllVehicles_ShouldReturnList() {
        when(vehicleRepository.findAll()).thenReturn(List.of(vehicle));

        List<VehicleResponse> responses = vehicleService.getAllVehicles();

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).make()).isEqualTo("Toyota");
    }

    @Test
    void getVehicleById_WhenExists_ShouldReturn() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

        VehicleResponse response = vehicleService.getVehicleById(vehicleId);

        assertThat(response.make()).isEqualTo("Toyota");
    }

    @Test
    void getVehicleById_WhenNotExists_ShouldThrow() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> vehicleService.getVehicleById(vehicleId));
    }

    @Test
    void searchVehicles_WithFilters_ShouldReturnFilteredList() {
        when(vehicleRepository.findAll(any(Specification.class)))
            .thenReturn(List.of(vehicle));

        List<VehicleResponse> responses = vehicleService.searchVehicles(
            "Toyota", null, null, null, null);

        assertThat(responses).hasSize(1);
    }

    @Test
    void updateVehicle_WhenExists_ShouldReturnUpdated() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        VehicleRequest updateRequest = new VehicleRequest("Honda", "Accord", "Sedan",
            new BigDecimal("30000.00"), 5);

        VehicleResponse response = vehicleService.updateVehicle(vehicleId, updateRequest);

        assertThat(response.make()).isEqualTo("Honda");
        assertThat(response.model()).isEqualTo("Accord");
    }

    @Test
    void updateVehicle_WhenNotExists_ShouldThrow() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> vehicleService.updateVehicle(vehicleId, vehicleRequest));
    }

    @Test
    void deleteVehicle_WhenExists_ShouldDelete() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

        vehicleService.deleteVehicle(vehicleId);

        verify(vehicleRepository).delete(vehicle);
    }

    @Test
    void deleteVehicle_WhenNotExists_ShouldThrow() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> vehicleService.deleteVehicle(vehicleId));
    }
}
