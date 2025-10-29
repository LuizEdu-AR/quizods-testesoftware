import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import MainHome from '../../components/MainHome'
import Footer from '../../components/Footer'
// Usar o serviço unificado que alterna entre localStorage e Firebase
import { UserService, USE_FIREBASE } from '../../services'
import { criarDadosExemplo, mostrarEstatisticas } from '../../utils/dadosExemplo'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se usuário está logado
    const checkUser = async () => {
      try {
        const user = await UserService.getCurrentUser()
        if (!user) {
          // Se não estiver logado, redirecionar para a página inicial (login)
          navigate('/')
          return
        }

        setCurrentUser(user)
        
        // Criar dados de exemplo apenas se estiver usando localStorage
        if (!USE_FIREBASE) {
          criarDadosExemplo()
          mostrarEstatisticas()
        }
        
        console.log('👋 Bem-vindo,', user.nome + '!')
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    
    checkUser()
  }, [navigate])

  const handleLogout = async () => {
    await UserService.logoutUser()
    navigate('/')
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!currentUser) {
    return <div>Carregando...</div>
  }

  return (
    <div className="home-container">
      <Header />
      <MainHome />
      <Footer />
    </div>
  )
}

export default Home