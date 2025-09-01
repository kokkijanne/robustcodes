#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
PROFILE=${1:-default}

echo -e "${GREEN}Starting deployment...${NC}"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity --profile $PROFILE &>/dev/null; then
    echo -e "${RED}Error: AWS CLI not configured or invalid profile: $PROFILE${NC}"
    echo "Please run: aws configure --profile $PROFILE"
    exit 1
fi

# Get AWS account ID and region
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --profile $PROFILE)
REGION=$(aws configure get region --profile $PROFILE)

echo -e "${YELLOW}Deploying to account: $ACCOUNT_ID in region: $REGION${NC}"

# Build TypeScript
echo -e "${YELLOW}Building TypeScript...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed${NC}"
    exit 1
fi

# Bootstrap CDK (only needs to be done once per account/region)
echo -e "${YELLOW}Bootstrapping CDK...${NC}"
npx cdk bootstrap aws://$ACCOUNT_ID/$REGION --profile $PROFILE

# Deploy the stack
echo -e "${YELLOW}Deploying stack...${NC}"
npx cdk deploy \
    --profile $PROFILE \
    --require-approval never

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment successful!${NC}"
    
    # Get and display outputs
    echo -e "${YELLOW}Stack outputs:${NC}"
    aws cloudformation describe-stacks \
        --stack-name LandingPageStack \
        --query 'Stacks[0].Outputs' \
        --output table \
        --profile $PROFILE
else
    echo -e "${RED}Deployment failed${NC}"
    exit 1
fi