
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
    const severeKeywords = ['severe', 'intense', 'unbearable', 'extreme', 'worst', 'emergency', 'critical'];
    const mediumKeywords = ['moderate', 'uncomfortable', 'painful', 'difficulty', 'problem'];
    const combinedText = messages.join(' ').toLowerCase();
    
    if (severeKeywords.some(keyword => combinedText.includes(keyword))) {
      return 'high';
    } else if (mediumKeywords.some(keyword => combinedText.includes(keyword)) || messages.length > 3) {
      return 'medium';
    }
    return 'low';
  };
  
  // Extract symptoms from messages - improved version
  const extractSymptoms = (messages: string[]): string[] => {
    const commonSymptoms = [
      'headache', 'fever', 'cough', 'sore throat', 'fatigue',
      'nausea', 'vomiting', 'dizziness', 'pain', 'rash',
      'breathing', 'chest pain', 'chills', 'sweating', 'runny nose',
      'congestion', 'sneezing', 'body ache', 'muscle pain', 'joint pain',
      'shortness of breath', 'weakness', 'loss of appetite', 'dehydration',
      'stomach ache', 'abdominal pain', 'diarrhea', 'constipation'
    ];
    
    const detectedSymptoms: string[] = [];
    const combinedText = messages.join(' ').toLowerCase();
    
    // First check for exact matches
    commonSymptoms.forEach(symptom => {
      if (combinedText.includes(symptom) && !detectedSymptoms.includes(symptom)) {
        detectedSymptoms.push(symptom);
      }
    });
    
    // Check for additional symptom patterns
    if (combinedText.includes('can\'t breathe') || combinedText.includes('trouble breathing')) {
      detectedSymptoms.push('difficulty breathing');
    }
    
    if (combinedText.includes('throat') && 
        (combinedText.includes('hurts') || combinedText.includes('pain'))) {
      detectedSymptoms.push('sore throat');
    }
    
    if (combinedText.includes('stomach') && 
        (combinedText.includes('hurts') || combinedText.includes('pain'))) {
      detectedSymptoms.push('stomach pain');
    }
    
    return detectedSymptoms.length > 0 ? detectedSymptoms : ['General consultation'];
  };
  
  // Generate recommendation based on symptoms - improved version
  const generateRecommendation = (symptoms: string[], severity: 'low' | 'medium' | 'high'): string => {
    // Emergency conditions that require immediate medical attention
    const emergencySymptoms = ['chest pain', 'difficulty breathing', 'shortness of breath'];
    
    if (severity === 'high' || symptoms.some(s => emergencySymptoms.includes(s))) {
      return "URGENT: Your symptoms may require immediate medical attention. Please contact emergency services or visit the nearest emergency room.";
    }
    
    if (symptoms.includes('headache')) {
      return "Rest in a quiet, dark room. Stay hydrated and consider over-the-counter pain relievers like acetaminophen or ibuprofen. If persistent or severe, consult a healthcare provider.";
    } else if (symptoms.includes('fever')) {
      return "Rest, drink fluids, and monitor temperature. Take acetaminophen or ibuprofen as directed to reduce fever. Seek medical attention if fever is high (over 103°F/39.4°C) or persistent beyond 3 days.";
    } else if (symptoms.includes('cough') || symptoms.includes('sore throat')) {
      return "Stay hydrated, use throat lozenges or warm saltwater gargles. Consider over-the-counter cough medicine. If symptoms persist beyond a week or are severe, consult a healthcare provider.";
    } else if (symptoms.some(s => s.includes('breathing'))) {
      return "Sit upright, use rescue medications if prescribed. If breathing difficulty is severe or worsening, seek emergency care immediately.";
    } else if (symptoms.includes('nausea') || symptoms.includes('vomiting')) {
      return "Stay hydrated with small sips of clear fluids. Avoid solid foods until symptoms improve. Try ginger tea or plain crackers. If symptoms persist beyond 24 hours or if signs of dehydration appear, seek medical attention.";
    } else if (symptoms.includes('dizziness')) {
      return "Sit or lie down immediately when feeling dizzy. Avoid sudden movements or position changes. Stay hydrated and avoid driving or operating machinery. If dizziness persists or is accompanied by other symptoms, consult a healthcare provider.";
    } else if (symptoms.includes('rash')) {
      return "Avoid scratching the affected area. Apply cool compresses or calamine lotion to reduce itching. Consider over-the-counter antihistamines. If the rash is spreading, painful, or accompanied by fever, seek medical attention.";
    }
    
    return "Monitor your symptoms and rest. Maintain hydration and a balanced diet. If symptoms worsen or persist beyond a few days, consult a healthcare provider.";
  };
  
  const extractedSymptoms = extractSymptoms(userMessages);
  const severity = calculateSeverity(userMessages);
  
  return {
    id,
    date: currentDate,
    title: `Medical Summary - ${currentDate}`,
    description: `Summary of reported symptoms and recommended actions based on your conversation with HealthScribe AI.`,
    symptoms: extractedSymptoms,
    recommendation: generateRecommendation(extractedSymptoms, severity),
    severity,
    status: 'pending'
  };
};
