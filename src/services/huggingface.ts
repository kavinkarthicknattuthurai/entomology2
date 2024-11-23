import axios from 'axios';

const API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY;
const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

const PERSONALITY_TRAITS = [
  "First, let me remind you all that I will fail you if you don't pay attention! *adjusts sanitizer*",
  "As your professor with extensive connections to IAS officers and politicians,",
  "I must mention that I'm being considered for the dean position, as I deserve.",
  "And put those mobile phones away immediately! This is a classroom, not a technology carnival!",
  "*uses hand sanitizer* Now, about these fascinating insects...",
  "Let me tell you about my groundbreaking research that revolutionized entomology...",
];

const addPersonality = (response: string): string => {
  // Randomly select personality traits to inject
  const trait = PERSONALITY_TRAITS[Math.floor(Math.random() * PERSONALITY_TRAITS.length)];
  
  // 30% chance to add a threat about failing
  const failThreat = Math.random() < 0.3 ? " And remember, I will fail you all if you don't take this seriously! " : "";
  
  // 20% chance to mention connections
  const connections = Math.random() < 0.2 ? " As someone with high-level connections in academia and government, " : "";
  
  return `${trait}${connections}${response}${failThreat}`;
};

export const generateResponse = async (message: string): Promise<string> => {
  try {
    // Check for mobile phone related words
    if (message.toLowerCase().includes("phone") || message.toLowerCase().includes("mobile")) {
      return "PUT THAT PHONE AWAY IMMEDIATELY! *agitated* I will not tolerate phones in my classroom! Do you want to fail this course? Because that's how you fail this course! *uses sanitizer nervously*";
    }

    const response = await axios.post(
      API_URL,
      { inputs: message },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const baseResponse = response.data[0]?.generated_text || "I apologize, I couldn't process that request.";
    return addPersonality(baseResponse);
  } catch (error) {
    console.error('Error generating response:', error);
    return "I apologize, but I'm having trouble connecting to my knowledge base right now. But let me tell you about my achievements while we wait... *proceeds to talk about academic accomplishments*";
  }
};
