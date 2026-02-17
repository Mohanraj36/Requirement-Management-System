package com.academic.RequirementManagementSystem.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.academic.RequirementManagementSystem.Entity.RoleEntity;
import com.academic.RequirementManagementSystem.Entity.RoleName;

public interface RoleRepository extends JpaRepository<RoleEntity, Long>{

	Optional<RoleEntity> findByRoleName(RoleName roleName);

	
//	@Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
//	Optional<RoleEntity> findByRoleName(@Param("roleName") String roleName);
	
//	Optional<RoleEntity> findByRoleName(String roleName);

	
}
