package com.cargoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportSettingResponseDto {
    private String primaryPhone;
    private String secondaryPhone;
    private String supportEmail;
    private Boolean primaryActive;
    private Boolean secondaryActive;
    private Boolean isActive;
    private LocalDateTime updatedAt;
}
