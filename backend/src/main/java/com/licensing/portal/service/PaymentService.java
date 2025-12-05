package com.licensing.portal.service;

import com.licensing.portal.dto.PaymentRequest;
import com.licensing.portal.dto.PaymentResponse;
import com.licensing.portal.model.Payment;
import java.util.List;

public interface PaymentService {
    PaymentResponse createPayment(PaymentRequest paymentRequest);

    List<PaymentResponse> getAllPayments();

    PaymentResponse getPaymentById(Long id);

    PaymentResponse updatePaymentStatus(Long id, Payment.PaymentStatus status);
}
