package com.example.crud_user_api.controller;

import com.example.crud_user_api.entity.User;
import com.example.crud_user_api.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id, Authentication authentication) {
        User currentUser = userService.findByUsername(authentication.getName());
        if (currentUser.getRole().equals("Admin") || currentUser.getId().equals(id)) {
            User user = userService.findById(id);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser, Authentication authentication) {
        User currentUser = userService.findByUsername(authentication.getName());
        if (currentUser.getRole().equals("Admin") || currentUser.getId().equals(id)) {
            User user = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(@RequestBody User userDetails, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        if (user != null) {
            user.setEmail(userDetails.getEmail());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            user.setAddress(userDetails.getAddress());
            user.setGender(userDetails.getGender());
            user.setDepartment(userDetails.getDepartment());
            user.setSkills(userDetails.getSkills());
            return ResponseEntity.ok(userService.updateUser(user.getId(), user));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String username = principal instanceof UserDetails ? ((UserDetails) principal).getUsername() : principal.toString();
        User user = userService.findByUsername(username);
        if (user != null) {
            userService.deleteUser(user.getId());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-phone")
    public ResponseEntity<Boolean> checkPhoneNumber(@RequestParam String phoneNumber) {
        boolean exists = userService.existsByPhoneNumber(phoneNumber);
        return ResponseEntity.ok(exists);
    }
}
