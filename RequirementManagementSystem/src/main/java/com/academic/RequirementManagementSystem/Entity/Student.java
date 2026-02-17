package com.academic.RequirementManagementSystem.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "students")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Student {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long studentId;

//	@Column(nullable = false)
	private String fullName;

//	@Column(nullable = false)
	private String degree;

//	@Column(nullable = false)
	private String stream;

//	@Column(nullable = false)
	private int yearOfPassing;

	@OneToOne
	@JoinColumn(name = "user_Id", unique = true)
	private User user;
}
