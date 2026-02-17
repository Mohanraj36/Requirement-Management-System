package com.academic.RequirementManagementSystem.Mapper;

import java.util.ArrayList;
import java.util.List;

import com.academic.RequirementManagementSystem.Dto.UserDto;
import com.academic.RequirementManagementSystem.Entity.User;

public class UserMapper {

	public static UserDto mapToUserDto(User user) {

		if (user == null)
			return null;

		UserDto dto = new UserDto();
		dto.setUserId(user.getUserId());
		dto.setUserName(user.getUserName());
		dto.setEmail(user.getEmail());
		dto.setFullName(user.getFullName());
		dto.setPhoneNumber(user.getPhoneNumber());
		dto.setRoles(user.getRoles());
		// we don't want to send password to frontend
		return dto;
	}

	public static User mapToUser(UserDto userDto) {

		if (userDto == null)
			return null;

		User user = new User();
		user.setEmail(userDto.getEmail());
		user.setPassword(userDto.getPassword());
		user.setUserName(userDto.getUserName());
		user.setFullName(userDto.getFullName());
		user.setPhoneNumber(userDto.getPhoneNumber());
		user.setRoles(userDto.getRoles());
		return user;

	}

	public static List<UserDto> mapToUserDtoList(List<User> users) {

		List<UserDto> userDto = new ArrayList<UserDto>();

		for (User user : users) {
			userDto.add(mapToUserDto(user));
		}
		return userDto;
	}
}
