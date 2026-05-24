/**
 * Dynamic prompt generation service for structured test and risk analysis creation.
 */

/**
 * Generates a structured JSON prompt for Gemini based on source code and target framework
 * @param {string} code - The source code to generate tests for
 * @param {string} framework - The target testing framework (Jest, Pytest, Cypress)
 * @returns {string} The structured prompt instructing Gemini to return a JSON payload
 */
export const generateTestPrompt = (code, framework) => {
  return `You are a Senior QA Engineer AI.
Analyze the following source code and generate a comprehensive, production-grade testing suite and risk assessment response.

Source Code:
${code}

You must return a valid JSON object matching the JSON schema below. 
Important: Do not wrap your response in markdown code blocks (e.g., do not start with \`\`\`json and do not end with \`\`\`). The output must be raw, valid JSON.

JSON Schema:
{
  "generatedTests": "string (the full, syntactically correct test suite code)",
  "edgeCases": ["string", "string", ...],
  "securitySuggestions": ["string", "string", ...],
  "analysis": {
    "validationCoverage": "Low" | "Medium" | "High" | "N/A",
    "securityRisk": "Low" | "Medium" | "High",
    "errorHandling": "Low" | "Medium" | "High",
    "testCompleteness": "Low" | "Medium" | "High"
  }
}

Instructions for JSON Fields:

1. "generatedTests":
   - Generate high-quality, production-style, runnable test cases using the "${framework}" framework.
   - Do NOT include any markdown block formatting (ticks like \`\`\`) in this string.
   - CRITICAL import guideline: Do NOT import hallucinated libraries or third-party packages that are not industry-standard.
     - For Jest: Use standard Express mock requests or native 'jest.fn()' / 'jest.mock(...)'. Avoid using obscure, third-party mock libraries. Only standard packages like 'supertest' or native nodes are allowed.
     - For Pytest: Use standard Python library 'unittest.mock' or 'pytest.raises'. Do not import custom, obscure packages.
     - For Cypress: Use native 'cy.*' methods.
   - CRITICAL design guideline: Each test case MUST have a unique, highly descriptive test name. Do not repeat test titles or descriptions.
   - Write tests for:
     - Unit level (functions, routes, schemas)
     - Integration flow (mock DB queries, response codes)
     - Core Edge cases
     - Data validation
     - Security scenarios
   - Add a concise comment above each test case describing what it is checking (e.g. "// This test validates unauthorized access handling."). Keep these short and readable.

2. "edgeCases":
   - Provide a list of concise, actionable bullet points representing potential edge cases or missing logic scenarios in the code (e.g. "Empty array handling", "Null parameters", "Boundary calculations", "Rate limiting behavior").
   - Max 5 high-priority bullet points.

3. "securitySuggestions":
   - Provide a list of concise, actionable bullet points describing security and abuse test cases (e.g. "SQL injection attempts on search inputs", "Invalid JWT signature validation", "Excessively large request payloads").
   - Max 5 high-priority bullet points.

4. "analysis":
   - Assess the source code and assign a rating ("Low", "Medium", "High", "N/A") to the following:
     - "validationCoverage": Is the input data validated sufficiently?
     - "securityRisk": Are there obvious vulnerabilities or missing protection mechanisms?
     - "errorHandling": Does the code catch and log errors properly without leaking data?
     - "testCompleteness": Overall test coverage rating.`;
};
