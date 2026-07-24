# EnvisionNow.TV AWS Setup Guide

## 1. Push extracted files to GitHub
Do not upload this ZIP as one file. Extract it and push the contents so `Dockerfile`, `buildspec.yml`, `package.json`, and `src/` are at the repository root.

## 2. Create GitHub connection
AWS Console → Developer Tools → Connections → Create connection → GitHub. Authorize the AWS GitHub App and make sure the connection status becomes **Available**.

## 3. Create AWS infrastructure
AWS Console → CloudFormation → Create stack → Upload template:

`infrastructure/aws/01-core-ecs-fargate.yml`

Use stack name `envisionnow-backend-core`. Select your VPC and at least two public subnets. You may leave CertificateArn blank for the first HTTP test.

## 4. Update Secrets Manager
Open the created secret `envisionnow-backend/runtime` and replace the placeholders. Never commit real secrets to GitHub.

## 5. Create CodeBuild project
- Name: `envisionnow-backend-build`
- Source: CodePipeline
- Managed Linux image
- **Privileged mode enabled** for Docker
- Buildspec: `buildspec.yml`
- Environment variable: `ECR_REPOSITORY_NAME=envisionnow-backend`
- Attach the permissions in `codebuild-ecr-policy.json` after replacing the repository ARN.

## 6. Create CodePipeline
Use `CODEPIPELINE_FIELD_CHECKLIST.md` exactly.

The build generates `imagedefinitions.json`. The ECS deploy action uses that file to replace the placeholder container image with the image pushed to ECR.

## 7. Connect api.envisionnow.tv
Request an ACM certificate for `api.envisionnow.tv` in the same region as the ALB. Update the CloudFormation stack with the certificate ARN. Then create a Route 53 A/AAAA alias record for `api.envisionnow.tv` pointing to the ALB.

## 8. Verify
- `/health`
- `/ready`
- `/admin/`

## Production gate
The current application repository is explicitly ephemeral. Do not accept real registrations or applications until PostgreSQL persistence, migrations, backup/restore, email verification, and production security testing are complete.
