package com.academic.RequirementManagementSystem.Mapper;

import com.academic.RequirementManagementSystem.Dto.StudentDto;
import com.academic.RequirementManagementSystem.Entity.Student;

public class StudentMapper {

	public static StudentDto mapToStudentDto(Student student) {

		if (student == null)
			return null;

		StudentDto dto = new StudentDto();
		dto.setStudentId(student.getStudentId());
		dto.setFullName(student.getFullName());
		dto.setStream(student.getStream());
		dto.setDegree(student.getDegree());
		dto.setYearOfPassing(student.getYearOfPassing());

		if (student.getUser() != null) {
			dto.setUserId(student.getUser().getUserId());
			dto.setEmail(student.getUser().getEmail());
		}

//		if (student.getBatch() != null) {
//			dto.setBatchId(student.getBatch().getBatchId());
//		}
		return dto;
	}

	public static Student mapToStudent(StudentDto studentDto) {

		if (studentDto == null)
			return null;

		Student student = new Student();

		student.setFullName(studentDto.getFullName());
		student.setDegree(studentDto.getDegree());
		student.setStream(studentDto.getStream());
		student.setYearOfPassing(studentDto.getYearOfPassing());

		return student;
	}

}
