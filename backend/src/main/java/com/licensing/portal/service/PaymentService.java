package com.licensing.portal.service;

import com.licensing.portal.dto.PaymentRequest;
import com.licensing.portal.dto.PaymentResponse;
import com.licensing.portal.model.Payment;
import com.licensing.portal.model.Task;
import com.licensing.portal.repository.PaymentRepository;
import com.licensing.portal.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final TaskRepository taskRepository;

    public PaymentService(PaymentRepository paymentRepository, TaskRepository taskRepository) {
        this.paymentRepository = paymentRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + request.getTaskId()));

        Payment payment = new Payment();
        payment.setTask(task);
        payment.setAmount(request.getAmount());
        payment.setNotes(request.getNotes());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        if (request.getType() != null) {
            payment.setType(request.getType());
        }

        Payment saved = paymentRepository.save(payment);

        return mapToResponse(saved);
    }

    @Transactional
    public PaymentResponse updatePaymentStatus(Long id, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        payment.setStatus(status);

        // Set payment date when status changes to COMPLETED
        if (status == Payment.PaymentStatus.COMPLETED && payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDateTime.now());
        }

        Payment updated = paymentRepository.save(payment);

        return mapToResponse(updated);
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getPaymentsByTaskId(Long taskId) {
        return paymentRepository.findByTaskId(taskId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setTaskId(payment.getTask().getId());
        response.setTaskTitle(payment.getTask().getTitle());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());
        response.setType(payment.getType());
        response.setCreatedAt(payment.getCreatedAt());
        response.setPaymentDate(payment.getPaymentDate());
        response.setPaymentReference(payment.getPaymentReference());
        response.setNotes(payment.getNotes());
        return response;
    }
}
