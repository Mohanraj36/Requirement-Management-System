package com.academic.RequirementManagementSystem.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.academic.RequirementManagementSystem.Entity.Requirement;

public interface RequirementRepository extends JpaRepository<Requirement, Long> {

        @Query("SELECT r FROM Requirement r JOIN r.eligibleDegrees ed JOIN r.eligibleStreams es " +
                        "WHERE ed = :degree AND es = :stream AND r.passedOutYear = :year")
        List<Requirement> findEligibleRequirements(@Param("degree") String degree,
                        @Param("stream") String stream,
                        @Param("year") int year);

        @Query("SELECT r FROM Requirement r JOIN r.appliedStudents s WHERE s.studentId = :studentId")
        List<Requirement> findAppliedRequirementsByStudentId(@Param("studentId") Long studentId);
}
