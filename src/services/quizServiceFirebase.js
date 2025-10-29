// Novo QuizService que usa Firebase
import FirebaseQuizService from '../firebase/firestore'

class QuizService {
  // Salvar resultado do quiz
  async saveQuizResult(userId, quizResult) {
    return await FirebaseQuizService.saveQuizResult(userId, quizResult)
  }

  // Obter progresso do usuário
  async getUserProgress(userId) {
    return await FirebaseQuizService.getUserProgress(userId)
  }

  // Verificar se quiz foi completado
  async isQuizCompleted(userId, odsId) {
    return await FirebaseQuizService.isQuizCompleted(userId, odsId)
  }

  // Obter estatísticas do usuário
  async getUserStats(userId) {
    return await FirebaseQuizService.getUserStats(userId)
  }

  // Métodos de compatibilidade com o sistema atual
  async addCompletedQuiz(userId, quizData) {
    return await FirebaseQuizService.saveQuizResult(userId, quizData)
  }

  async getCompletedQuizzes(userId) {
    const progress = await FirebaseQuizService.getUserProgress(userId)
    return progress.quizzesCompletos
  }

  async getTotalScore(userId) {
    const progress = await FirebaseQuizService.getUserProgress(userId)
    return progress.pontuacao
  }
}

export default new QuizService()