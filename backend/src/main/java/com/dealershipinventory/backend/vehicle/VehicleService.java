package com.dealershipinventory.backend.vehicle;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.dealershipinventory.backend.exception.ResourceNotFoundException;
import com.dealershipinventory.backend.vehicle.dto.VehicleRequest;
import com.dealershipinventory.backend.vehicle.dto.VehicleResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleResponse createVehicle(VehicleRequest request) {
        Vehicle vehicle = Vehicle.builder()
            .make(request.make())
            .model(request.model())
            .category(request.category())
            .price(request.price())
            .quantity(request.quantity())
            .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        log.info("Vehicle created: id={}, make={}, model={}", saved.getId(), saved.getMake(), saved.getModel());
        return toResponse(saved);
    }

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    public VehicleResponse getVehicleById(UUID id) {
        Vehicle vehicle = findOrThrow(id);
        return toResponse(vehicle);
    }

    public List<VehicleResponse> searchVehicles(String make, String model, String category,
            BigDecimal minPrice, BigDecimal maxPrice) {
        Specification<Vehicle> spec = Specification
            .where(VehicleSpecification.hasMake(make))
            .and(VehicleSpecification.hasModel(model))
            .and(VehicleSpecification.hasCategory(category))
            .and(VehicleSpecification.priceBetween(minPrice, maxPrice));

        log.debug("Searching vehicles with spec: make={}, model={}, category={}, minPrice={}, maxPrice={}",
            make, model, category, minPrice, maxPrice);

        return vehicleRepository.findAll(spec).stream()
            .map(this::toResponse)
            .toList();
    }

    public VehicleResponse updateVehicle(UUID id, VehicleRequest request) {
        Vehicle vehicle = findOrThrow(id);
        vehicle.setMake(request.make());
        vehicle.setModel(request.model());
        vehicle.setCategory(request.category());
        vehicle.setPrice(request.price());
        vehicle.setQuantity(request.quantity());

        Vehicle saved = vehicleRepository.save(vehicle);
        log.info("Vehicle updated: id={}, make={}, model={}", saved.getId(), saved.getMake(), saved.getModel());
        return toResponse(saved);
    }

    public void deleteVehicle(UUID id) {
        Vehicle vehicle = findOrThrow(id);
        vehicleRepository.delete(vehicle);
        log.info("Vehicle deleted: id={}, make={}, model={}", id, vehicle.getMake(), vehicle.getModel());
    }

    private Vehicle findOrThrow(UUID id) {
        return vehicleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Vehicle", id.toString()));
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
            vehicle.getId(),
            vehicle.getMake(),
            vehicle.getModel(),
            vehicle.getCategory(),
            vehicle.getPrice(),
            vehicle.getQuantity()
        );
    }
}
