import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore'
import { auth, db } from './config'
import DefaultProfile from '../assets/img/defaultprofile.webp'

class FirebaseAuthService {
  constructor() {
    this.currentUser = null
    this.authStateListeners = []
    
    // Listener para mudanças no estado de autenticação
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user
      this.authStateListeners.forEach(callback => callback(user))
    })
  }

  // Helper function to capitalize first letter
  capitalizeFirstLetter(str) {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // Cadastrar novo usuário
  async registerUser(userData) {
    try {
      console.log('🔥 FirebaseAuthService: Iniciando cadastro...', userData.email)
      
      // Criar usuário no Firebase Auth
      console.log('🔥 FirebaseAuthService: Criando usuário no Auth...')
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      )
      
      const user = userCredential.user
      console.log('✅ FirebaseAuthService: Usuário criado no Auth:', user.uid)

      // Atualizar perfil do usuário
      console.log('🔥 FirebaseAuthService: Atualizando perfil...')
      await updateProfile(user, {
        displayName: this.capitalizeFirstLetter(userData.nome),
        photoURL: userData.foto || DefaultProfile
      })
      console.log('✅ FirebaseAuthService: Perfil atualizado')

      // Criar documento do usuário no Firestore
      console.log('🔥 FirebaseAuthService: Criando documento no Firestore...')
      const userDoc = {
        uid: user.uid,
        nome: this.capitalizeFirstLetter(userData.nome),
        email: userData.email,
        foto: userData.foto || DefaultProfile,
        createdAt: new Date().toISOString(),
        pontuacao: 0,
        quizzesCompletos: [],
        favoritos: []
      }

      await setDoc(doc(db, 'usuarios', user.uid), userDoc)
      console.log('✅ FirebaseAuthService: Documento criado no Firestore')

      console.log('✅ FirebaseAuthService: Cadastro completo!')
      return { 
        success: true, 
        message: 'Usuário cadastrado com sucesso!', 
        user: { ...userDoc, id: user.uid }
      }
    } catch (error) {
      console.error('❌ FirebaseAuthService: Erro no registro:', error)
      console.error('❌ Código do erro:', error.code)
      console.error('❌ Mensagem do erro:', error.message)
      
      let message = 'Erro interno do servidor.'
      
      // Tratamento mais específico de erros
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Este email já está sendo usado por outra conta!'
          break
        case 'auth/weak-password':
          message = 'A senha deve ter pelo menos 6 caracteres!'
          break
        case 'auth/invalid-email':
          message = 'Formato de email inválido!'
          break
        case 'auth/operation-not-allowed':
          message = 'Cadastro com email/senha não está habilitado!'
          break
        case 'auth/network-request-failed':
          message = 'Erro de conectividade. Verifique sua conexão com a internet.'
          break
        case 'permission-denied':
          message = 'Permissão negada para acessar o banco de dados!'
          break
        case 'unavailable':
          message = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.'
          break
        default:
          message = `Erro: ${error.message}`
          console.error('❌ Erro não mapeado:', error.code, error.message)
      }
      
      return { success: false, message }
    }
  }

  // Fazer login
  async loginUser(email, password) {
    try {
      console.log('🔥 FirebaseAuthService: Iniciando login...', email)
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('✅ FirebaseAuthService: Login no Auth realizado:', user.uid)

      // Buscar dados adicionais do usuário no Firestore
      console.log('🔥 FirebaseAuthService: Buscando dados no Firestore...')
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid))
      
      if (userDoc.exists()) {
        const userData = { ...userDoc.data(), id: user.uid }
        console.log('✅ FirebaseAuthService: Dados encontrados no Firestore:', userData)
        console.log('✅ FirebaseAuthService: Login completo!')
        return { 
          success: true, 
          message: 'Login realizado com sucesso!', 
          user: userData 
        }
      } else {
        console.log('❌ FirebaseAuthService: Dados do usuário não encontrados no Firestore')
        return { success: false, message: 'Dados do usuário não encontrados!' }
      }
    } catch (error) {
      console.error('❌ FirebaseAuthService: Erro no login:', error)
      
      let message = 'Email ou senha incorretos!'
      if (error.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado!'
      } else if (error.code === 'auth/wrong-password') {
        message = 'Senha incorreta!'
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email inválido!'
      }
      
      return { success: false, message }
    }
  }

  // Obter usuário atual
  async getCurrentUser() {
    if (auth.currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'usuarios', auth.currentUser.uid))
        if (userDoc.exists()) {
          return { ...userDoc.data(), id: auth.currentUser.uid }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário atual:', error)
      }
    }
    return null
  }

  // Fazer logout
  async logoutUser() {
    try {
      await signOut(auth)
      return { success: true, message: 'Logout realizado com sucesso!' }
    } catch (error) {
      console.error('Erro no logout:', error)
      return { success: false, message: 'Erro ao fazer logout!' }
    }
  }

  // Atualizar dados do usuário
  async updateUser(userId, updateData) {
    try {
      await updateDoc(doc(db, 'usuarios', userId), updateData)
      return { success: true, message: 'Usuário atualizado com sucesso!' }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      return { success: false, message: 'Erro ao atualizar usuário!' }
    }
  }

  // Alterar senha do usuário
  async changePassword(currentPassword, newPassword) {
    try {
      const user = auth.currentUser
      if (!user) {
        return { success: false, message: 'Usuário não autenticado!' }
      }

      // Reautenticar o usuário com a senha atual
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Atualizar para a nova senha
      await updatePassword(user, newPassword)

      return { success: true, message: 'Senha alterada com sucesso!' }
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      
      let message = 'Erro interno do servidor.'
      if (error.code === 'auth/wrong-password') {
        message = 'Senha atual incorreta!'
      } else if (error.code === 'auth/weak-password') {
        message = 'A nova senha deve ter pelo menos 6 caracteres!'
      } else if (error.code === 'auth/requires-recent-login') {
        message = 'Por favor, faça login novamente antes de alterar a senha.'
      }
      
      return { success: false, message }
    }
  }

  // Atualizar pontuação
  async updateScore(userId, newScore) {
    return this.updateUser(userId, { pontuacao: newScore })
  }

  // Adicionar quiz completado
  async addCompletedQuiz(userId, quizData) {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', userId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const quizzesCompletos = userData.quizzesCompletos || []
        
        // Verificar se o quiz já foi completado (atualizar se sim, adicionar se não)
        const existingIndex = quizzesCompletos.findIndex(q => q.odsId === quizData.odsId)
        
        if (existingIndex >= 0) {
          quizzesCompletos[existingIndex] = quizData
        } else {
          quizzesCompletos.push(quizData)
        }
        
        await updateDoc(doc(db, 'usuarios', userId), { 
          quizzesCompletos,
          pontuacao: userData.pontuacao + (quizData.pontos || 0)
        })
        
        return { success: true }
      }
      return { success: false, message: 'Usuário não encontrado!' }
    } catch (error) {
      console.error('Erro ao adicionar quiz completado:', error)
      return { success: false, message: 'Erro ao salvar progresso!' }
    }
  }

  // Listener para mudanças no estado de autenticação
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback)
    return () => {
      this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback)
    }
  }

  // Verificar se usuário está logado
  isAuthenticated() {
    return !!auth.currentUser
  }
}

export default new FirebaseAuthService()