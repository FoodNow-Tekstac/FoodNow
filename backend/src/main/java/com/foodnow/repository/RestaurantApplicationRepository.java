package com.foodnow.repository;

import com.foodnow.model.ApplicationStatus;
import com.foodnow.model.RestaurantApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantApplicationRepository extends JpaRepository<RestaurantApplication, Integer> {
    List<RestaurantApplication> findByStatus(ApplicationStatus status);
    Optional<RestaurantApplication> findByApplicantId(int applicantId);
}