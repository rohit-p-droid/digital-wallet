package com.example.backend.controller;

import com.example.backend.model.Wallet;
import com.example.backend.model.Transaction;
import com.example.backend.service.WalletService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {
    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    // ✅ Get wallet balance & transaction history
    @GetMapping("/")
    public ResponseEntity<?> getWalletDetails(@RequestHeader("Authorization") String token) {
        Map<String, Object> response = new HashMap<>();
        Wallet wallet = walletService.getWallet(token);
        if (wallet.getId() != null) {
            List<Transaction> transactions = walletService.getTransaction(wallet);
            response.put("transactions", transactions);
        } else {
            response.put("transactions", Collections.emptyList());
        }
        response.put("wallet", wallet);
        return ResponseEntity.ok().body(response);
    }

    // ✅ Add money to wallet
    @PostMapping("/add")
    public ResponseEntity<?> addMoney(@RequestHeader("Authorization") String token, @RequestBody Transaction txn) {
        Map<String, String> response = new HashMap<>();
        walletService.addMoney(token, txn.getAmount(), txn.getTransactionId());
        response.put("message", "Money added successfully!");
        return ResponseEntity.ok().body(response);
    }

    // ✅ Withdraw money
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdrawMoney(@RequestHeader("Authorization") String token, @RequestBody Transaction txn) {
        Map<String, String> response = new HashMap<>();
        boolean success = walletService.withdrawMoney(token, txn.getAmount());
        if(success) {
            response.put("message", "Money withdrawn successfully!");
            return ResponseEntity.ok().body(response);
        }
        response.put("message", "Insufficient funds!");
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> requestBody) {
        Map<String, String> response = new HashMap<>();
        String recipientWalletId = (String) requestBody.get("recipientId");
        BigDecimal amount = new BigDecimal(requestBody.get("amount").toString());

        boolean success = walletService.transferMoney(token, recipientWalletId, amount);

        if (!success) {
            response.put("error", "Transfer failed! Check balance or recipient wallet.");
            return ResponseEntity.badRequest().body(response);
        }
        response.put("message", "Transfer successful!");
        return ResponseEntity.ok().body(response);
    }

}
