package com.academic.RequirementManagementSystem.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.academic.RequirementManagementSystem.CustomException.ResourceNotFoundException;
import com.academic.RequirementManagementSystem.Dto.StudentDto;
import com.academic.RequirementManagementSystem.Entity.Student;
import com.academic.RequirementManagementSystem.Entity.User;
import com.academic.RequirementManagementSystem.Mapper.StudentMapper;
import com.academic.RequirementManagementSystem.Repository.StudentRepository;
import com.academic.RequirementManagementSystem.Repository.UserRepository;
import com.academic.RequirementManagementSystem.Security.SecurityConstants;

@Service
public class StudentServiceImpl implements StudentService {

	private StudentRepository studentRepo;
	private UserRepository userRepo;
	private com.academic.RequirementManagementSystem.Security.SecurityUtil securityUtil;

	public StudentServiceImpl(StudentRepository studentRepo, UserRepository userRepo,
			com.academic.RequirementManagementSystem.Security.SecurityUtil securityUtil) {
		super();
		this.studentRepo = studentRepo;
		this.userRepo = userRepo;
		this.securityUtil = securityUtil;
	}

	@Override
	public StudentDto createStudent(StudentDto studentDto) {
		Student student = StudentMapper.mapToStudent(studentDto);

		// first check student is user and batch is present or not
		User userExists = userRepo.findById(studentDto.getUserId()).orElseThrow(
				() -> new ResourceNotFoundException("User Not Found With Given Id: " + studentDto.getUserId()));
//		Batch batchExists = batchRepo.findById(studentDto.getBatchId()).orElseThrow(
//				() -> new ResourceNotFoundException("Batch Not Found With Given Id: " + studentDto.getBatchId()));

		// if present then set to Student Entity
		student.setUser(userExists);
//		student.setBatch(batchExists);

		// then Save the student entity
		Student createdStudent = studentRepo.save(student);

		// we don't want to expose User,Batch object so use id for those classes
		return StudentMapper.mapToStudentDto(createdStudent);
	}

	@Override
	public StudentDto fetchStudentById(Long studentId) {
		Student studentExists = studentRepo.findById(studentId)
				.orElseThrow(() -> new ResourceNotFoundException("Student Not Found With Given Id: " + studentId));
		return StudentMapper.mapToStudentDto(studentExists);
	}

	@PreAuthorize(SecurityConstants.HAS_STAFF_HR_ADMIN)
	@Override
	public List<StudentDto> fetchAllStudents() {
		List<Student> students = studentRepo.findAll();
		return students.stream().map((student) -> StudentMapper.mapToStudentDto(student)).collect(Collectors.toList());
	}

	@PreAuthorize(SecurityConstants.HAS_NOT_DEFAULT)
	@Override
	public StudentDto updateStudent(Long studentId, StudentDto studentDto) {
		// Student studentExists = studentRepo.findById(studentId)
		// .orElseThrow(() -> new ResourceNotFoundException("Student Not Found With
		// Given Id: " + studentId));
		//
		// studentExists.setFullName(studentDto.getFullName());
		// studentExists.setDegree(studentDto.getDegree());
		// studentExists.setStream(studentDto.getStream());
		// studentExists.setYearOfPassing(studentDto.getYearOfPassing());
		// studentExists.setBatch(studentDto.getBatch());
		// studentExists.setUser(studentDto.getUser());
		//
		// Student updatedStudent = studentRepo.save(studentExists);
		//
		// return StudentMapper.mapToStudentDto(updatedStudent);
		return null;
	}

	@PreAuthorize(SecurityConstants.HAS_NOT_DEFAULT)
	@Override
	public void deleteStudentById(Long studentId) {
		Student studentExists = studentRepo.findById(studentId)
				.orElseThrow(() -> new ResourceNotFoundException("Student Not Found With Given Id: " + studentId));
		studentRepo.delete(studentExists);
	}

	@Override
	public StudentDto fetchCurrentStudentProfile() {
		User loggedInUser = securityUtil.getLoggedInUser();
		return studentRepo.findByUser(loggedInUser)
				.map(StudentMapper::mapToStudentDto)
				.orElseGet(() -> {
					StudentDto dto = new StudentDto();
					dto.setUserId(loggedInUser.getUserId());
					dto.setEmail(loggedInUser.getEmail());
					dto.setFullName(loggedInUser.getFullName() != null ? loggedInUser.getFullName()
							: loggedInUser.getUserName());
					dto.setDegree("NOT_SET");
					dto.setStream("NOT_SET");
					dto.setYearOfPassing(0);
					return dto;
				});
	}

	@Transactional
	@Override
	public StudentDto updateCurrentStudentProfile(StudentDto studentDto) {
		User loggedInUser = securityUtil.getLoggedInUser();
		Student student = studentRepo.findByUser(loggedInUser)
				.orElseGet(() -> {
					Student newStudent = new Student();
					newStudent.setUser(loggedInUser);
					return newStudent;
				});

		student.setFullName(studentDto.getFullName());
		student.setDegree(studentDto.getDegree());
		student.setStream(studentDto.getStream());
		student.setYearOfPassing(studentDto.getYearOfPassing());

//		if (studentDto.getBatchId() != null) {
//			Batch batch = batchRepo.findById(studentDto.getBatchId())
//					.orElseThrow(
//							() -> new ResourceNotFoundException("Batch not found with id: " + studentDto.getBatchId()));
//			student.setBatch(batch);
//		}

		Student updatedStudent = studentRepo.save(student);
		return StudentMapper.mapToStudentDto(updatedStudent);
	}

}
