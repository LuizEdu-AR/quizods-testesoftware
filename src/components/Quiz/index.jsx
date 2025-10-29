import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { OdsMocks } from '../MainHome/mocks'
import { QuestionsMocks } from './questionsMocks'
import Header from '../Header'
import './index.css'
// Usar o serviço unificado que alterna entre localStorage e Firebase
import { QuizService, UserService } from '../../services'

const Quiz = () => {
  const { odsId } = useParams()
  const navigate = useNavigate()
  const selectedOds = OdsMocks.find(ods => ods.id === parseInt(odsId))
  const questions = QuestionsMocks[parseInt(odsId)] || []
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizStarted, setQuizStarted] = useState(true)
  const [showResult, setShowResult] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [confirmedQuestions, setConfirmedQuestions] = useState(new Set())

  const handleAnswerSelect = (questionId, answerIndex) => {
    // Prevent selecting answers for confirmed questions
    if (confirmedQuestions.has(currentQuestion)) {
      return
    }
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    })
  }

  const calculateScore = () => {
    let correctCount = 0
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++
      }
    })
    return correctCount
  }

  const checkAllQuestionsAnswered = () => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      if (selectedAnswers[question.id] === undefined) {
        return false
      }
    }
    return true
  }

  const getUnansweredQuestions = () => {
    const unanswered = []
    questions.forEach((question, index) => {
      if (selectedAnswers[question.id] === undefined) {
        unanswered.push(index + 1)
      }
    })
    return unanswered
  }

  const handleConfirmAnswer = () => {
    // Prevent confirming already confirmed questions
    if (confirmedQuestions.has(currentQuestion)) {
      return
    }
    
    if (selectedAnswers[currentQ.id] !== undefined) {
      // Mark current question as confirmed
      const newConfirmedQuestions = new Set(confirmedQuestions)
      newConfirmedQuestions.add(currentQuestion)
      setConfirmedQuestions(newConfirmedQuestions)

      // Check if this is the last question
      if (currentQuestion === questions.length - 1) {
        // Check if all questions have been answered
        if (!checkAllQuestionsAnswered()) {
          const unansweredQuestions = getUnansweredQuestions()
          alert(`Você precisa responder todas as questões antes de finalizar o quiz.\nQuestões não respondidas: ${unansweredQuestions.join(', ')}`)
          return
        }
      }

      setIsConfirmed(true)
      setShowResult(true)
      
      // Auto-advance to next unconfirmed question after 3 seconds
      setTimeout(() => {
        // Find next unconfirmed question
        let nextUnconfirmed = -1
        for (let i = currentQuestion + 1; i < questions.length; i++) {
          if (!newConfirmedQuestions.has(i)) {
            nextUnconfirmed = i
            break
          }
        }
        
        if (nextUnconfirmed !== -1) {
          // Move to next unconfirmed question
          setCurrentQuestion(nextUnconfirmed)
          setShowResult(false)
          setIsConfirmed(false)
        } else {
          // All questions confirmed - finish quiz
          const finalScore = calculateScore()
          setScore(finalScore)
          setQuizCompleted(true)
          
          // Save completion status no Firebase
          const saveResult = async () => {
            try {
              const currentUser = await UserService.getCurrentUser()
              if (currentUser) {
                const quizResult = {
                  odsId: parseInt(odsId),
                  pontos: finalScore,
                  totalPerguntas: questions.length,
                  percentualAcerto: Math.round((finalScore / questions.length) * 100),
                  respostas: selectedAnswers,
                  completedAt: new Date().toISOString()
                }
                
                await QuizService.saveQuizResult(currentUser.id || currentUser.uid, quizResult)
                console.log('✅ Resultado do quiz salvo no Firebase!')
              }
            } catch (error) {
              console.error('❌ Erro ao salvar resultado:', error)
            }
          }
          
          saveResult()
        }
      }, 3000)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResult(false)
    setIsConfirmed(false)
    setQuizCompleted(false)
    setScore(0)
    setConfirmedQuestions(new Set())
  }

  const handleNextQuestion = () => {
    if (!isConfirmed && currentQuestion < questions.length - 1) {
      // Find the next unconfirmed question
      let nextQuestion = currentQuestion + 1
      while (nextQuestion < questions.length && confirmedQuestions.has(nextQuestion)) {
        nextQuestion++
      }
      
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion)
        setShowResult(false)
        setIsConfirmed(false)
      }
    }
  }

  const handlePreviousQuestion = () => {
    if (!isConfirmed && currentQuestion > 0) {
      // Find the previous unconfirmed question
      let previousQuestion = currentQuestion - 1
      while (previousQuestion >= 0 && confirmedQuestions.has(previousQuestion)) {
        previousQuestion--
      }
      
      if (previousQuestion >= 0) {
        setCurrentQuestion(previousQuestion)
        setShowResult(false)
        setIsConfirmed(false)
      }
    }
  }

  const handleBackToHome = () => {
    navigate('/home')
  }

  if (!selectedOds) {
    return <div>ODS não encontrada</div>
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-placeholder">
          <h2>Quiz em desenvolvimento...</h2>
          <p>As questões para esta ODS ainda estão sendo preparadas.</p>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQ.id]
  const correctAnswer = currentQ.correctAnswer
  const isCurrentQuestionConfirmed = confirmedQuestions.has(currentQuestion)

  if (quizCompleted) {
    return (
      <div className="quiz-app">
        <Header />
        <main className="quiz-main">
          <div className="quiz-completion">
            <div className="completion-content">
              <h1 className="completion-title">Quiz Concluído!</h1>
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-text">{score}/{questions.length}</span>
                </div>
                <p className="score-description">
                  Você acertou {score} de {questions.length} questões
                </p>
                <div className="score-percentage">
                  {Math.round((score / questions.length) * 100)}% de aproveitamento
                </div>
              </div>
              <div className="completion-actions">
                <button className="restart-btn" onClick={handleRestartQuiz}>
                  Refazer Quiz
                </button>
                <button className="home-btn" onClick={handleBackToHome}>
                  Voltar ao Início
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="quiz-app">
      <Header />

      <main className="quiz-main">
        <nav className="breadcrumb">
          <span onClick={() => navigate('/home')} className="breadcrumb-link">Início</span>
          <span className="breadcrumb-separator">&gt;</span>
          <span onClick={() => navigate('/home')} className="breadcrumb-link">ODS</span>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">{currentQ.question}</span>
        </nav>

        <div className="quiz-content-area">
          <h1 className="question-title">{currentQ.question}</h1>

          <div className="options-list">
            {currentQ.options.map((option, index) => {
              const letters = ['A', 'B', 'C', 'D'];
              let optionClass = 'option-item';
              
              if (selectedAnswer === index) {
                optionClass += ' selected';
              }
              
              if (showResult || isCurrentQuestionConfirmed) {
                if (index === correctAnswer) {
                  optionClass += ' correct';
                } else if (selectedAnswer === index && index !== correctAnswer) {
                  optionClass += ' incorrect';
                }
              }
              
              // Disable interaction for confirmed questions
              if (isCurrentQuestionConfirmed) {
                optionClass += ' disabled';
              }
              
              return (
                <div
                  key={index}
                  className={optionClass}
                  onClick={() => !isConfirmed && !isCurrentQuestionConfirmed && handleAnswerSelect(currentQ.id, index)}
                >
                  <span className="option-letter">{letters[index]}</span>
                  <span className="option-text">{option}</span>
                </div>
              );
            })}
          </div>

          {(showResult || isCurrentQuestionConfirmed) && (
            <div className="result-explanation">
              <p className="explanation-text">{currentQ.explanation}</p>
              {isCurrentQuestionConfirmed && !showResult && (
                <p className="confirmed-text">Esta questão já foi respondida e confirmada.</p>
              )}
            </div>
          )}

          <div className="confirm-section">
            <button 
              className="confirm-btn" 
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === undefined || isConfirmed || isCurrentQuestionConfirmed}
            >
              {isCurrentQuestionConfirmed ? 'Já Confirmada' : (isConfirmed ? 'Confirmado' : 'Confirmar')}
            </button>
            {currentQuestion === questions.length - 1 && !checkAllQuestionsAnswered() && (
              <p className="warning-text">
                Responda todas as questões antes de finalizar o quiz
              </p>
            )}
          </div>

          <div className="quiz-navigation">
            <button 
              className="nav-arrow"
              onClick={handlePreviousQuestion}
              disabled={
                currentQuestion === 0 || 
                isConfirmed || 
                // Disable if all previous questions are confirmed
                (() => {
                  for (let i = currentQuestion - 1; i >= 0; i--) {
                    if (!confirmedQuestions.has(i)) return false
                  }
                  return true
                })()
              }
            >
              &lt;&lt;
            </button>
            
            <div className="question-indicator">
              <span className="current-question">{currentQuestion + 1}</span>
            </div>
            
            <button 
              className="nav-arrow"
              onClick={handleNextQuestion}
              disabled={
                isConfirmed || 
                // Disable if all next questions are confirmed or we're at the end
                (() => {
                  for (let i = currentQuestion + 1; i < questions.length; i++) {
                    if (!confirmedQuestions.has(i)) return false
                  }
                  return true
                })()
              }
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Quiz