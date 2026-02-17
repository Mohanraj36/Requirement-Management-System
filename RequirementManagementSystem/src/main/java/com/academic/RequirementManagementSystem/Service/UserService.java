package com.academic.RequirementManagementSystem.Service;

import java.util.List;

import com.academic.RequirementManagementSystem.Dto.UserDto;

public interface UserService {

	UserDto createUser(UserDto userDto);

	UserDto fetchUserById(Long userId);

	List<UserDto> fetchAllUser();

	UserDto updateUserById(Long userId, UserDto userDto);

	void deleteUserById(Long userId);

	UserDto getMyDetails();

	UserDto promoteUser(Long userId, String roleName);

}
