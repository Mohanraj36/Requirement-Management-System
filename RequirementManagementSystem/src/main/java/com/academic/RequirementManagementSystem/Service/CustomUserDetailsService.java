package com.academic.RequirementManagementSystem.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.academic.RequirementManagementSystem.Repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepo;

	public CustomUserDetailsService(UserRepository userRepo) {
		this.userRepo = userRepo;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		com.academic.RequirementManagementSystem.Entity.User user = userRepo.findByUserName(username)
				.orElseThrow(() -> new UsernameNotFoundException("Username Not Found: " + username));

		// 🔑 Convert RoleEntity → GrantedAuthority
//		GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getRoleName().name());

		List<GrantedAuthority> authority = user.getRoles().stream().map(role-> new SimpleGrantedAuthority("ROLE_" +role.getRoleName().name())).collect(Collectors.toList());

//		List<GrantedAuthority> authority = user.getRole().getRoleList().stream().
//				map(role->new SimpleGrantedAuthority(role.name())).collect(Collectors.toList());

//		System.out.println(user.toString());
//		System.out.println(authority.toString().toCharArray());
		return new org.springframework.security.core.userdetails.User(user.getUserName(), user.getPassword(), authority);
	}
}
