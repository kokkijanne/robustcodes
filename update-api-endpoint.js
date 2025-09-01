#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read CDK outputs to get the API endpoint
const { execSync } = require('child_process');

try {
    // Get the stack outputs
    const outputs = execSync('npx cdk list --json', { encoding: 'utf8' });
    const stacks = JSON.parse(outputs);
    
    if (stacks.length === 0) {
        console.log('No stacks found. Please deploy first.');
        process.exit(1);
    }
    
    const stackName = stacks[0];
    const stackOutputs = execSync(`aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].Outputs" --output json`, { encoding: 'utf8' });
    const outputs = JSON.parse(stackOutputs);
    
    // Find the API endpoint output
    const apiEndpointOutput = outputs.find(output => output.OutputKey === 'ApiEndpoint');
    
    if (!apiEndpointOutput) {
        console.log('API endpoint not found in stack outputs.');
        process.exit(1);
    }
    
    const apiEndpoint = apiEndpointOutput.OutputValue;
    console.log(`Found API endpoint: ${apiEndpoint}`);
    
    // Update the script.js file
    const scriptPath = path.join(__dirname, 'website', 'script.js');
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // Replace the API endpoint placeholder
    scriptContent = scriptContent.replace(
        'const apiEndpoint = window.API_ENDPOINT || \'/api\';',
        `const apiEndpoint = '${apiEndpoint}';`
    );
    
    fs.writeFileSync(scriptPath, scriptContent);
    console.log('Updated script.js with API endpoint');
    
    // Now redeploy the website files
    execSync('npx cdk deploy --require-approval never', { stdio: 'inherit' });
    console.log('Redeployed with updated API endpoint');
    
} catch (error) {
    console.error('Error updating API endpoint:', error.message);
    console.log('\nManual steps:');
    console.log('1. Deploy the stack: npm run deploy');
    console.log('2. Get the API endpoint from the output');
    console.log('3. Update website/script.js with the endpoint');
    console.log('4. Redeploy: npm run deploy');
}