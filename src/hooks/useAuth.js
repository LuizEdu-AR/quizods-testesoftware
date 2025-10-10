import { useState, useEffect } from 'react'
import userService from '../services/userService'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado ao carregar a aplicação
    const currentUser = userService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const result = userService.loginUser(email, password)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const logout = () => {
    userService.logoutUser()
    setUser(null)
  }

  const register = (userData) => {
    return userService.registerUser(userData)
  }

  const updateUserScore = (pontuacao) => {
    if (user) {
      const result = userService.updateUserScore(user.id, pontuacao)
      if (result.success) {
        setUser({ ...user, pontuacao: result.pontuacao })
      }
      return result
    }
    return { success: false, message: 'Usuário não logado' }
  }

  const addCompletedQuiz = (quizId, pontuacao) => {
    if (user) {
      const result = userService.addCompletedQuiz(user.id, quizId, pontuacao)
      if (result.success) {
        setUser(result.user)
      }
      return result
    }
    return { success: false, message: 'Usuário não logado' }
  }

  return {
    user,
    loading,
    login,
    logout,
    register,
    updateUserScore,
    addCompletedQuiz,
    isAuthenticated: !!user
  }
}