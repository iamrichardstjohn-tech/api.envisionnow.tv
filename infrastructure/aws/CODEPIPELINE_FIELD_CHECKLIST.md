# CodePipeline Field Checklist

## Source
- Provider: GitHub (via GitHub App) / GitHub Version 2
- Connection status: Available
- Repository: your backend repository
- Branch: main
- Output artifact: SourceArtifact

## Build
- Provider: AWS CodeBuild
- Project: envisionnow-backend-build
- Input: SourceArtifact
- Output: BuildArtifact
- Buildspec: buildspec.yml
- Privileged mode: Enabled
- Environment variable: ECR_REPOSITORY_NAME=envisionnow-backend

## Deploy
- Provider: Amazon ECS
- Input: BuildArtifact
- Cluster: envisionnow-backend
- Service: envisionnow-backend-service
- Image definitions file: imagedefinitions.json

## ECS container
- Name: envisionnow-backend
- Port: 3000
- Protocol: TCP
- App protocol: HTTP
- Essential: Yes
