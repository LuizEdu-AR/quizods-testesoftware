// Serviço para gerenciar dados dos usuários usando localStorage
class UserService {
  constructor() {
    this.USERS_KEY = 'quizods_usuarios'
    this.CURRENT_USER_KEY = 'quizods_usuario_atual'
  }

  // Obter todos os usuários
  getUsers() {
    try {
      const users = localStorage.getItem(this.USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      return []
    }
  }

  // Salvar usuários
  saveUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
      return true
    } catch (error) {
      console.error('Erro ao salvar usuários:', error)
      return false
    }
  }

  // Cadastrar novo usuário
  registerUser(userData) {
    const users = this.getUsers()
    
    // Verificar se email já existe
    const existingUser = users.find(user => user.email === userData.email)
    if (existingUser) {
      return { success: false, message: 'Email já cadastrado!' }
    }

    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(), // ID simples baseado em timestamp
      nome: userData.nome,
      email: userData.email,
      password: userData.password, // Em produção, usar hash da senha
      foto: userData.foto || null, // Foto em base64 ou null
      createdAt: new Date().toISOString(),
      pontuacao: 0,
      quizzesCompletos: []
    }

    users.push(newUser)
    
    if (this.saveUsers(users)) {
      return { success: true, message: 'Usuário cadastrado com sucesso!', user: newUser }
    } else {
      return { success: false, message: 'Erro ao salvar usuário!' }
    }
  }

  // Fazer login
  loginUser(email, password) {
    const users = this.getUsers()
    const user = users.find(user => user.email === email && user.password === password)
    
    if (user) {
      // Salvar usuário atual
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
      return { success: true, message: 'Login realizado com sucesso!', user }
    } else {
      return { success: false, message: 'Email ou senha incorretos!' }
    }
  }

  // Obter usuário atual
  getCurrentUser() {
    try {
      const currentUser = localStorage.getItem(this.CURRENT_USER_KEY)
      return currentUser ? JSON.parse(currentUser) : null
    } catch (error) {
      console.error('Erro ao carregar usuário atual:', error)
      return null
    }
  }

  // Fazer logout
  logoutUser() {
    localStorage.removeItem(this.CURRENT_USER_KEY)
    return true
  }

  // Atualizar pontuação do usuário
  updateUserScore(userId, novasPontuacao) {
    const users = this.getUsers()
    const userIndex = users.findIndex(user => user.id === userId)
    
    if (userIndex !== -1) {
      users[userIndex].pontuacao += novasPontuacao
      users[userIndex].updatedAt = new Date().toISOString()
      
      if (this.saveUsers(users)) {
        // Atualizar usuário atual se necessário
        const currentUser = this.getCurrentUser()
        if (currentUser && currentUser.id === userId) {
          currentUser.pontuacao = users[userIndex].pontuacao
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(currentUser))
        }
        return { success: true, message: 'Pontuação atualizada!', pontuacao: users[userIndex].pontuacao }
      }
    }
    
    return { success: false, message: 'Erro ao atualizar pontuação!' }
  }

  // Adicionar quiz completo
  addCompletedQuiz(userId, quizId, pontuacao) {
    const users = this.getUsers()
    const userIndex = users.findIndex(user => user.id === userId)
    
    if (userIndex !== -1) {
      const quizCompleto = {
        quizId,
        pontuacao,
        completedAt: new Date().toISOString()
      }
      
      users[userIndex].quizzesCompletos.push(quizCompleto)
      users[userIndex].pontuacao += pontuacao
      users[userIndex].updatedAt = new Date().toISOString()
      
      if (this.saveUsers(users)) {
        // Atualizar usuário atual
        const currentUser = this.getCurrentUser()
        if (currentUser && currentUser.id === userId) {
          currentUser.quizzesCompletos = users[userIndex].quizzesCompletos
          currentUser.pontuacao = users[userIndex].pontuacao
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(currentUser))
        }
        return { success: true, message: 'Quiz registrado!', user: users[userIndex] }
      }
    }
    
    return { success: false, message: 'Erro ao registrar quiz!' }
  }

  // Obter ranking de usuários
  getUserRanking() {
    const users = this.getUsers()
    return users
      .sort((a, b) => b.pontuacao - a.pontuacao)
      .map((user, index) => ({
        posicao: index + 1,
        nome: user.nome,
        pontuacao: user.pontuacao,
        quizzesCompletos: user.quizzesCompletos.length
      }))
  }

  // Limpar todos os dados (útil para desenvolvimento)
  clearAllData() {
    localStorage.removeItem(this.USERS_KEY)
    localStorage.removeItem(this.CURRENT_USER_KEY)
    return true
  }
}

// Exportar instância única do serviço
export default new UserService()