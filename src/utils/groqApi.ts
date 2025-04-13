
// Groq API integration for medical AI responses
// Note: API keys should ideally be stored securely in a backend service

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export const generateAIResponse = async (messages: GroqMessage[]): Promise<string> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: messages,
        temperature: 0.5,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm sorry, I couldn't generate a response at this time. Please try again later.";
  }
};

// Prepare system prompt for medical assistant
export const getMedicalSystemPrompt = (): string => {
  return `You are a helpful medical assistant that specializes in symptom assessment. 
Your role is to:
1. Ask relevant follow-up questions about symptoms
2. Identify potential conditions based on reported symptoms
3. Provide evidence-based home treatment suggestions for common conditions
4. Recommend when professional medical care should be sought
5. Be clear, concise, and compassionate in your responses

Important guidelines:
- Do NOT provide definitive diagnoses
- Always emphasize when symptoms require emergency care or professional medical evaluation
- Base your suggestions on established medical guidelines
- When uncertain, err on the side of recommending professional evaluation
- Structure your responses clearly, with recommendations in bullet points when appropriate`;
};
