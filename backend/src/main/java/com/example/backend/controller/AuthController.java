package com.example.backend.controller;

import com.example.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.backend.service.UserService;
import com.example.backend.model.User;
import com.example.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        Optional<User> existingUser = userService.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            response.put("message", "Email already exists!");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            User savedUser = userService.registerUser(user);
            response.put("message", "User registration successful");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            String error = "Registration failed: " + e.getMessage();
            response.put("error", error);
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User loginRequest) {
        Map<String, String> response = new HashMap<>();
        Optional<User> user = userService.findByEmail(loginRequest.getEmail());

        if(user.isPresent() && userService.verifyPassword(loginRequest.getPassword(), user.get().getPassword())) {
            String token = jwtUtil.generateJwt(user.get().getEmail());
            response.put("message", "User login successful");
            response.put("token", token);
            return ResponseEntity.ok().body(response);
        } else {
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(401).body(response);
        }
    }

    @GetMapping("/get-users")
    public ResponseEntity<Map<String, Object>> getUsers() {
        Map<String, Object> response = new HashMap<>();
        List<User> users = userService.getAll();
        response.put("users", users);
        return ResponseEntity.ok().body(response);
    }
}
