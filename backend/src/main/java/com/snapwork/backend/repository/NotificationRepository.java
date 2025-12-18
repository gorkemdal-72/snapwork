package com.snapwork.backend.repository;

import com.snapwork.backend.entity.Notification;
import com.snapwork.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    long countByUserAndIsReadFalse(User user);

    // SQL Query yerine bu metodu kullanacağız.
    // Spring Data JPA bunu otomatik olarak anlar:
    // "Bana bu kullanıcının ID'sine sahip ve isRead=false olanları getir"
    List<Notification> findAllByUser_UserIdAndIsReadFalse(Long userId);

}