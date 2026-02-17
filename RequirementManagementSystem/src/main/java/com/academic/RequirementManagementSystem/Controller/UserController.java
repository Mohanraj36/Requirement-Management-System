package com.academic.RequirementManagementSystem.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.academic.RequirementManagementSystem.Dto.UserDto;
import com.academic.RequirementManagementSystem.Security.SecurityConstants;
import com.academic.RequirementManagementSystem.Service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

	private UserService userService;

	public UserController(UserService userService) {
		super();
		this.userService = userService;
	}

	@PostMapping
	public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
		UserDto user = userService.createUser(userDto);
		return new ResponseEntity<UserDto>(user, HttpStatus.CREATED);
	}

	@PreAuthorize(SecurityConstants.HAS_STAFF_HR_ADMIN)
	@GetMapping("{userId}")
	public ResponseEntity<UserDto> fetchUserById(@PathVariable Long userId) {
		UserDto user = userService.fetchUserById(userId);
		return new ResponseEntity<UserDto>(user, HttpStatus.OK);
	}

	@PreAuthorize(SecurityConstants.HAS_STAFF_HR_ADMIN)
	@GetMapping
	public ResponseEntity<List<UserDto>> fetchAllUser() {
		List<UserDto> users = userService.fetchAllUser();
		return new ResponseEntity<List<UserDto>>(users, HttpStatus.OK);
	}

//	@PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
	@PreAuthorize(SecurityConstants.HAS_STAFF_HR_ADMIN)
	@PutMapping("{userId}")
	public ResponseEntity<UserDto> updateUserById(@PathVariable Long userId, @RequestBody UserDto userDto) {
		UserDto user = userService.updateUserById(userId, userDto);
		return new ResponseEntity<UserDto>(user, HttpStatus.OK);
	}

	@PreAuthorize(SecurityConstants.HAS_STAFF_HR_ADMIN)
	@DeleteMapping("{userId}")
	public ResponseEntity<String> deleteUserById(@PathVariable Long userId) {
		userService.deleteUserById(userId);
		return ResponseEntity.ok("User Deleted Successfully...");
	}

	@GetMapping("me/")
	public ResponseEntity<UserDto> getMyDetails() {
		UserDto userDto = userService.getMyDetails();
		return new ResponseEntity<UserDto>(userDto, HttpStatus.OK);
	}

}
