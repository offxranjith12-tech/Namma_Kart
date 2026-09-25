package com.grocery.service;

import com.grocery.dto.DeliverySlotDTO;
import com.grocery.entity.DeliverySlot;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.repository.DeliverySlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliverySlotService {

    private final DeliverySlotRepository deliverySlotRepository;

    public List<DeliverySlotDTO> getAllActiveSlots() {
        return deliverySlotRepository.findAllByActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DeliverySlotDTO> getAllSlotsAdmin() {
        return deliverySlotRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeliverySlotDTO createSlot(DeliverySlotDTO dto) {
        DeliverySlot slot = DeliverySlot.builder()
                .slotName(dto.getSlotName())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .maximumOrders(dto.getMaximumOrders() != null ? dto.getMaximumOrders() : 50)
                .available(dto.getAvailable() != null ? dto.getAvailable() : true)
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
        return mapToDTO(deliverySlotRepository.save(slot));
    }

    @Transactional
    public DeliverySlotDTO updateSlot(Long id, DeliverySlotDTO dto) {
        DeliverySlot slot = deliverySlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery slot not found with id: " + id));

        slot.setSlotName(dto.getSlotName());
        slot.setStartTime(dto.getStartTime());
        slot.setEndTime(dto.getEndTime());
        if (dto.getMaximumOrders() != null) slot.setMaximumOrders(dto.getMaximumOrders());
        if (dto.getAvailable() != null) slot.setAvailable(dto.getAvailable());
        if (dto.getActive() != null) slot.setActive(dto.getActive());

        return mapToDTO(deliverySlotRepository.save(slot));
    }

    @Transactional
    public void deleteSlot(Long id) {
        DeliverySlot slot = deliverySlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery slot not found with id: " + id));
        slot.setActive(false);
        deliverySlotRepository.save(slot);
    }

    public DeliverySlotDTO mapToDTO(DeliverySlot slot) {
        return DeliverySlotDTO.builder()
                .id(slot.getId())
                .slotName(slot.getSlotName())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .maximumOrders(slot.getMaximumOrders())
                .available(slot.getAvailable())
                .active(slot.getActive())
                .build();
    }
}
