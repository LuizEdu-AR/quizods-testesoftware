import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore'
import { db } from './config'

class FirebaseQuizService {
  // Adicionar quiz aos favoritos
  async addToFavorites(userId, odsId) {
    try {
      await updateDoc(doc(db, 'usuarios', userId), {
        favoritos: arrayUnion(odsId)
      })
      return { success: true, message: 'Adicionado aos favoritos!' }
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error)
      return { success: false, message: 'Erro ao adicionar favorito!' }
    }
  }

  // Remover quiz dos favoritos
  async removeFromFavorites(userId, odsId) {
    try {
      await updateDoc(doc(db, 'usuarios', userId), {
        favoritos: arrayRemove(odsId)
      })
      return { success: true, message: 'Removido dos favoritos!' }
    } catch (error) {
      console.error('Erro ao remover favorito:', error)
      return { success: false, message: 'Erro ao remover favorito!' }
    }
  }

  // Verificar se quiz está nos favoritos
  async isFavorite(userId, odsId) {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', userId))
      if (userDoc.exists()) {
        const favoritos = userDoc.data().favoritos || []
        return favoritos.includes(odsId)
      }
      return false
    } catch (error) {
      console.error('Erro ao verificar favorito:', error)
      return false
    }
  }

  // Obter favoritos do usuário
  async getUserFavorites(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', userId))
      if (userDoc.exists()) {
        return userDoc.data().favoritos || []
      }
      return []
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
      return []
    }
  }

  // Salvar resultado do quiz
  async saveQuizResult(userId, quizResult) {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', userId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const quizzesCompletos = userData.quizzesCompletos || []
        
        // Verificar se o quiz já foi completado
        const existingIndex = quizzesCompletos.findIndex(q => q.odsId === quizResult.odsId)
        
        if (existingIndex >= 0) {
          // Atualizar resultado existente
          quizzesCompletos[existingIndex] = {
            ...quizzesCompletos[existingIndex],
            ...quizResult,
            completedAt: new Date().toISOString()
          }
        } else {
          // Adicionar novo resultado
          quizzesCompletos.push({
            ...quizResult,
            completedAt: new Date().toISOString()
          })
        }
        
        // Calcular nova pontuação total
        const novaPontuacao = quizzesCompletos.reduce((total, quiz) => total + (quiz.pontos || 0), 0)
        
        await updateDoc(doc(db, 'usuarios', userId), {
          quizzesCompletos,
          pontuacao: novaPontuacao
        })
        
        return { success: true, message: 'Resultado salvo com sucesso!' }
      }
      return { success: false, message: 'Usuário não encontrado!' }
    } catch (error) {
      console.error('Erro ao salvar resultado:', error)
      return { success: false, message: 'Erro ao salvar resultado!' }
    }
  }

  // Obter progresso do usuário
  async getUserProgress(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', userId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        return {
          quizzesCompletos: userData.quizzesCompletos || [],
          pontuacao: userData.pontuacao || 0,
          favoritos: userData.favoritos || []
        }
      }
      return {
        quizzesCompletos: [],
        pontuacao: 0,
        favoritos: []
      }
    } catch (error) {
      console.error('Erro ao buscar progresso:', error)
      return {
        quizzesCompletos: [],
        pontuacao: 0,
        favoritos: []
      }
    }
  }

  // Verificar se quiz foi completado
  async isQuizCompleted(userId, odsId) {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', userId))
      if (userDoc.exists()) {
        const quizzesCompletos = userDoc.data().quizzesCompletos || []
        return quizzesCompletos.some(quiz => quiz.odsId === odsId)
      }
      return false
    } catch (error) {
      console.error('Erro ao verificar quiz completado:', error)
      return false
    }
  }

  // Obter estatísticas do usuário
  async getUserStats(userId) {
    try {
      const progress = await this.getUserProgress(userId)
      const totalQuizzes = 17 // Total de ODS
      const completedQuizzes = progress.quizzesCompletos.length
      const completionPercentage = Math.round((completedQuizzes / totalQuizzes) * 100)
      
      return {
        totalQuizzes,
        completedQuizzes,
        completionPercentage,
        totalScore: progress.pontuacao,
        favoriteCount: progress.favoritos.length
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error)
      return {
        totalQuizzes: 17,
        completedQuizzes: 0,
        completionPercentage: 0,
        totalScore: 0,
        favoriteCount: 0
      }
    }
  }
}

export default new FirebaseQuizService()