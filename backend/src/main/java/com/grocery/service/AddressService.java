package com.grocery.service;

import com.grocery.dto.AddressDTO;
import com.grocery.entity.Address;
import com.grocery.entity.User;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.repository.AddressRepository;
import com.grocery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressDTO> getUserAddresses(Long userId) {
        User user = getUser(userId);
        return addressRepository.findByUser(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDTO createAddress(Long userId, AddressDTO dto) {
        User user = getUser(userId);

        List<Address> existing = addressRepository.findByUser(user);
        boolean isFirst = existing.isEmpty();
        boolean makeDefault = isFirst || Boolean.TRUE.equals(dto.getIsDefault());

        if (makeDefault) {
            existing.forEach(a -> a.setIsDefault(false));
            addressRepository.saveAll(existing);
        }

        Address address = Address.builder()
                .user(user)
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .isDefault(makeDefault)
                .build();

        return mapToDTO(addressRepository.save(address));
    }

    @Transactional
    public AddressDTO updateAddress(Long userId, Long addressId, AddressDTO dto) {
        User user = getUser(userId);
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (Boolean.TRUE.equals(dto.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            List<Address> existing = addressRepository.findByUser(user);
            existing.forEach(a -> a.setIsDefault(false));
            addressRepository.saveAll(existing);
            address.setIsDefault(true);
        }

        address.setAddressLine(dto.getAddressLine());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPincode(dto.getPincode());

        return mapToDTO(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        User user = getUser(userId);
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        addressRepository.delete(address);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public AddressDTO mapToDTO(Address address) {
        return AddressDTO.builder()
                .id(address.getId())
                .addressLine(address.getAddressLine())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .isDefault(address.getIsDefault())
                .build();
    }
}
