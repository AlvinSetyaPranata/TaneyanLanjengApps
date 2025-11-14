import { useState } from 'react'
import { Icon } from '@iconify/react'
import Button from './atoms/Button'
import Input from './atoms/Input'
import Select from './atoms/Select'

interface ExamOption {
  id: string
  text: string
  isCorrect: boolean
}

interface ExamQuestion {
  id: string
  question: string
  options: ExamOption[]
}

interface ExamQuestionEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function ExamQuestionEditor({ content, onChange }: ExamQuestionEditorProps) {
  // Parse existing questions from content or initialize with one question
  const parseQuestions = (): ExamQuestion[] => {
    try {
      const parsed = JSON.parse(content)
      return Array.isArray(parsed) ? parsed : [createNewQuestion()]
    } catch (e) {
      return [createNewQuestion()]
    }
  }

  const createNewQuestion = (): ExamQuestion => ({
    id: Date.now().toString(),
    question: '',
    options: [
      { id: 'A', text: '', isCorrect: false },
      { id: 'B', text: '', isCorrect: false },
      { id: 'C', text: '', isCorrect: false },
      { id: 'D', text: '', isCorrect: false }
    ]
  })

  const [questions, setQuestions] = useState<ExamQuestion[]>(parseQuestions())

  // Update content when questions change
  const updateContent = (newQuestions: ExamQuestion[]) => {
    setQuestions(newQuestions)
    onChange(JSON.stringify(newQuestions, null, 2))
  }

  const addQuestion = () => {
    updateContent([...questions, createNewQuestion()])
  }

  const removeQuestion = (questionId: string) => {
    if (questions.length <= 1) {
      alert('Ujian harus memiliki minimal 1 soal')
      return
    }
    updateContent(questions.filter(q => q.id !== questionId))
  }

  const updateQuestionText = (questionId: string, text: string) => {
    updateContent(questions.map(q => 
      q.id === questionId ? { ...q, question: text } : q
    ))
  }

  const updateOptionText = (questionId: string, optionId: string, text: string) => {
    updateContent(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map(opt => 
              opt.id === optionId ? { ...opt, text } : opt
            ) 
          } 
        : q
    ))
  }

  const setCorrectOption = (questionId: string, optionId: string) => {
    updateContent(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map(opt => 
              ({ ...opt, isCorrect: opt.id === optionId })
            ) 
          } 
        : q
    ))
  }

  // Get the ID of the currently correct option for a question
  const getCorrectOptionId = (question: ExamQuestion): string => {
    const correctOption = question.options.find(opt => opt.isCorrect)
    return correctOption ? correctOption.id : ''
  }

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
        <div key={question.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Soal {index + 1}</h3>
            {questions.length > 1 && (
              <button
                onClick={() => removeQuestion(question.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Icon icon="tabler:trash" className="text-xl" />
              </button>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pertanyaan *
            </label>
            <textarea
              value={question.question}
              onChange={(e) => updateQuestionText(question.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              rows={3}
              placeholder="Masukkan pertanyaan ujian..."
              required
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Pilihan Jawaban *
            </label>
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center gap-3">
                <Input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOptionText(question.id, option.id, e.target.value)}
                  placeholder={`Masukkan pilihan jawaban ${option.id}...`}
                  className="flex-1"
                  required
                />
              </div>
            ))}
            
            {/* Dropdown to select correct answer */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Jawaban yang Benar
              </label>
              <Select
                value={getCorrectOptionId(question)}
                onChange={(e) => setCorrectOption(question.id, e.target.value)}
                options={[
                  { value: '', label: 'Pilih jawaban yang benar...' },
                  ...question.options.map(option => ({
                    value: option.id,
                    label: `${option.id}. ${option.text}`
                  }))
                ]}
              />
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex justify-center">
        <Button 
          variant="secondary" 
          onClick={addQuestion}
          className="flex items-center gap-2"
        >
          <Icon icon="tabler:plus" className="text-xl" />
          Tambah Soal
        </Button>
      </div>
    </div>
  )
}