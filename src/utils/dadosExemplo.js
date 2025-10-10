import userService from '../services/userService'

// Função para popular dados de exemplo
export const criarDadosExemplo = () => {
  try {
    // Verificar se já existem dados
    const usuarios = userService.getUsers()
    console.log('📋 Verificando usuários existentes:', usuarios.length)
    
    if (usuarios.length > 0) {
      console.log('✅ Dados já existem. Total de usuários:', usuarios.length)
      console.log('👥 Usuários:', usuarios.map(u => ({ nome: u.nome, email: u.email })))
      return usuarios
    }

    // Criar usuários de exemplo
    const usuariosExemplo = [
      {
        nome: 'João Silva',
        email: 'joao@exemplo.com',
        password: 'MinhaSenh@123'
      },
      {
        nome: 'Maria Santos',
        email: 'maria@exemplo.com',
        password: 'SenhaForte#456'
      },
      {
        nome: 'Ana Costa',
        email: 'ana@exemplo.com',
        password: 'Segura*789'
      }
    ]

    console.log('🚀 Criando usuários de exemplo...')
    const usuariosCriados = []
    
    usuariosExemplo.forEach(userData => {
      try {
        const result = userService.registerUser(userData)
        if (result.success) {
          console.log(`✅ Usuário ${userData.nome} criado com sucesso`)
          usuariosCriados.push(result.user)
          
          // Adicionar algumas pontuações de exemplo
          const userId = result.user.id
          userService.addCompletedQuiz(userId, 'quiz-ods-1', Math.floor(Math.random() * 50) + 50)
          userService.addCompletedQuiz(userId, 'quiz-ods-2', Math.floor(Math.random() * 50) + 50)
        } else {
          console.log(`❌ Erro ao criar ${userData.nome}: ${result.message}`)
        }
      } catch (error) {
        console.error(`💥 Erro ao processar ${userData.nome}:`, error)
      }
    })

    console.log('✅ Dados de exemplo criados! Total:', usuariosCriados.length)
    
    // Mostrar dados criados
    const todosUsuarios = userService.getUsers()
    console.log('📊 Usuários finais:', todosUsuarios.map(u => ({
      nome: u.nome,
      email: u.email,
      pontuacao: u.pontuacao
    })))
    
    return todosUsuarios
    
  } catch (error) {
    console.error('💥 Erro geral ao criar dados de exemplo:', error)
    return []
  }
}

// Função para limpar dados (útil para desenvolvimento)
export const limparDados = () => {
  userService.clearAllData()
  console.log('🗑️ Todos os dados foram limpos!')
}

// Função para mostrar estatísticas
export const mostrarEstatisticas = () => {
  const usuarios = userService.getUsers()
  const usuarioAtual = userService.getCurrentUser()
  const ranking = userService.getUserRanking()
  
  console.log('📊 ESTATÍSTICAS DO SISTEMA')
  console.log('=' .repeat(40))
  console.log(`👥 Total de usuários: ${usuarios.length}`)
  console.log(`🎯 Usuário logado: ${usuarioAtual ? usuarioAtual.nome : 'Nenhum'}`)
  console.log('🏆 Top 5 Ranking:')
  ranking.slice(0, 5).forEach(user => {
    console.log(`   ${user.posicao}º - ${user.nome}: ${user.pontuacao} pontos (${user.quizzesCompletos} quizzes)`)
  })
  
  if (usuarioAtual) {
    console.log('\n👤 DADOS DO USUÁRIO ATUAL:')
    console.log(`   Nome: ${usuarioAtual.nome}`)
    console.log(`   Email: ${usuarioAtual.email}`)
    console.log(`   Pontuação: ${usuarioAtual.pontuacao}`)
    console.log(`   Quizzes completos: ${usuarioAtual.quizzesCompletos.length}`)
  }
}