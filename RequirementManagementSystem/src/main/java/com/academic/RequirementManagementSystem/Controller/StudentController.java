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

import com.academic.RequirementManagementSystem.Dto.StudentDto;
import com.academic.RequirementManagementSystem.Security.SecurityConstants;
import com.academic.RequirementManagementSystem.Service.StudentService;

@RestController
@RequestMapping("/api/student")
public class StudentController {

	private final StudentService studentService;

	public StudentController(StudentService studentService) {
		this.studentService = studentService;
	}

	@GetMapping("/me")
	@PreAuthorize(SecurityConstants.HAS_NOT_DEFAULT)
	public ResponseEntity<StudentDto> getCurrentProfile() {
		return ResponseEntity.ok(studentService.fetchCurrentStudentProfile());
	}

	@PutMapping("/profile")
	@PreAuthorize(SecurityConstants.IS_STUDENT)
	public ResponseEntity<StudentDto> updateCurrentProfile(@RequestBody StudentDto studentDto) {
		return ResponseEntity.ok(studentService.updateCurrentStudentProfile(studentDto));
	}

	@PostMapping
	private ResponseEntity<StudentDto> createStudent(@RequestBody StudentDto studentDto) {
		StudentDto savedStudent = studentService.createStudent(studentDto);
		return new ResponseEntity<StudentDto>(savedStudent, HttpStatus.CREATED);
	}

	@PreAuthorize(SecurityConstants.HAS_NOT_DEFAULT)
	@GetMapping("{studentId}")
	private ResponseEntity<StudentDto> fetchById(@PathVariable Long studentId) {
		StudentDto student = studentService.fetchStudentById(studentId);
		return new ResponseEntity<StudentDto>(student, HttpStatus.OK);
	}

	@PreAuthorize(SecurityConstants.HAS_STAFF_HR_ADMIN)
	@GetMapping
	private ResponseEntity<List<StudentDto>> fetchAllStudents() {
		List<StudentDto> allStudents = studentService.fetchAllStudents();
		return new ResponseEntity<List<StudentDto>>(allStudents, HttpStatus.OK);
	}

	@PreAuthorize(SecurityConstants.HAS_NOT_DEFAULT)
	@PutMapping("update/{studentId}")
	private ResponseEntity<StudentDto> updateStudent(@PathVariable Long studentId, @RequestBody StudentDto studentDto) {
		StudentDto updatedStudent = studentService.updateStudent(studentId, studentDto);
		return new ResponseEntity<StudentDto>(updatedStudent, HttpStatus.OK);
	}

	@PreAuthorize(SecurityConstants.HAS_NOT_DEFAULT)
	@DeleteMapping("{studentId}")
	private ResponseEntity<String> deleteStudentById(@PathVariable Long studentId) {
		studentService.deleteStudentById(studentId);
		return ResponseEntity.ok("Student Deleted Successfully...");
	}

}
