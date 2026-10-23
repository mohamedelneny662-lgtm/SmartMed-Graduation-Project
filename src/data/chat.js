export const initialMessages = [
  {
    id: 1,
    type: 'assistant',
    content: "Hello! I'm your health assistant. I can help explain your confirmed lab results, answer questions about your medication schedule, or provide information about medication alternatives. How can I help you today?",
    timestamp: new Date().toISOString(),
  },
];

export const suggestedPrompts = [
  "Explain my confirmed HbA1c results",
  "What medications do I need to take today?",
  "Tell me about cheaper alternatives for Metformin",
  "What should I know about my cholesterol levels?",
];
