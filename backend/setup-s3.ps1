#!/usr/bin/env pwsh

Write-Host "Setting up S3 bucket for Great AI Agent..." -ForegroundColor Green

$bucketName = "great-ai-agent-media"
$region = "ap-southeast-5"

try {
    # Create S3 bucket
    Write-Host "Creating S3 bucket..." -ForegroundColor Yellow
    aws s3 mb "s3://$bucketName" --region $region
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Bucket may already exist, continuing..." -ForegroundColor Yellow
    }

    # Apply CORS configuration
    Write-Host "Applying CORS configuration..." -ForegroundColor Yellow
    aws s3api put-bucket-cors --bucket $bucketName --cors-configuration file://cors.json
    
    # Apply bucket policy
    Write-Host "Applying bucket policy..." -ForegroundColor Yellow
    aws s3api put-bucket-policy --bucket $bucketName --policy file://bucket-policy.json
    
    # Enable versioning
    Write-Host "Enabling versioning..." -ForegroundColor Yellow
    aws s3api put-bucket-versioning --bucket $bucketName --versioning-configuration Status=Enabled
    
    Write-Host "✅ S3 bucket configuration complete!" -ForegroundColor Green
    Write-Host "Bucket URL: https://$bucketName.s3.$region.amazonaws.com" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error configuring S3 bucket: $_" -ForegroundColor Red
    exit 1
}