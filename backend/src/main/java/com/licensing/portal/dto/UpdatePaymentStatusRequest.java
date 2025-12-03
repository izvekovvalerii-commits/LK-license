package com.licensing.portal.dto;

import com.licensing.portal.model.Payment;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class UpdatePaymentStatusRequest {

    @NotNull(message = "Status is required")
    private Payment.PaymentStatus status;

    public Payment.PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(Payment.PaymentStatus status) {
        this.status = status;
    }
}
