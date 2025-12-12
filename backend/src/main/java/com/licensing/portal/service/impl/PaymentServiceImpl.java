package com.licensing.portal.service.impl;

import com.licensing.portal.dto.PaymentRequest;
import com.licensing.portal.dto.PaymentResponse;
import com.licensing.portal.model.Payment;
import com.licensing.portal.model.Store;
import com.licensing.portal.repository.PaymentRepository;
import com.licensing.portal.repository.StoreRepository;
import com.licensing.portal.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final StoreRepository storeRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository, StoreRepository storeRepository) {
        this.paymentRepository = paymentRepository;
        this.storeRepository = storeRepository;
    }

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Payment payment = new Payment();
        payment.setTaskId(request.getTaskId());
        payment.setAmount(request.getAmount());
        payment.setType(request.getType());
        payment.setRegion(request.getRegion());
        payment.setRetailNetwork(request.getRetailNetwork());
        payment.setLegalEntity(request.getLegalEntity());
        payment.setPaymentRecipient(request.getPaymentRecipient());
        payment.setOktmo(request.getOktmo());
        payment.setBankMarkRequired(request.getBankMarkRequired());
        payment.setNotes(request.getNotes());
        payment.setStatus(Payment.PaymentStatus.PENDING);

        if (request.getStoreIds() != null && !request.getStoreIds().isEmpty()) {
            List<Store> stores = storeRepository.findAllById(request.getStoreIds());
            payment.setStores(stores);
        }

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    @Override
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return mapToResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse updatePaymentStatus(Long id, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        payment.setStatus(status);
        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setTaskId(payment.getTaskId());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());
        response.setCreatedAt(payment.getCreatedAt());
        response.setPaymentDate(payment.getPaymentDate());
        response.setPaymentReference(payment.getPaymentReference());
        response.setNotes(payment.getNotes());
        response.setType(payment.getType());

        response.setRegion(payment.getRegion());
        response.setRetailNetwork(payment.getRetailNetwork());
        response.setLegalEntity(payment.getLegalEntity());
        response.setPaymentRecipient(payment.getPaymentRecipient());
        response.setOktmo(payment.getOktmo());
        response.setBankMarkRequired(payment.getBankMarkRequired());

        if (payment.getStores() != null) {
            response.setStoreIds(payment.getStores().stream()
                    .map(Store::getId)
                    .collect(Collectors.toList()));
        }

        return response;
    }
}
