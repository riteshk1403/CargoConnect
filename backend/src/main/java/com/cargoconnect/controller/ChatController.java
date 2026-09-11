package com.cargoconnect.controller;

import com.cargoconnect.dto.ChatMessageDto;
import com.cargoconnect.model.ChatMessage;
import com.cargoconnect.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/shipment/{shipmentId}")
    public ResponseEntity<List<ChatMessage>> getShipmentMessages(@PathVariable Long shipmentId) {
        return ResponseEntity.ok(chatService.getShipmentMessages(shipmentId));
    }

    @PostMapping("/shipment/{shipmentId}")
    public ResponseEntity<ChatMessage> sendMessage(
            @PathVariable Long shipmentId,
            @Valid @RequestBody ChatMessageDto dto,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "User";
        String role = authentication != null && !authentication.getAuthorities().isEmpty()
                ? authentication.getAuthorities().iterator().next().getAuthority()
                : "ROLE_CUSTOMER";

        return ResponseEntity.ok(chatService.sendMessage(shipmentId, null, role, username, dto.getMessage()));
    }
}
