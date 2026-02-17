package com.academic.RequirementManagementSystem.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.academic.RequirementManagementSystem.CustomException.ResourceNotFoundException;
import com.academic.RequirementManagementSystem.Dto.RequirementDto;
import com.academic.RequirementManagementSystem.Dto.StudentDto;
import com.academic.RequirementManagementSystem.Entity.Requirement;
import com.academic.RequirementManagementSystem.Entity.Student;
import com.academic.RequirementManagementSystem.Entity.User;
import com.academic.RequirementManagementSystem.Mapper.RequirementMapper;
import com.academic.RequirementManagementSystem.Mapper.StudentMapper;
import com.academic.RequirementManagementSystem.Repository.RequirementRepository;
import com.academic.RequirementManagementSystem.Repository.StudentRepository;
import com.academic.RequirementManagementSystem.Security.SecurityUtil;

import jakarta.transaction.Transactional;

@Service
public class RequirementServiceImpl implements RequirementService {

	private final RequirementRepository requirementRepo;
	private final SecurityUtil securityUtil;
	private final StudentRepository studentRepository;

	public RequirementServiceImpl(RequirementRepository requirementRepo, SecurityUtil securityUtil,
			StudentRepository studentRepository) {
		this.requirementRepo = requirementRepo;
		this.securityUtil = securityUtil;
		this.studentRepository = studentRepository;
	}

	@Transactional
	@Override
	public RequirementDto createRequirement(RequirementDto requirementDto) {
		User loggedInUser = securityUtil.getLoggedInUser();

		Requirement requirement = RequirementMapper.mapToRequirement(requirementDto);
		requirement.setCreatedBy(loggedInUser);
		Requirement savedRequirement = requirementRepo.save(requirement);
		return RequirementMapper.mapToRequirementDto(savedRequirement);
	}

	@Override
	public RequirementDto fetchRequirementById(Long requirementId) {
		Requirement requirement = requirementRepo.findById(requirementId)
				.orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + requirementId));
		RequirementDto dto = RequirementMapper.mapToRequirementDto(requirement);

		// If student, check if applied
		try {
			User loggedInUser = securityUtil.getLoggedInUser();
			studentRepository.findByUser(loggedInUser).ifPresent(student -> {
				dto.setApplied(requirement.getAppliedStudents().contains(student));
			});
		} catch (Exception e) {
			// Not logged in or anonymous, ignore
		}

		return dto;
	}

	@Override
	public List<RequirementDto> fetchAllRequirement() {
		List<Requirement> requirements = requirementRepo.findAll();
		return requirements.stream().map(RequirementMapper::mapToRequirementDto).collect(Collectors.toList());
	}

	@Transactional
	@Override
	public RequirementDto updateRequirement(Long requirementId, RequirementDto requirementDto) {
		Requirement requirement = requirementRepo.findById(requirementId)
				.orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + requirementId));

		requirement.setCompanyName(requirementDto.getCompanyName());
		requirement.setJobRole(requirementDto.getJobRole());
		requirement.setDescription(requirementDto.getDescription());
		requirement.setEligibleDegrees(requirementDto.getEligibleDegrees());
		requirement.setEligibleStreams(requirementDto.getEligibleStreams());
		requirement.setPassedOutYear(requirementDto.getPassedOutYear());
		requirement.setLocation(requirementDto.getLocation());

		Requirement updatedRequirement = requirementRepo.save(requirement);
		return RequirementMapper.mapToRequirementDto(updatedRequirement);
	}

	@Transactional
	@Override
	public void deleteRequirement(Long requirementId) {
		Requirement requirement = requirementRepo.findById(requirementId)
				.orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + requirementId));
		requirementRepo.delete(requirement);
	}

	@Override
	public List<RequirementDto> fetchEligibleRequirements() {
		User loggedInUser = securityUtil.getLoggedInUser();
		Student student = studentRepository.findByUser(loggedInUser)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Student profile not found for user: " + loggedInUser.getUserName()));

		List<Requirement> eligibleRequirements = requirementRepo.findEligibleRequirements(
				student.getDegree(),
				student.getStream(),
				student.getYearOfPassing());
		return eligibleRequirements.stream().map(req -> {
			RequirementDto dto = RequirementMapper.mapToRequirementDto(req);
			dto.setApplied(req.getAppliedStudents().contains(student));
			return dto;
		}).collect(Collectors.toList());
	}

	@Override
	public List<StudentDto> fetchAddedStudents(Long requirementId) {
		Requirement requirement = requirementRepo.findById(requirementId)
				.orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + requirementId));
		return requirement.getAppliedStudents().stream()
				.map(StudentMapper::mapToStudentDto)
				.collect(Collectors.toList());
	}

	@Override
	public List<StudentDto> fetchEligibleStudents(Long requirementId) {
		Requirement requirement = requirementRepo.findById(requirementId)
				.orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + requirementId));

		List<Student> eligibleStudents = studentRepository.findEligibleStudentsForRequirement(
				requirementId,
				requirement.getEligibleDegrees(),
				requirement.getEligibleStreams(),
				requirement.getPassedOutYear());

		return eligibleStudents.stream()
				.map(StudentMapper::mapToStudentDto)
				.collect(Collectors.toList());
	}

	@Transactional
	@Override
	public void addStudentToRequirement(Long requirementId, Long studentId) {
		Requirement requirement = requirementRepo.findById(requirementId)
				.orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + requirementId));
		Student student = studentRepository.findById(studentId)
				.orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

		requirement.getAppliedStudents().add(student);
		requirementRepo.save(requirement);
	}

	@Transactional
	@Override
	public void applyToRequirement(Long requirementId) {
		User loggedInUser = securityUtil.getLoggedInUser();
		Student student = studentRepository.findByUser(loggedInUser)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Student profile not found for user: " + loggedInUser.getUserName()));

		Requirement requirement = requirementRepo.findById(requirementId)
				.orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + requirementId));

		// Eligibility check (Optional: could be stricter but basic check against
		// year/degree/stream)
		// For now, allow application if button is visible (frontend handles visibility
		// via eligible endpoint)

		requirement.getAppliedStudents().add(student);
		requirementRepo.save(requirement);
	}

	@Override
	public List<RequirementDto> fetchAppliedRequirements() {
		User loggedInUser = securityUtil.getLoggedInUser();
		Student student = studentRepository.findByUser(loggedInUser)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Student profile not found for user: " + loggedInUser.getUserName()));

		List<Requirement> appliedRequirements = requirementRepo
				.findAppliedRequirementsByStudentId(student.getStudentId());
		return appliedRequirements.stream().map(req -> {
			RequirementDto dto = RequirementMapper.mapToRequirementDto(req);
			dto.setApplied(true);
			return dto;
		}).collect(Collectors.toList());
	}

}
