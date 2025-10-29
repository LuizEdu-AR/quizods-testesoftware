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
    // Carregar dados do usuário (a autenticação já foi verificada pelo ProtectedRoute)
    const loadUserData = async () => {
      try {
        const user = await UserService.getCurrentUser()
        setCurrentUser(user)
        
        // Criar dados de exemplo apenas se estiver usando localStorage
        if (!USE_FIREBASE) {
          criarDadosExemplo()
          mostrarEstatisticas()
        }
        
        if (user) {
          console.log('👋 Bem-vindo,', user.nome + '!')
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [])

  const handleLogout = async () => {
    await UserService.logoutUser()
    navigate('/')
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid var(--color-primary)', 
            borderTop: '3px solid transparent', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Carregando dados do usuário...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid var(--color-primary)', 
            borderTop: '3px solid transparent', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Preparando sua experiência...</p>
        </div>
      </div>
    )
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