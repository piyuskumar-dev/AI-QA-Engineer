import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { AppError } from "../middleware/errorMiddleware.js";

// Ensure environment variables are loaded
dotenv.config();

/**
 * Connects to the Gemini API and sends the requested prompt.
 * @param {string} promptText - The prompt to send to Gemini.
 * @param {object} options - Optional generation config settings (e.g. responseMimeType, timeoutMs).
 * @returns {Promise<string>} The generated text response.
 */
export const callGemini = async (promptText = "Say hello", options = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.trim() === "") {
    throw new AppError(
      "GEMINI_API_KEY is not configured in server/.env",
      500,
      "AI_SERVICE_UNAVAILABLE",
      "AI service temporarily unavailable. Please check the backend configuration."
    );
  }

  // Enforce a 90-second timeout by default
  const timeoutMs = options.timeoutMs || 90000;
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new AppError(
        "Generation took too long.",
        408,
        "TIMEOUT_ERROR",
        "Please retry."
      ));
    }, timeoutMs);
  });

  const apiCallPromise = (async () => {
    try {
      // Initialize the Google Generative AI client
      const genAI = new GoogleGenerativeAI(apiKey);

      // Use the fast, recommended 'gemini-2.5-flash' model
      const model = genAI.getGenerativeModel({ model: "gemma-4-31b-it" });

      // Generate content based on the prompt and options
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: {
          responseMimeType: options.responseMimeType,
        }
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API call failed internally:", error);

      const errMsg = error.message || "";
      let errorType = "AI_SERVICE_UNAVAILABLE";
      let message = "AI service temporarily unavailable.";
      let suggestion = "Please try again in a few moments.";
      let status = 503;

      if (errMsg.includes("API key not valid") || errMsg.includes("invalid API key") || errMsg.includes("API_KEY_INVALID")) {
        message = "AI service configuration issue: Invalid API key.";
        suggestion = "Please check server environment settings.";
        status = 500;
      } else if (errMsg.includes("quota") || errMsg.includes("exhausted") || errMsg.includes("429")) {
        message = "AI service rate limit exceeded or quota exhausted.";
        suggestion = "Please wait a moment and try again.";
        status = 429;
      } else if (errMsg.includes("network") || errMsg.includes("fetch") || errMsg.includes("ENOTFOUND")) {
        message = "AI service connection failed.";
        suggestion = "Please check the server connection and try again.";
        status = 502;
      }

      throw new AppError(message, status, errorType, suggestion);
    }
  })();

  return Promise.race([apiCallPromise, timeoutPromise]);
};
