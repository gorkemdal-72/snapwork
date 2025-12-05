package com.snapwork.backend.repository;
import com.snapwork.backend.entity.FieldResponse;
import com.snapwork.backend.entity.Application; // Import Application
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // Import List

@Repository
public interface FieldResponseRepository extends JpaRepository<FieldResponse, Long> {
    List<FieldResponse> findByApplication(Application application); // response for application
}