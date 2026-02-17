package com.academic.RequirementManagementSystem.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.academic.RequirementManagementSystem.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUserName(String userName);
	
	Optional<User> findByEmail(String email);
}
