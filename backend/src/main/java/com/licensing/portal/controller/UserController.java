package com.licensing.portal.controller;

import com.licensing.portal.model.User;
import com.licensing.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
                .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getFullName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Simple DTO for user list to avoid exposing sensitive data
    public static class UserDTO {
        private Long id;
        private String username;
        private String fullName;

        public UserDTO(Long id, String username, String fullName) {
            this.id = id;
            this.username = username;
            this.fullName = fullName;
        }

        public Long getId() {
            return id;
        }

        public String getUsername() {
            return username;
        }

        public String getFullName() {
            return fullName;
        }
    }
}
