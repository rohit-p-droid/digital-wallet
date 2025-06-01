package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "wallet_id", nullable = false)
    @JsonIgnore  // ✅ Prevent recursion
    private Wallet wallet;

    private String type; // "credit" or "debit"
    private BigDecimal amount;
    private LocalDateTime timestamp;
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipientId; // ✅ Used for peer-to-peer transactions

    public Transaction() {}

    public Transaction(Wallet wallet, String type, BigDecimal amount, User recipientId, String transactionId) {
        this.wallet = wallet;
        this.type = type;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
        this.transactionId = transactionId;
        this.recipientId = recipientId;
    }

    public Transaction(Wallet wallet, String type, BigDecimal amount, String transactionId) {
        this.wallet = wallet;
        this.type = type;
        this.amount = amount;
        this.transactionId = transactionId;
        this.timestamp = LocalDateTime.now();
    }

    public String getTransactionId() {
        return transactionId;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public String getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public User getRecipientId() {
        return recipientId;
    }
}
