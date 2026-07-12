package com.dealershipinventory.backend.vehicle;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.dealershipinventory.backend.auth.JwtService;
import com.dealershipinventory.backend.config.SecurityConfig;
import com.dealershipinventory.backend.config.UserDetailsServiceImpl;
import com.dealershipinventory.backend.exception.InsufficientStockException;
import com.dealershipinventory.backend.vehicle.dto.VehicleRequest;
import com.dealershipinventory.backend.vehicle.dto.VehicleResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(VehicleController.class)
@Import(SecurityConfig.class)
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private VehicleService vehicleService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    private final UUID vehicleId = UUID.randomUUID();
    private final VehicleResponse vehicleResponse = new VehicleResponse(
        vehicleId, "Toyota", "Camry", "Sedan",
        new BigDecimal("25000.00"), 10);

    @Test
    @WithMockUser
    void createVehicle_ShouldReturn201() throws Exception {
        VehicleRequest request = new VehicleRequest("Toyota", "Camry", "Sedan",
            new BigDecimal("25000.00"), 10);
        when(vehicleService.createVehicle(any(VehicleRequest.class)))
            .thenReturn(vehicleResponse);

        mockMvc.perform(post("/api/vehicles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.make").value("Toyota"));
    }

    @Test
    void createVehicle_Unauthenticated_ShouldReturn403() throws Exception {
        VehicleRequest request = new VehicleRequest("Toyota", "Camry", "Sedan",
            new BigDecimal("25000.00"), 10);

        mockMvc.perform(post("/api/vehicles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    void getAllVehicles_ShouldReturn200() throws Exception {
        when(vehicleService.getAllVehicles()).thenReturn(List.of(vehicleResponse));

        mockMvc.perform(get("/api/vehicles"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].make").value("Toyota"));
    }

    @Test
    @WithMockUser
    void searchVehicles_ShouldReturnFilteredResults() throws Exception {
        when(vehicleService.searchVehicles("Toyota", null, null, null, null))
            .thenReturn(List.of(vehicleResponse));

        mockMvc.perform(get("/api/vehicles/search")
                .param("make", "Toyota"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].make").value("Toyota"));
    }

    @Test
    @WithMockUser
    void updateVehicle_ShouldReturn200() throws Exception {
        VehicleRequest request = new VehicleRequest("Honda", "Accord", "Sedan",
            new BigDecimal("30000.00"), 5);
        VehicleResponse updated = new VehicleResponse(
            vehicleId, "Honda", "Accord", "Sedan",
            new BigDecimal("30000.00"), 5);
        when(vehicleService.updateVehicle(any(UUID.class), any(VehicleRequest.class)))
            .thenReturn(updated);

        mockMvc.perform(put("/api/vehicles/" + vehicleId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.make").value("Honda"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteVehicle_AsAdmin_ShouldReturn204() throws Exception {
        mockMvc.perform(delete("/api/vehicles/" + vehicleId))
            .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "USER")
    void deleteVehicle_AsUser_ShouldReturn403() throws Exception {
        mockMvc.perform(delete("/api/vehicles/" + vehicleId))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    void purchase_WithStock_ShouldReturn200() throws Exception {
        when(vehicleService.purchaseVehicle(vehicleId)).thenReturn(vehicleResponse);

        mockMvc.perform(post("/api/vehicles/" + vehicleId + "/purchase"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.quantity").value(10));
    }

    @Test
    @WithMockUser
    void purchase_WithoutStock_ShouldReturn409() throws Exception {
        when(vehicleService.purchaseVehicle(vehicleId))
            .thenThrow(new InsufficientStockException(vehicleId.toString(), 1, 0));

        mockMvc.perform(post("/api/vehicles/" + vehicleId + "/purchase"))
            .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void restock_AsAdmin_ShouldReturn200() throws Exception {
        VehicleResponse restocked = new VehicleResponse(
            vehicleId, "Toyota", "Camry", "Sedan",
            new BigDecimal("25000.00"), 11);
        when(vehicleService.restockVehicle(vehicleId)).thenReturn(restocked);

        mockMvc.perform(post("/api/vehicles/" + vehicleId + "/restock"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.quantity").value(11));
    }

    @Test
    @WithMockUser(roles = "USER")
    void restock_AsUser_ShouldReturn403() throws Exception {
        mockMvc.perform(post("/api/vehicles/" + vehicleId + "/restock"))
            .andExpect(status().isForbidden());
    }
}
