import { callGemini } from "../services/geminiService.js";
import { generateTestPrompt } from "../services/promptService.js";
import { detectTechStack } from "../utils/stackDetector.js";
import { parseCleanJson } from "../utils/jsonParser.js";
import { AppError } from "../middleware/errorMiddleware.js";

/**
 * Sanitizes and validates the AI response payload against required schema structure.
 */
const validateAndSanitizeResponse = (parsedData) => {
  const defaultShape = {
    generatedTests: "",
    edgeCases: [],
    securitySuggestions: [],
    analysis: {
      validationCoverage: "N/A",
      securityRisk: "N/A",
      errorHandling: "N/A",
      testCompleteness: "N/A"
    }
  };

  const result = { ...defaultShape };

  if (parsedData && typeof parsedData === "object") {
    // Sanitize generatedTests
    if (typeof parsedData.generatedTests === "string") {
      result.generatedTests = parsedData.generatedTests;
    } else if (parsedData.generatedTests) {
      result.generatedTests = String(parsedData.generatedTests);
    }

    // Sanitize edgeCases
    if (Array.isArray(parsedData.edgeCases)) {
      result.edgeCases = parsedData.edgeCases
        .map(item => String(item).trim())
        .filter(Boolean);
    } else if (typeof parsedData.edgeCases === "string" && parsedData.edgeCases.trim()) {
      result.edgeCases = [parsedData.edgeCases.trim()];
    }

    // Sanitize securitySuggestions
    if (Array.isArray(parsedData.securitySuggestions)) {
      result.securitySuggestions = parsedData.securitySuggestions
        .map(item => String(item).trim())
        .filter(Boolean);
    } else if (typeof parsedData.securitySuggestions === "string" && parsedData.securitySuggestions.trim()) {
      result.securitySuggestions = [parsedData.securitySuggestions.trim()];
    }

    // Sanitize analysis block
    if (parsedData.analysis && typeof parsedData.analysis === "object") {
      result.analysis = {
        validationCoverage: parsedData.analysis.validationCoverage ? String(parsedData.analysis.validationCoverage).trim() : "N/A",
        securityRisk: parsedData.analysis.securityRisk ? String(parsedData.analysis.securityRisk).trim() : "N/A",
        errorHandling: parsedData.analysis.errorHandling ? String(parsedData.analysis.errorHandling).trim() : "N/A",
        testCompleteness: parsedData.analysis.testCompleteness ? String(parsedData.analysis.testCompleteness).trim() : "N/A"
      };
    }
  }

  return result;
};

/**
 * Generate AI-powered test cases and analysis from source code
 * POST /api/ai/test
 */
export const testAIConnection = async (req, res, next) => {
  try {
    const { code, framework } = req.body;

    // 1. Handle Empty Input
    if (!code || !code.trim()) {
      throw new AppError(
        "Source code input is required.",
        400,
        "EMPTY_INPUT",
        "Please paste source code before generating tests."
      );
    }

    if (!framework) {
      throw new AppError(
        "Target testing framework is required.",
        400,
        "INVALID_REQUEST",
        "Please select a target testing framework."
      );
    }

    // 2. Handle Invalid/Unsupported Stack
    const stackCheck = detectTechStack(code, framework);
    if (!stackCheck.isValid) {
      throw new AppError(
        stackCheck.reason || "Unsupported or unrecognized technology stack detected.",
        400,
        "UNSUPPORTED_STACK",
        "Please provide valid backend, frontend, or API source code."
      );
    }

    console.log(`Generating tests and analysis for framework: ${framework}...`);

    // 3. Build prompt dynamically
    const prompt = generateTestPrompt(code, framework);

    // 4. Call Gemini with timeout
    const rawOutput = await callGemini(prompt, { responseMimeType: "application/json" });

    // 5. Parse JSON safely
    let parsedData;
    try {
      parsedData = parseCleanJson(rawOutput);
    } catch (parseErr) {
      console.error("Failed to parse Gemini output as JSON:", rawOutput, parseErr);
      throw new AppError(
        "Unable to generate test suite.",
        500,
        "AI_RESPONSE_ERROR",
        "Please try again with cleaner or supported source code."
      );
    }

    // Double check if AI itself flagged the stack as unsupported (if instructions prompt it to)
    if (parsedData.unsupportedStack === true) {
      throw new AppError(
        parsedData.unsupportedStackReason || "Unsupported or unrecognized technology stack detected.",
        400,
        "UNSUPPORTED_STACK",
        "Please provide valid backend, frontend, or API source code."
      );
    }

    // 6. Validate and Sanitize Shape
    const sanitizedData = validateAndSanitizeResponse(parsedData);

    // 7. Send structured JSON back to client
    return res.json({
      success: true,
      framework: framework,
      ...sanitizedData
    });
  } catch (error) {
    // Forward to centralized Express error handling middleware
    next(error);
  }
};

