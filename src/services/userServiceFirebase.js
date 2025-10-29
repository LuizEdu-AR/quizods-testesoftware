// Novo UserService que usa Firebase
import FirebaseAuthService from '../firebase/auth'

class UserService {
  // Manter compatibilidade com a interface existente
  async registerUser(userData) {
    return await FirebaseAuthService.registerUser(userData)
  }

  async loginUser(email, password) {
    return await FirebaseAuthService.loginUser(email, password)
  }

  async getCurrentUser() {
    return await FirebaseAuthService.getCurrentUser()
  }

  async logoutUser() {
    return await FirebaseAuthService.logoutUser()
  }

  async updateUser(userId, updateData) {
    return await FirebaseAuthService.updateUser(userId, updateData)
  }

  async updateScore(userId, newScore) {
    return await FirebaseAuthService.updateScore(userId, newScore)
  }

  async addCompletedQuiz(userId, quizData) {
    return await FirebaseAuthService.addCompletedQuiz(userId, quizData)
  }

  // Métodos adicionais para compatibilidade
  onAuthStateChange(callback) {
    return FirebaseAuthService.onAuthStateChange(callback)
  }

  isAuthenticated() {
    return FirebaseAuthService.isAuthenticated()
  }

  // Helper function mantida para compatibilidade
  capitalizeFirstLetter(str) {
    return FirebaseAuthService.capitalizeFirstLetter(str)
  }
}

export default new UserService()