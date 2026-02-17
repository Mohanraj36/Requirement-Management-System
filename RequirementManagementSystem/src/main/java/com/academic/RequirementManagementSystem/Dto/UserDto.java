package com.academic.RequirementManagementSystem.Dto;

import com.academic.RequirementManagementSystem.Entity.RoleEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserDto {
	private Long userId;
	private String userName;
	private String password;
	private String email;
	private String fullName;
	private String phoneNumber;
	private java.util.Set<RoleEntity> roles;
}
