package com.dealershipinventory.backend.vehicle;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

@SuppressWarnings("unused")
public class VehicleSpecification {

    public static Specification<Vehicle> hasMake(String make) {
        return (root, query, cb) ->
            make == null ? null : cb.equal(cb.lower(root.get("make")), make.toLowerCase());
    }

    public static Specification<Vehicle> hasModel(String model) {
        return (root, query, cb) ->
            model == null ? null : cb.equal(cb.lower(root.get("model")), model.toLowerCase());
    }

    public static Specification<Vehicle> hasCategory(String category) {
        return (root, query, cb) ->
            category == null ? null : cb.equal(cb.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<Vehicle> priceBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;
            if (min == null) return cb.lessThanOrEqualTo(root.get("price"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("price"), min);
            return cb.between(root.get("price"), min, max);
        };
    }
}
