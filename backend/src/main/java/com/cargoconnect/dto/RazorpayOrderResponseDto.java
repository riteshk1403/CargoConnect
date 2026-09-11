package com.cargoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderResponseDto {
    private Long settlementId;
    private String orderId;
    private Long amountInPaise;
    private Double amountInRupees;
    private String currency;
    private String keyId;
    private String shipmentNumber;
    private String partnerCompanyName;
    private String partnerEmail;
    private String partnerPhone;
    private Boolean isLiveRazorpayOrder;
}
