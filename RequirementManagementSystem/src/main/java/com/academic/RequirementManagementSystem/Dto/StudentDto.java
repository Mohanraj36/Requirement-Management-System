package com.academic.RequirementManagementSystem.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {

	private Long studentId;
	private String fullName;
	private String degree;
	private String stream;
	private String email;
	private int yearOfPassing;
	private Long userId;
	private Long batchId;

}
