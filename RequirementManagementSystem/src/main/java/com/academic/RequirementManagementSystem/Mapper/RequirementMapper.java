package com.academic.RequirementManagementSystem.Mapper;

import com.academic.RequirementManagementSystem.Dto.RequirementDto;
import com.academic.RequirementManagementSystem.Entity.Requirement;

public class RequirementMapper {

	public static Requirement mapToRequirement(RequirementDto requirementDto) {
		if (requirementDto == null)
			return null;

		Requirement requirement = new Requirement();
		requirement.setCompanyName(requirementDto.getCompanyName());
		requirement.setJobRole(requirementDto.getJobRole());
		requirement.setEligibleDegrees(requirementDto.getEligibleDegrees());
		requirement.setEligibleStreams(requirementDto.getEligibleStreams());
		requirement.setPassedOutYear(requirementDto.getPassedOutYear());
		requirement.setLocation(requirementDto.getLocation());
		requirement.setDescription(requirementDto.getDescription());
		return requirement;
	}

	public static RequirementDto mapToRequirementDto(Requirement requirement) {
		return new RequirementDto(
				requirement.getRequirementId(),
				requirement.getCompanyName(),
				requirement.getJobRole(),
				requirement.getEligibleDegrees(),
				requirement.getEligibleStreams(),
				requirement.getDescription(),
				requirement.getPassedOutYear(),
				requirement.getLocation(),
				false, // Default to false, service layer will override
				requirement.getCreatedBy());
	}

}
