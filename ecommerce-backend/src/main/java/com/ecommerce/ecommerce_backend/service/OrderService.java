package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.config.JwtService;
import com.ecommerce.ecommerce_backend.dto.PaymentItem;
import com.ecommerce.ecommerce_backend.entity.Order;
import com.ecommerce.ecommerce_backend.entity.Product;
import com.ecommerce.ecommerce_backend.entity.User;
import com.ecommerce.ecommerce_backend.repository.OrderRepository;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public Order createPendingOrder(List<PaymentItem> items, BigDecimal totalAmount, 
                                    String razorpayOrderId, String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (items == null || items.isEmpty()) {
            throw new RuntimeException("No items in order");
        }

        // Create orders for all items in the cart
        Order firstOrder = null;
        for (PaymentItem item : items) {
            Product product = productRepository.findById(item.getProductId().longValue())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));

            BigDecimal itemTotalPrice = product.getPrice().multiply(
                    new BigDecimal(item.getQuantity())
            );

            Order order = Order.builder()
                    .user(user)
                    .product(product)
                    .quantity(item.getQuantity())
                    .totalPrice(itemTotalPrice)
                    .razorpayOrderId(razorpayOrderId)
                    .paymentStatus("PENDING")
                    .build();

            order.setSeller(product.getSeller());

            Order savedOrder = orderRepository.save(order);
            
            // Return the first order as the main order
            if (firstOrder == null) {
                firstOrder = savedOrder;
            }
        }

        return firstOrder;
    }

    public boolean verifyAndUpdateOrder(Long internalOrderId, String razorpayOrderId, 
                                       String razorpayPaymentId, String razorpaySignature) {
        Order order = orderRepository.findById(internalOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getRazorpayOrderId().equals(razorpayOrderId)) {
            return false;
        }

        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setRazorpaySignature(razorpaySignature);
        order.setPaymentStatus("SUCCESS");

        orderRepository.save(order);
        return true;
    }

    public List<Order> getUserOrders(Integer userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getSellerOrders(Integer sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }
}
