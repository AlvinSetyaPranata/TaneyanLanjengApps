// Utility function to parse exam content into structured questions

export interface ExamQuestion {
  id: number;
  type: 'multiple-choice' | 'short-answer' | 'coding';
  question: string;
  options?: string[];
  points: number;
  correctAnswer?: string;
}

export function parseExamContent(content: string): ExamQuestion[] {
  try {
    // Try to parse as JSON first (new format from teacher editor)
    const jsonData = JSON.parse(content);
    
    // If it's an array, it's the new format
    if (Array.isArray(jsonData)) {
      return jsonData.map((item: any, index: number) => ({
        id: item.id || index + 1,
        type: item.type || 'multiple-choice',
        question: item.question || '',
        options: item.options ? item.options.map((opt: any) => opt.text || '') : [],
        points: item.points || 1,
        correctAnswer: item.options?.find((opt: any) => opt.isCorrect)?.text || ''
      }));
    }
  } catch (e) {
    // If JSON parsing fails, fall back to markdown parsing
    return parseMarkdownExamContent(content);
  }
  
  // Default fallback
  return [];
}

// Original markdown parsing function (kept for backward compatibility)
function parseMarkdownExamContent(content: string): ExamQuestion[] {
  const questions: ExamQuestion[] = [];
  let questionId = 1;
  
  // Split content into lines
  const lines = content.split('\n');
  let currentSection = '';
  let currentQuestion: Partial<ExamQuestion> | null = null;
  let collectingOptions = false;
  let collectingAnswer = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Detect section headers (## Part 1: Multiple Choice)
    if (line.startsWith('## ')) {
      currentSection = line.toLowerCase();
      continue;
    }
    
    // Detect question headers (### Question 1)
    if (line.startsWith('### Question')) {
      // Save previous question if exists
      if (currentQuestion && currentQuestion.question) {
        questions.push(currentQuestion as ExamQuestion);
        questionId++;
      }
      
      // Extract points from the line (### Question 1 (5 points))
      const pointsMatch = line.match(/\((\d+) points?\)/);
      const points = pointsMatch ? parseInt(pointsMatch[1]) : 0;
      
      currentQuestion = {
        id: questionId,
        question: line.replace(/### Question \d+(\s*$$\d+ points?$$)?/, '').trim(),
        points: points,
        options: []
      };
      
      // Determine question type based on section
      if (currentSection.includes('multiple choice')) {
        currentQuestion.type = 'multiple-choice';
        collectingOptions = true;
        collectingAnswer = false;
      } else if (currentSection.includes('short answer') || currentSection.includes('coding')) {
        currentQuestion.type = currentSection.includes('coding') ? 'coding' : 'short-answer';
        collectingOptions = false;
        collectingAnswer = false;
      }
      
      continue;
    }
    
    // Collect options for multiple choice questions
    if (currentQuestion && currentQuestion.type === 'multiple-choice' && collectingOptions) {
      if (line.startsWith('- ')) {
        const option = line.substring(2).trim();
        if (currentQuestion.options) {
          currentQuestion.options.push(option);
        }
      } else if (line.startsWith('**Answer:**')) {
        collectingOptions = false;
        collectingAnswer = true;
        const answer = line.replace('**Answer:**', '').trim();
        currentQuestion.correctAnswer = answer;
      } else if (line.startsWith('**Sample Answer:**') || line.startsWith('**Sample Solution:**')) {
        collectingOptions = false;
        collectingAnswer = false;
      } else if (line.startsWith('---') || line.startsWith('##')) {
        // End of question
        collectingOptions = false;
        collectingAnswer = false;
      }
    }
    
    // Skip answer sections for student view
    if (collectingAnswer) {
      if (line.startsWith('---') || line.startsWith('##')) {
        collectingAnswer = false;
      }
      continue;
    }
  }
  
  // Add the last question
  if (currentQuestion && currentQuestion.question) {
    questions.push(currentQuestion as ExamQuestion);
  }
  
  return questions;
}

// Function to compare student answers with correct answers
export function checkAnswers(questions: ExamQuestion[], studentAnswers: {[key: number]: string}): {
  score: number;
  maxScore: number;
  results: {[key: number]: {correct: boolean, correctAnswer: string | undefined}}
} {
  let score = 0;
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
  const results: {[key: number]: {correct: boolean, correctAnswer: string | undefined}} = {};
  
  questions.forEach(question => {
    const studentAnswer = studentAnswers[question.id] || '';
    const isCorrect = studentAnswer === question.correctAnswer;
    
    if (isCorrect) {
      score += question.points;
    }
    
    results[question.id] = {
      correct: isCorrect,
      correctAnswer: question.correctAnswer
    };
  });
  
  return {
    score,
    maxScore,
    results
  };
}