package com.academic.RequirementManagementSystem.Dto;

import java.util.Set;

import com.academic.RequirementManagementSystem.Entity.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequirementDto {

	private Long requirementId;

	@NotEmpty(message = "Company Name is required")
	private String companyName;

	@NotBlank(message = "Job role is required")
	private String jobRole;

	@NotEmpty(message = "At least one degree must be specified")
	private Set<String> eligibleDegrees;

	@NotEmpty(message = "At least one stream must be specified")
	private Set<String> eligibleStreams;

	private String description;

	private Integer passedOutYear;

	private String location;

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Boolean applied = null;

	private User createdBy;
}
