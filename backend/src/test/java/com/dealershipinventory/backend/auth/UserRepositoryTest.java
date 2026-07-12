package com.dealershipinventory.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveUser_ShouldPersistWithGeneratedId() {
        User user = User.builder()
            .email("test@example.com")
            .password("encodedPass")
            .role(Role.ROLE_USER)
            .build();

        User saved = userRepository.save(user);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getEmail()).isEqualTo("test@example.com");
        assertThat(saved.getRole()).isEqualTo(Role.ROLE_USER);
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    void findByEmail_ShouldReturnUser() {
        User user = User.builder()
            .email("find@example.com")
            .password("pass")
            .role(Role.ROLE_USER)
            .build();
        userRepository.save(user);

        Optional<User> found = userRepository.findByEmail("find@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("find@example.com");
    }

    @Test
    void findByEmail_WithNonExistent_ShouldReturnEmpty() {
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");

        assertThat(found).isEmpty();
    }

    @Test
    void emailUniqueness_ShouldThrowOnDuplicate() {
        User user1 = User.builder()
            .email("duplicate@example.com")
            .password("pass1")
            .role(Role.ROLE_USER)
            .build();
        userRepository.saveAndFlush(user1);

        User user2 = User.builder()
            .email("duplicate@example.com")
            .password("pass2")
            .role(Role.ROLE_USER)
            .build();

        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.save(user2);
            userRepository.flush();
        });
    }
}
