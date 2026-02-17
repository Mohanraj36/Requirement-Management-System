package com.academic.RequirementManagementSystem.Service;

import java.util.List;

import com.academic.RequirementManagementSystem.Dto.StudentDto;

public interface StudentService {

	StudentDto createStudent(StudentDto studentDto);

	StudentDto fetchStudentById(Long studentId);

	List<StudentDto> fetchAllStudents();

	StudentDto updateStudent(Long studentId, StudentDto studentDto);

	void deleteStudentById(Long studentId);

	StudentDto fetchCurrentStudentProfile();

	StudentDto updateCurrentStudentProfile(StudentDto studentDto);

}
