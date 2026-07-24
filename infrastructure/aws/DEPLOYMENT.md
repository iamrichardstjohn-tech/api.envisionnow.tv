# EnvisionNow.TV AWS Backend Deployment

## Recommended destination
Amazon ECS on Fargate behind an Application Load Balancer.

## Required AWS resources
1. ECR repository for the Docker image.
2. ECS cluster and Fargate service.
3. Application Load Balancer with HTTPS listener.
4. ACM certificate for `api.envisionnow.tv`.
5. Route 53 or external DNS CNAME/alias for `api.envisionnow.tv`.
6. CloudWatch log group `/ecs/envisionnow-backend`.
7. Secrets Manager entries for `JWT_SECRET`, `OWNER_EMAIL`, and later `DATABASE_URL`.
8. Managed PostgreSQL database before production user/application data is accepted.

## Build and push
```bash
docker build -t envisionnow-backend:2.0.0 .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com
docker tag envisionnow-backend:2.0.0 <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/envisionnow-backend:2.0.0
docker push <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/envisionnow-backend:2.0.0
```

## Production gate
The current Phase 1 repository uses an explicitly identified ephemeral in-memory store. Do not accept production registrations or applications until the PostgreSQL repository adapter, migrations, backups, and restore verification are completed.
