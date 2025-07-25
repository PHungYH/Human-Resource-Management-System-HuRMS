package com.peterhung.hk.demo.rms.rms.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.peterhung.hk.demo.rms.rms.model.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer>{
	boolean existsByApplicantUsernameAndJobOpeningId(String applicantUsername, int jobOpeningId);
	JobApplication[] findByApplicantUsername(String applicantUsername);
	JobApplication[] findByJobOpeningId(int jobOpeningId);
	JobApplication[] findByInterviewTimeAfterOrderByInterviewTimeAsc(LocalDateTime dateTime);
}
