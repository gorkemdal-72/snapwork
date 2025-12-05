package com.snapwork.backend.repository;
import com.snapwork.backend.entity.CustomField;
import com.snapwork.backend.entity.Job; // Import Job
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // Import List

@Repository
public interface CustomFieldRepository extends JpaRepository<CustomField, Long> {
    List<CustomField> findByJob(Job job); // application questions
}