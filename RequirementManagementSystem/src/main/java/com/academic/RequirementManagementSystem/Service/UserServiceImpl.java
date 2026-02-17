package com.academic.RequirementManagementSystem.Service;

import java.util.Collections;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.academic.RequirementManagementSystem.CustomException.ResourceNotFoundException;
import com.academic.RequirementManagementSystem.CustomException.UserAlreadyExistsException;
import com.academic.RequirementManagementSystem.Dto.UserDto;
import com.academic.RequirementManagementSystem.Entity.RoleEntity;
import com.academic.RequirementManagementSystem.Entity.RoleName;
import com.academic.RequirementManagementSystem.Entity.Student;
import com.academic.RequirementManagementSystem.Entity.User;
import com.academic.RequirementManagementSystem.Mapper.UserMapper;
import com.academic.RequirementManagementSystem.Repository.RoleRepository;
import com.academic.RequirementManagementSystem.Repository.StudentRepository;
import com.academic.RequirementManagementSystem.Repository.UserRepository;
import com.academic.RequirementManagementSystem.Security.SecurityUtil;

@Service
public class UserServiceImpl implements UserService {

	private UserRepository userRepo;
	private RoleRepository roleRepo;
	private PasswordEncoder passwordEncoder;
	private SecurityUtil securityUtil;
	private StudentRepository studRepo;

	public UserServiceImpl(UserRepository userRepo, RoleRepository roleRepo, PasswordEncoder passwordEncoder,
			SecurityUtil securityUtil, StudentRepository studRepo) {
		super();
		this.userRepo = userRepo;
		this.roleRepo = roleRepo;
		this.passwordEncoder = passwordEncoder;
		this.securityUtil = securityUtil;
		this.studRepo = studRepo;
	}

	@Override
	public UserDto createUser(UserDto userDto) {
		if (userRepo.findByUserName(userDto.getUserName()).isPresent()) {
			throw new UserAlreadyExistsException("Username already exists: " + userDto.getUserName());
		}
		if (userRepo.findByEmail(userDto.getEmail()).isPresent()) {
			throw new UserAlreadyExistsException("Email already exists: " + userDto.getEmail());
		}

		User user = UserMapper.mapToUser(userDto);
		RoleEntity roleExists = roleRepo.findByRoleName(RoleName.DEFAULT)
				.orElseThrow(() -> new ResourceNotFoundException("RoleEntity Not Found In Table "));
		user.setPassword(passwordEncoder.encode(userDto.getPassword()));
		user.addDefaultRole(roleExists);
		User createdUser = userRepo.save(user);
		return UserMapper.mapToUserDto(createdUser);
	}

	@Override
	public UserDto fetchUserById(Long userId) {
		User userExists = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User Not Found With The Given Id: " + userId));
		return UserMapper.mapToUserDto(userExists);
	}

	@Override
	public List<UserDto> fetchAllUser() {
		List<User> users = userRepo.findAll();
		Collections.reverse(users);
		return UserMapper.mapToUserDtoList(users);
	}

	@Override
	public UserDto updateUserById(Long userId, UserDto userDto) {
		User userExists = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User Not Found With The Given Id: " + userId));
		userExists.setUserName(userDto.getUserName());
		userExists.setEmail(userDto.getEmail());
		// userExists.setPassword(passwordEncoder.encode(userDto.getPassword()));
		// RoleEntity roleExists =
		// roleRepo.findByRoleName(userDto.getRoleName()).orElseThrow(()-> new
		// ResourceNotFoundException("RoleEntity Not Found"+ userDto.getRoleName()));
		// userExists.setRole(roleExists);
		User updatedUser = userRepo.save(userExists);
		return UserMapper.mapToUserDto(updatedUser);
	}

	@Override
	public void deleteUserById(Long userId) {
		User userExists = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User Not Found With The Given Id: " + userId));
		userRepo.delete(userExists);
	}

	@Override
	public UserDto getMyDetails() {

		User user = securityUtil.getLoggedInUser();

		if (user != null) {
			return UserMapper.mapToUserDto(user);
		} else {
			return null;
		}
	}

	@Override
	public UserDto promoteUser(Long userId, String roleName) {

		User user = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User Not Found With The Given Id: " + userId));

		RoleEntity role = roleRepo.findByRoleName(RoleName.valueOf(roleName))
				.orElseThrow(() -> new ResourceNotFoundException("Role Not Found: " + roleName));

		user.getRoles().clear();
		user.getRoles().add(role);
		user.setLevel(role.getRoleId());

		User updatedUser = userRepo.save(user);

		// Automatically create Student record ONLY if promoted to STUDENT role and not
		// already existing
		if (RoleName.STUDENT.equals(role.getRoleName())) {
			if (studRepo.findByUser(updatedUser).isEmpty()) {
				Student newStudent = new Student();
				newStudent.setUser(updatedUser);
				newStudent.setFullName(
						updatedUser.getFullName() != null ? updatedUser.getFullName() : updatedUser.getUserName());
				newStudent.setDegree("NOT_SET");
				newStudent.setStream("NOT_SET");
				newStudent.setYearOfPassing(0);
				studRepo.save(newStudent);
			}
		}

		return UserMapper.mapToUserDto(updatedUser);
	}

}
