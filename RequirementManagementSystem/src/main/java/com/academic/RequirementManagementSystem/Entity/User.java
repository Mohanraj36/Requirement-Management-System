package com.academic.RequirementManagementSystem.Entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	@Column(nullable = false, unique = true)
	private String userName;

	@Column(nullable = false)
	private String password;

	@Column(unique = true)
	private String email;

	@ManyToMany(fetch = FetchType.EAGER)
	private Set<RoleEntity> roles = new HashSet<>();

	private Long level;

	private String fullName;

	private String phoneNumber;

	public void addDefaultRole(RoleEntity defaultRole) {
		if (this.roles == null) {
			this.roles = new HashSet<>();
		}
		this.roles.add(defaultRole);
		this.level = defaultRole.getRoleId();
	}
}
