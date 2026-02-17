package com.academic.RequirementManagementSystem.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.academic.RequirementManagementSystem.Dto.UserDto;
import com.academic.RequirementManagementSystem.Security.SecurityConstants;
import com.academic.RequirementManagementSystem.Service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PostMapping("/promote/{userId}/{roleName}")
    @PreAuthorize(SecurityConstants.HAS_ADMIN)
    public ResponseEntity<UserDto> promoteUser(@PathVariable Long userId, @PathVariable String roleName) {
        return ResponseEntity.ok(userService.promoteUser(userId, roleName));
    }
}
