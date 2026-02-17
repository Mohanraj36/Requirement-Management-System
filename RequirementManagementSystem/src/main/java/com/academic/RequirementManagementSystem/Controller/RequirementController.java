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

import com.academic.RequirementManagementSystem.Dto.RequirementDto;
import com.academic.RequirementManagementSystem.Dto.StudentDto;
import com.academic.RequirementManagementSystem.Security.SecurityConstants;
import com.academic.RequirementManagementSystem.Service.RequirementService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/requirement")
public class RequirementController {

	private final RequirementService requirementService;

	@PreAuthorize(SecurityConstants.HAS_HR_OR_STAFF_OR_ADMIN)
	@PostMapping
	public ResponseEntity<RequirementDto> createRequirement(@RequestBody RequirementDto requirementDto) {
		RequirementDto createdRequirement = requirementService.createRequirement(requirementDto);
		return new ResponseEntity<>(createdRequirement, HttpStatus.CREATED);
	}

	@GetMapping("/{requirementId}")
	public ResponseEntity<RequirementDto> getRequirementById(@PathVariable Long requirementId) {
		RequirementDto requirementDto = requirementService.fetchRequirementById(requirementId);
		return ResponseEntity.ok(requirementDto);
	}

	@GetMapping
	public ResponseEntity<List<RequirementDto>> getAllRequirements() {
		List<RequirementDto> requirements = requirementService.fetchAllRequirement();
		return ResponseEntity.ok(requirements);
	}

	@PreAuthorize(SecurityConstants.HAS_HR_OR_STAFF_OR_ADMIN)
	@PutMapping("/{requirementId}")
	public ResponseEntity<RequirementDto> updateRequirement(@PathVariable Long requirementId,
			@RequestBody RequirementDto requirementDto) {
		RequirementDto updatedRequirement = requirementService.updateRequirement(requirementId, requirementDto);
		return ResponseEntity.ok(updatedRequirement);
	}

	@PreAuthorize(SecurityConstants.HAS_HR_OR_STAFF_OR_ADMIN)
	@DeleteMapping("/{requirementId}")
	public ResponseEntity<Void> deleteRequirement(@PathVariable Long requirementId) {
		requirementService.deleteRequirement(requirementId);
		return ResponseEntity.noContent().build();
	}

	@PreAuthorize(SecurityConstants.IS_STUDENT)
	@GetMapping("/eligible")
	public ResponseEntity<List<RequirementDto>> getEligibleRequirements() {
		List<RequirementDto> requirements = requirementService.fetchEligibleRequirements();
		return ResponseEntity.ok(requirements);
	}

	@PreAuthorize(SecurityConstants.HAS_HR_OR_STAFF_OR_ADMIN)
	@GetMapping("/{id}/students/added")
	public ResponseEntity<List<StudentDto>> getAddedStudents(@PathVariable Long id) {
		List<StudentDto> students = requirementService.fetchAddedStudents(id);
		return ResponseEntity.ok(students);
	}

	@PreAuthorize(SecurityConstants.HAS_HR_OR_STAFF_OR_ADMIN)
	@GetMapping("/{id}/students/eligible")
	public ResponseEntity<List<StudentDto>> getEligibleStudents(@PathVariable Long id) {
		List<StudentDto> students = requirementService.fetchEligibleStudents(id);
		return ResponseEntity.ok(students);
	}

	@PreAuthorize(SecurityConstants.HAS_HR_OR_STAFF_OR_ADMIN)
	@PostMapping("/{id}/add-student/{studentId}")
	public ResponseEntity<Void> addStudentToRequirement(@PathVariable Long id, @PathVariable Long studentId) {
		requirementService.addStudentToRequirement(id, studentId);
		return ResponseEntity.ok().build();
	}

	@PreAuthorize(SecurityConstants.IS_STUDENT)
	@PostMapping("/{id}/apply")
	public ResponseEntity<Void> applyToRequirement(@PathVariable Long id) {
		requirementService.applyToRequirement(id);
		return ResponseEntity.ok().build();
	}

	@PreAuthorize(SecurityConstants.IS_STUDENT)
	@GetMapping("/applied")
	public ResponseEntity<List<RequirementDto>> getAppliedRequirements() {
		List<RequirementDto> requirements = requirementService.fetchAppliedRequirements();
		return ResponseEntity.ok(requirements);
	}
}
