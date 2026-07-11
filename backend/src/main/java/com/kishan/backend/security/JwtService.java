package com.kishan.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service class responsible for generating, extracting, and validating JSON Web Tokens (JWT).
 */
@Service
public class JwtService {

    private final String secret;
    private final long expiration;

    public JwtService(
            @Value("${jwt.secret:3c9e4d1b7f8c5e6d2b3a4f5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e}") String secret,
            @Value("${jwt.expiration:86400000}") long expiration) {
        this.secret = secret;
        this.expiration = expiration;
    }

    /**
     * Obtains the signing key for JWT signature verification.
     *
     * @return the HMAC-SHA signing key
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a JWT token for the specified user email and role.
     *
     * @param email the user email
     * @param role  the user role
     * @return the generated JWT token string
     */
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Parses the JWT token to extract all claims.
     *
     * @param token the JWT token
     * @return all claims in the token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Helper method to extract a specific claim using a claims resolver function.
     *
     * @param token          the JWT token
     * @param claimsResolver the function to resolve claims
     * @param <T>            the type of the claim
     * @return the resolved claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts the user email (subject) from the JWT token.
     *
     * @param token the JWT token
     * @return the extracted email
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the user role claim from the JWT token.
     *
     * @param token the JWT token
     * @return the extracted role
     */
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    /**
     * Extracts the expiration date from the JWT token.
     *
     * @param token the JWT token
     * @return the expiration date
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Checks if the JWT token has expired.
     *
     * @param token the JWT token
     * @return true if expired, false otherwise
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Validates if the JWT token is valid and matches the specified email.
     *
     * @param token the JWT token
     * @param email the user email to match
     * @return true if valid, false otherwise
     */
    public boolean validateToken(String token, String email) {
        try {
            final String extractedEmail = extractEmail(token);
            return (extractedEmail.equals(email) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }
}
