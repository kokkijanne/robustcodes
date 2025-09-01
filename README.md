# RobustCodes Landing Page

A modern, retro-themed landing page for RobustCodes software consultancy built with AWS CDK, featuring:

- **Static website hosting** with S3 and CloudFront
- **Secure contact form** that integrates with your existing email Lambda function
- **Retro terminal-style design** with CSS animations
- **Fully serverless architecture** with API Gateway and Lambda

## Architecture

```
CloudFront Distribution
    ↓
S3 Static Website
    ↓ (Contact Form)
API Gateway
    ↓
Lambda Function
    ↓
Your Email Service (Lambda)
```

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js 18+
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Bootstrap CDK (first time only):**
   ```bash
   npm run bootstrap
   ```

3. **Deploy the infrastructure:**
   ```bash
   npm run deploy
   ```

4. **Update the contact form with the API endpoint:**
   ```bash
   node update-api-endpoint.js
   ```

The deployment will output:
- **WebsiteURL**: Your CloudFront distribution URL
- **ApiEndpoint**: The API Gateway endpoint for the contact form

## Security Features

- **API Key Protection**: Your existing Lambda function's API key is securely embedded in the server-side Lambda function
- **CORS Configuration**: Properly configured to allow your domain only
- **CloudFront Distribution**: Provides caching and DDoS protection
- **S3 Security**: Bucket is private, only accessible via CloudFront

## Contact Form Integration

The contact form securely integrates with your existing email Lambda function:
- Collects name, email, and message
- Validates input client-side and server-side  
- Sends formatted HTML email using your existing service
- Provides user feedback for success/error states

## Customization

### Styling
Edit `website/styles.css` to customize the retro theme colors and animations.

### Content
Modify `website/index.html` to update:
- Services offered
- Company description
- Contact information

### Lambda Function
The contact form Lambda function is defined in `lib/landing-page-stack.ts` and can be modified to:
- Add additional validation
- Integrate with different email services
- Add spam protection

## Development

To make changes and redeploy:

1. Modify files in the `website/` directory
2. Run `npm run deploy` to update the S3 bucket and CloudFront distribution

## Cleanup

To remove all AWS resources:

```bash
npm run destroy
```

## Costs

This solution uses AWS free tier eligible services:
- **S3**: ~$0.023 per GB stored
- **CloudFront**: 1TB free data transfer per month
- **Lambda**: 1M free requests per month
- **API Gateway**: 1M free API calls per month

Typical monthly cost for a small business landing page: **< $1**

## Support

For issues or questions, contact RobustCodes.
