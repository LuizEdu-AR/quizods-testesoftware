import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import userService from '../../services/userService'
import { criarDadosExemplo } from '../../utils/dadosExemplo'

import LogoODSAuth from '../../assets/img/logoodsauth.png'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Criar dados de exemplo quando a página de login carregar
        criarDadosExemplo()
    }, [])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Limpar erro quando usuário começar a digitar
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = userService.loginUser(formData.email, formData.password)
            
            if (result.success) {
                console.log('Login realizado:', result.user)
                navigate('/home')
            } else {
                setError(result.message)
            }
        } catch (error) {
            console.error('Erro no login:', error)
            setError('Erro interno. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-logo-container">
                <img src={LogoODSAuth} alt="Logo ODS" className="auth-logo-img" />
            </div>
            <div className="auth-card">
                <h2 className='auth-h2'>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="auth-link">
                    Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </div>
        </div>
    )
}

export default Login