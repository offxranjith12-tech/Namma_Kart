package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.GroceryListDTO;
import com.grocery.dto.GroceryListItemRequestDTO;
import com.grocery.dto.GroceryListRequestDTO;
import com.grocery.security.UserPrincipal;
import com.grocery.service.GroceryListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grocery-lists")
@RequiredArgsConstructor
public class GroceryListController {

    private final GroceryListService groceryListService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GroceryListDTO>>> getUserLists(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<GroceryListDTO> lists = groceryListService.getUserLists(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(lists));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GroceryListDTO>> createList(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody GroceryListRequestDTO request) {
        GroceryListDTO list = groceryListService.createList(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("List created successfully", list));
    }

    @PostMapping("/{listId}/items")
    public ResponseEntity<ApiResponse<GroceryListDTO>> addOrUpdateItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long listId,
            @Valid @RequestBody GroceryListItemRequestDTO request) {
        GroceryListDTO list = groceryListService.addOrUpdateItem(principal.getId(), listId, request);
        return ResponseEntity.ok(ApiResponse.success("Item added/updated successfully", list));
    }

    @DeleteMapping("/{listId}/items/{productId}")
    public ResponseEntity<ApiResponse<GroceryListDTO>> removeItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long listId,
            @PathVariable Long productId) {
        GroceryListDTO list = groceryListService.removeItem(principal.getId(), listId, productId);
        return ResponseEntity.ok(ApiResponse.success("Item removed successfully", list));
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<ApiResponse<Void>> deleteList(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long listId) {
        groceryListService.deleteList(principal.getId(), listId);
        return ResponseEntity.ok(ApiResponse.success("List deleted successfully", null));
    }
}
