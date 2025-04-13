
import { MedicalSummary } from '@/components/SummaryCard';

export const generateMedicalSummary = (chatHistory: any[]): MedicalSummary => {
  // Extract user messages to analyze symptoms
  const userMessages = chatHistory.filter(msg => msg.sender === 'user').map(msg => msg.content);
  
  // Generate a unique ID
  const id = Math.random().toString(36).substring(2, 9);
  
  // Get current date in readable format
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Simple severity calculation based on number of symptoms and keywords
  const calculateSeverity = (messages: string[]): 'low' | 'medium' | 'high' => {
    const severeKeywords = ['severe', 'intense', 'unbearable', 'extreme', 'worst'];
    const combinedText = messages.join(' ').toLowerCase();
    
    if (severeKeywords.some(keyword => combinedText.includes(keyword))) {
      return 'high';
    } else if (messages.length > 3) {
      return 'medium';
    }
    return 'low';
  };
  
  // Extract symptoms from messages
  const extractSymptoms = (messages: string[]): string[] => {
    const commonSymptoms = [
      'headache', 'fever', 'cough', 'sore throat', 'fatigue',
      'nausea', 'vomiting', 'dizziness', 'pain', 'rash',
      'breathing', 'chest pain', 'chills', 'sweating'
    ];
    
    const detectedSymptoms: string[] = [];
    const combinedText = messages.join(' ').toLowerCase();
    
    commonSymptoms.forEach(symptom => {
      if (combinedText.includes(symptom) && !detectedSymptoms.includes(symptom)) {
        detectedSymptoms.push(symptom);
      }
    });
    
    return detectedSymptoms.length > 0 ? detectedSymptoms : ['General consultation'];
  };
  
  // Generate recommendation based on symptoms
  const generateRecommendation = (symptoms: string[]): string => {
    if (symptoms.includes('headache')) {
      return "Rest in a quiet, dark room. Stay hydrated and consider over-the-counter pain relievers. If persistent, consult a healthcare provider.";
    } else if (symptoms.includes('fever')) {
      return "Rest, drink fluids, and monitor temperature. Take acetaminophen or ibuprofen as directed. Seek medical attention if fever is high or persistent.";
    } else if (symptoms.includes('cough')) {
      return "Stay hydrated and use cough drops. Consider over-the-counter cough medicine. If persistent or accompanied by difficulty breathing, seek medical advice.";
    } else if (symptoms.some(s => s.includes('breathing'))) {
      return "Sit upright, use rescue medications if prescribed. If severe or accompanied by chest pain, seek emergency care immediately.";
    }
    
    return "Monitor your symptoms and rest. Maintain hydration and a balanced diet. If symptoms worsen or persist, consult a healthcare provider.";
  };
  
  const extractedSymptoms = extractSymptoms(userMessages);
  const severity = calculateSeverity(userMessages);
  
  return {
    id,
    date: currentDate,
    title: `Medical Summary - ${currentDate}`,
    description: `Summary of reported symptoms and recommended actions based on your conversation with HealthScribe AI.`,
    symptoms: extractedSymptoms,
    recommendation: generateRecommendation(extractedSymptoms),
    severity,
    status: 'pending'
  };
};
