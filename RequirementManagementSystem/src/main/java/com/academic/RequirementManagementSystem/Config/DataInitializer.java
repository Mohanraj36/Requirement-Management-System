package com.academic.RequirementManagementSystem.Config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.academic.RequirementManagementSystem.Entity.RoleEntity;
import com.academic.RequirementManagementSystem.Entity.RoleName;
import com.academic.RequirementManagementSystem.Entity.User;
import com.academic.RequirementManagementSystem.Repository.RoleRepository;
import com.academic.RequirementManagementSystem.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

   private final RoleRepository roleRepository;
   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;

   @Override
   public void run(String... args) throws Exception {
       // Initialize Roles
       for (RoleName roleName : RoleName.values()) {
           if (roleRepository.findByRoleName(roleName).isEmpty()) {
               RoleEntity role = new RoleEntity();
               role.setRoleName(roleName);
               roleRepository.save(role);
           }
       }

       // Initialize Admin User
       if (userRepository.findByUserName("admin").isEmpty()) {
           User admin = new User();
           admin.setUserName("admin");
           admin.setEmail("admin@rms.com");
           admin.setFullName("System Administrator");
           admin.setPhoneNumber("+1234567890");
           admin.setPassword(passwordEncoder.encode("admin123"));

           RoleEntity adminRole = roleRepository.findByRoleName(RoleName.ADMIN)
                   .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

           Set<RoleEntity> roles = new HashSet<>();
           roles.add(adminRole);
           admin.setRoles(roles);
           admin.setLevel(adminRole.getRoleId());

           userRepository.save(admin);
           System.out.println("Default Admin User created: admin/admin123");
       }

       // Initialize Sample HR User
       if (userRepository.findByUserName("hr_user").isEmpty()) {
           User hr = new User();
           hr.setUserName("hr_user");
           hr.setEmail("hr@rms.com");
           hr.setFullName("Harriet Robinson");
           hr.setPhoneNumber("+1987654321");
           hr.setPassword(passwordEncoder.encode("hr123"));

           RoleEntity hrRole = roleRepository.findByRoleName(RoleName.HR)
                   .orElseThrow(() -> new RuntimeException("HR role not found"));

           Set<RoleEntity> roles = new HashSet<>();
           roles.add(hrRole);
           hr.setRoles(roles);
           hr.setLevel(hrRole.getRoleId());

           userRepository.save(hr);
       }

       // Initialize Sample Staff User
       if (userRepository.findByUserName("staff_user").isEmpty()) {
           User staff = new User();
           staff.setUserName("staff_user");
           staff.setEmail("staff@rms.com");
           staff.setFullName("Stanley Fischer");
           staff.setPhoneNumber("+1122334455");
           staff.setPassword(passwordEncoder.encode("staff123"));

           RoleEntity staffRole = roleRepository.findByRoleName(RoleName.STAFF)
                   .orElseThrow(() -> new RuntimeException("STAFF role not found"));

           Set<RoleEntity> roles = new HashSet<>();
           roles.add(staffRole);
           staff.setRoles(roles);
           staff.setLevel(staffRole.getRoleId());

           userRepository.save(staff);
       }
   }
}
