import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import MainHome from '../../components/MainHome'
import userService from '../../services/userService'
import { criarDadosExemplo, mostrarEstatisticas } from '../../utils/dadosExemplo'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se usuário está logado
    const currentUser = userService.getCurrentUser()
    if (!currentUser) {
      // Se não estiver logado, redirecionar para login
      navigate('/login')
      return
    }

    // Criar dados de exemplo se não existirem
    criarDadosExemplo()
    
    // Mostrar estatísticas no console
    mostrarEstatisticas()
    
    console.log('👋 Bem-vindo,', currentUser.nome + '!')
  }, [navigate])

  const handleLogout = () => {
    userService.logoutUser()
    navigate('/login')
  }

  const currentUser = userService.getCurrentUser()

  if (!currentUser) {
    return <div>Carregando...</div>
  }

  return (
    <div className="home-container">
      <Header />
      <MainHome />
    </div>
  )
}

export default Home