package com.academic.RequirementManagementSystem.Security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.academic.RequirementManagementSystem.Entity.User;
import com.academic.RequirementManagementSystem.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

	private final UserRepository userRepo;
	
	public User getLoggedInUser() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			throw new AccessDeniedException("User not authenticated");
		}

		String username = authentication.getName();

		return userRepo.findByUserName(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}
}
