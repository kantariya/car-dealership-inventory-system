package com.kishan.backend.auth.repository;

import com.kishan.backend.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository interface for performing database operations on {@link User} entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Finds a user by their email address.
     *
     * @param email the email address
     * @return an Optional containing the found user, or empty
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if a user exists with the specified email address.
     * Used for duplicate registration validation.
     *
     * @param email the email address to check
     * @return true if a user exists, false otherwise
     */
    boolean existsByEmail(String email);
}
