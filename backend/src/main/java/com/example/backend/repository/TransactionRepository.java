package com.example.backend.repository;

import com.example.backend.model.Transaction;
import com.example.backend.model.Wallet;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByWallet(Wallet wallet, Sort sort);
}
