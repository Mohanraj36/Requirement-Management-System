package com.academic.RequirementManagementSystem.Entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "requirements")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Requirement {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long requirementId;

	@Column(nullable = false)
	private String companyName;

	@Column(nullable = false)
	private String jobRole;

	@ElementCollection
	private Set<String> eligibleDegrees = new HashSet<String>();

	@ElementCollection
	private Set<String> eligibleStreams = new HashSet<String>();

	private int passedOutYear;

	private String location;

	@Column(columnDefinition = "TEXT")
	private String description;

	@ManyToMany
	private Set<Student> appliedStudents = new HashSet<>();

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User createdBy;
}
