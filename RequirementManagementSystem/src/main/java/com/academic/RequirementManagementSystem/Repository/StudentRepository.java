package com.academic.RequirementManagementSystem.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.academic.RequirementManagementSystem.Entity.Student;
import com.academic.RequirementManagementSystem.Entity.User;

public interface StudentRepository extends JpaRepository<Student, Long> {

	boolean existsByUser(User userId);

	Optional<Student> findByUser(User user);

	@Query("SELECT s FROM Student s " +
			"WHERE s.degree IN :degrees AND s.stream IN :streams AND s.yearOfPassing = :year " +
			"AND s NOT IN (SELECT as FROM Requirement r JOIN r.appliedStudents as WHERE r.requirementId = :reqId)")
	List<Student> findEligibleStudentsForRequirement(@Param("reqId") Long reqId,
			@Param("degrees") Set<String> degrees,
			@Param("streams") Set<String> streams,
			@Param("year") int year);
}
