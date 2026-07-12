package com.dealershipinventory.backend.config;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dealershipinventory.backend.auth.User;
import com.dealershipinventory.backend.auth.UserPrincipal;
import com.dealershipinventory.backend.auth.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                log.warn("Login failed for email={}", email);
                return new UsernameNotFoundException("User not found with email: " + email);
            });
        return new UserPrincipal(user);
    }
}
