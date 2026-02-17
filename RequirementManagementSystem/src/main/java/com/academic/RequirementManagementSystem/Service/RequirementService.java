package com.academic.RequirementManagementSystem.Service;

import java.util.List;

import com.academic.RequirementManagementSystem.Dto.RequirementDto;
import com.academic.RequirementManagementSystem.Dto.StudentDto;

public interface RequirementService {

	RequirementDto createRequirement(RequirementDto requirementDto);

	RequirementDto fetchRequirementById(Long requirementId);

	List<RequirementDto> fetchAllRequirement();

	RequirementDto updateRequirement(Long requirementId, RequirementDto requirementDto);

	void deleteRequirement(Long requirementId);

	List<RequirementDto> fetchEligibleRequirements();

	List<StudentDto> fetchAddedStudents(Long requirementId);

	List<StudentDto> fetchEligibleStudents(Long requirementId);

	void addStudentToRequirement(Long requirementId, Long studentId);

	void applyToRequirement(Long requirementId);

	List<RequirementDto> fetchAppliedRequirements();
}
