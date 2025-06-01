package com.example.backend.service;

import com.example.backend.model.Transaction;
import com.example.backend.model.User;
import com.example.backend.model.Wallet;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WalletRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WalletService {
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public WalletService(WalletRepository walletRepository, TransactionRepository transactionRepository, UserRepository userRepository, JwtUtil jwtUtil, UserService userService) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    // ✅ Get wallet details
    public Wallet getWallet(String token) {
        User user = getUserFromToken(token);
        return walletRepository.findByUser(Optional.ofNullable(user)).orElse(new Wallet(user));
    }

    public List<Transaction> getTransaction(Wallet wallet) {
        if (wallet == null) {
            return Collections.emptyList(); // Returns an immutable empty list
        }
        return transactionRepository.findByWallet(wallet, Sort.by(Sort.Direction.DESC, "timestamp")) ;
    }

    // ✅ Add money to wallet
    @Transactional
    public void addMoney(String token, BigDecimal amount, String transactionId) {
        User user = getUserFromToken(token);
        Wallet wallet = walletRepository.findByUser(Optional.ofNullable(user)).orElse(new Wallet(user));

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        Transaction transaction = new Transaction(wallet, "credit", amount, transactionId);
        transactionRepository.save(transaction);
    }

    // ✅ Withdraw money
    @Transactional
    public boolean withdrawMoney(String token, BigDecimal amount) {
        User user = getUserFromToken(token);
        Wallet wallet = walletRepository.findByUser(Optional.ofNullable(user)).orElse(new Wallet(user));

        if (wallet.getBalance().compareTo(amount) < 0) {
            return false;
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);
        String transactionId = UUID.randomUUID().toString();
        Transaction transaction = new Transaction(wallet, "debit", amount, transactionId);
        transactionRepository.save(transaction);
        return true;
    }

    // ✅ Peer-to-Peer Transfer
    @Transactional
    public boolean transferMoney(String token, String recipientId, BigDecimal amount) {
        User sender = getUserFromToken(token);
        Wallet senderWallet = walletRepository.findByUser(Optional.ofNullable(sender)).orElseThrow(() -> new RuntimeException("Sender wallet not found"));

        User recipient = getUserByStringId(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        Wallet recipientWallet = walletRepository.findByUser(Optional.ofNullable(recipient)).orElse(null);
        if (recipientWallet == null) return false; // ✅ Recipient wallet not found

        if (senderWallet.getBalance().compareTo(amount) < 0) return false; // ✅ Insufficient funds

        // ✅ Deduct from sender
        senderWallet.setBalance(senderWallet.getBalance().subtract(amount));

        // ✅ Add to recipient
        recipientWallet.setBalance(recipientWallet.getBalance().add(amount));

        walletRepository.save(senderWallet);
        walletRepository.save(recipientWallet);

        String transactionId = UUID.randomUUID().toString();
        // ✅ Save transactions
        transactionRepository.save(new Transaction(senderWallet, "send", amount, recipient, transactionId));
        transactionRepository.save(new Transaction(recipientWallet, "receive", amount, sender, transactionId));

        return true;
    }


    // ✅ Get user from token
    private User getUserFromToken(String token) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Optional<User> getUserByStringId(String id) {
        Long userId = Long.valueOf(id);
        return userRepository.findById(userId);
    }
}
