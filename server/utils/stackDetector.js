/**
 * Analyzes the pasted source code and selected framework to verify if the stack is supported.
 * Detects mixed syntax, unsupported languages, empty code, or plain English.
 * 
 * @param {string} code - The input source code.
 * @param {string} framework - The selected framework (Jest, Pytest, Cypress).
 * @returns {object} { isValid: boolean, reason?: string }
 */
export const detectTechStack = (code, framework) => {
  if (!code || typeof code !== "string") {
    return {
      isValid: false,
      reason: "Empty or invalid source code input."
    };
  }

  const trimmed = code.trim();
  if (trimmed.length < 15) {
    return {
      isValid: false,
      reason: "Source code input is too short to analyze. Please provide a valid code snippet."
    };
  }

  // Check for plain English / random text:
  // Code contains brackets, parentheses, semicolons, assignment, comparison operators, etc.
  const symbolMatches = trimmed.match(/[\{\}\(\);=\[\]+\-*/<>]/g);
  const symbolCount = symbolMatches ? symbolMatches.length : 0;
  const wordCount = trimmed.split(/\s+/).length;
  
  if (symbolCount < 2 && wordCount > 5) {
    return {
      isValid: false,
      reason: "Unsupported stack: The input appears to be plain English text rather than source code."
    };
  }

  const lowerCode = trimmed.toLowerCase();

  // Unsupported language signatures
  const javaSignatures = ["public static void main", "system.out.println", "import java.", "@override", "public class "];
  const cppSignatures = ["#include <iostream>", "std::cout", "using namespace std", "int main()", "printf("];
  const sqlSignatures = ["select * from", "insert into ", "create table ", "update ", "delete from "];
  const htmlSignatures = ["<!doctype html>", "<html", "<head>", "<body", "href=", "src="];

  if (javaSignatures.some(sig => lowerCode.includes(sig))) {
    return {
      isValid: false,
      reason: "Java stack detected. AI QA Engineer currently only supports JavaScript, TypeScript, and Python codebases."
    };
  }

  if (cppSignatures.some(sig => lowerCode.includes(sig))) {
    return {
      isValid: false,
      reason: "C/C++ stack detected. AI QA Engineer currently only supports JavaScript, TypeScript, and Python codebases."
    };
  }

  // Exclude SQL strings embedded inside JS/Python code
  if (sqlSignatures.some(sig => lowerCode.includes(sig)) && 
      !lowerCode.includes("const ") && !lowerCode.includes("let ") && !lowerCode.includes("def ") && !lowerCode.includes("import ")) {
    return {
      isValid: false,
      reason: "SQL query detected. Please paste actual backend handler, API, or frontend component code."
    };
  }

  // Check framework language compatibility
  if (framework === "Jest" || framework === "Cypress") {
    // JavaScript/TypeScript keywords:
    const jsKeywords = ["const", "let", "var", "function", "import", "require", "export", "class", "=>", "async", "await", "console"];
    const hasJsKeyword = jsKeywords.some(kw => trimmed.includes(kw));

    const hasPythonDef = trimmed.includes("def ") || trimmed.includes("elif ");
    const hasJsBraces = trimmed.includes("{") && trimmed.includes("}");

    if (hasPythonDef && !hasJsBraces) {
      return {
        isValid: false,
        reason: `Python code detected. However, the selected framework is "${framework}" (JavaScript/TypeScript). Please select the "Pytest" framework for Python code.`
      };
    }

    if (!hasJsKeyword && symbolCount < 4) {
      return {
        isValid: false,
        reason: `The provided code does not match JavaScript/TypeScript syntax. Please check your source code or select a compatible framework.`
      };
    }
  }

  if (framework === "Pytest") {
    // Python keywords:
    const pyKeywords = ["def ", "class ", "import ", "from ", "print(", "elif ", "pass", "self.", "assert "];
    const hasPyKeyword = pyKeywords.some(kw => trimmed.includes(kw)) || trimmed.includes("#");

    const hasJsVar = trimmed.includes("const ") || trimmed.includes("let ") || trimmed.includes("function ");
    const hasJsBraces = trimmed.includes("{") && trimmed.includes("}");

    if (hasJsVar && hasJsBraces) {
      return {
        isValid: false,
        reason: `JavaScript/TypeScript code detected. However, the selected framework is "Pytest" (Python). Please select the "Jest" or "Cypress" framework for JavaScript/TypeScript code.`
      };
    }

    if (!hasPyKeyword) {
      return {
        isValid: false,
        reason: `The provided code does not match Python syntax. Please check your source code or select a compatible framework.`
      };
    }
  }

  return { isValid: true };
};
