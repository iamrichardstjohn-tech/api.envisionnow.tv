# EnvisionNow.TV Enterprise Backend v2.0

This release is the Phase 1 enterprise foundation for the EnvisionNow.TV backend.

## Implemented
- Cinematic administrative command center
- Health and readiness endpoints
- Request IDs, security headers, origin controls and rate limiting
- Password hashing using Node.js scrypt
- Signed session tokens using HMAC-SHA256
- Role-aware authentication and authorization middleware
- Creative and partner application intake
- Public catalog service
- Protected administrative metrics and audit APIs
- OpenAPI starter document
- Docker image and AWS ECS/Fargate deployment templates

## Important production truth
The application currently uses an explicitly labeled ephemeral in-memory repository. It is functional for development and architecture validation, but it is not suitable for durable production registrations or applications.

The next release gate is:
1. PostgreSQL schema and migrations
2. Production repository adapter
3. account activation and password reset
4. email confirmation
5. refresh-token rotation and revocation
6. media upload/storage integration
7. automated tests and security scanning
8. backup and restore verification
