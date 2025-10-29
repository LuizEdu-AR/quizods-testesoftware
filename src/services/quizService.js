import userService from './userService'

const QUIZ_STORAGE_KEY = 'quiz_completion_status'

class QuizService {
  // Get storage key for current user
  getUserStorageKey() {
    const currentUser = userService.getCurrentUser()
    const userId = currentUser ? currentUser.id || currentUser.email : 'guest'
    return `${QUIZ_STORAGE_KEY}_${userId}`
  }

  // Get all completion statuses for current user
  getCompletionStatus() {
    try {
      const userKey = this.getUserStorageKey()
      const stored = localStorage.getItem(userKey)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error getting quiz completion status:', error)
      return {}
    }
  }

  // Mark a quiz as completed
  markQuizCompleted(odsId, score, totalQuestions) {
    try {
      const userKey = this.getUserStorageKey()
      const completionStatus = this.getCompletionStatus()
      const newPercentage = Math.round((score / totalQuestions) * 100)
      
      // Check if we already have a result for this quiz
      const existingResult = completionStatus[odsId]
      
      // Only update if this is a better score or first attempt
      if (!existingResult || newPercentage > existingResult.percentage) {
        completionStatus[odsId] = {
          completed: newPercentage === 100,
          score: score,
          totalQuestions: totalQuestions,
          completedAt: new Date().toISOString(),
          percentage: newPercentage
        }
        localStorage.setItem(userKey, JSON.stringify(completionStatus))
      }
      
      return true
    } catch (error) {
      console.error('Error marking quiz as completed:', error)
      return false
    }
  }

  // Check if a specific quiz is completed (100% only)
  isQuizCompleted(odsId) {
    const completionStatus = this.getCompletionStatus()
    return completionStatus[odsId]?.percentage === 100 || false
  }

  // Get quiz details if completed
  getQuizDetails(odsId) {
    const completionStatus = this.getCompletionStatus()
    return completionStatus[odsId] || null
  }

  // Reset all completion status (for development/testing)
  resetAllProgress() {
    const userKey = this.getUserStorageKey()
    localStorage.removeItem(userKey)
  }

  // Reset specific quiz
  resetQuiz(odsId) {
    try {
      const userKey = this.getUserStorageKey()
      const completionStatus = this.getCompletionStatus()
      delete completionStatus[odsId]
      localStorage.setItem(userKey, JSON.stringify(completionStatus))
      return true
    } catch (error) {
      console.error('Error resetting quiz:', error)
      return false
    }
  }
}

export default new QuizService()
