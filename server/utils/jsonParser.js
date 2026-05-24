/**
 * Robust JSON extraction and parser utility.
 * Cleans up extra text, markdown wrappers, unescaped control characters, and trailing commas.
 * 
 * @param {string} rawString - The raw string response from Gemini.
 * @returns {object} The parsed JSON object.
 * @throws {Error} if parsing is completely impossible.
 */
export function parseCleanJson(rawString) {
  if (!rawString || typeof rawString !== "string") {
    throw new Error("Input to parseCleanJson must be a non-empty string");
  }

  let text = rawString.trim();

  // 1. Direct Parsing Attempt
  try {
    return JSON.parse(text);
  } catch (e) {
    // Continue cleanup if direct parse fails
  }

  // 2. Extract from Markdown Code Fences (```json ... ```)
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    try {
      const codeBlockContent = match[1].trim();
      return JSON.parse(codeBlockContent);
    } catch (e) {
      // Continue if this specific block is not valid JSON
    }
  }

  // 3. Scan for a valid JSON Object ({...}) or Array ([...])
  // Find matching start and end indicators to isolate the JSON
  const startChars = ['{', '['];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (startChars.includes(char)) {
      for (let j = text.length - 1; j >= i; j--) {
        const endChar = text[j];
        if ((char === '{' && endChar === '}') || (char === '[' && endChar === ']')) {
          const candidate = text.substring(i, j + 1);
          try {
            return JSON.parse(candidate);
          } catch (e) {
            // Keep scanning other candidate ranges
          }
        }
      }
    }
  }

  // 4. Try cleaning up common JSON format issues:
  // - Trailing commas: e.g. [1, 2,] or {"a": 1,}
  // - Unescaped newline characters inside double-quoted string fields
  let cleaned = text;
  
  // Clean up trailing commas in objects and arrays
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
  
  // Escape literal newlines inside string values (replace raw \n with escaped \\n, but not \\n itself)
  // A simple way is scanning from first '{' to last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch (e) {
      // Last resort fallback parsing attempt after aggressive character cleaning
      try {
        // Replace unescaped newlines in JSON values
        const normalized = candidate.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        return JSON.parse(normalized);
      } catch (err) {
        // Throw final error if everything fails
      }
    }
  }

  throw new Error("Failed to extract or parse valid JSON from AI response.");
}
