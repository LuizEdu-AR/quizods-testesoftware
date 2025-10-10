import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import userService from '../../services/userService'

import LogoODSAuth from '../../assets/img/logoodsauth.png'

function Cadastro() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        password: '',
        confirmPassword: '',
        foto: null
    })
    const [fotoPreview, setFotoPreview] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [senhaStatus, setSenhaStatus] = useState({ requisitos: [], isValid: false })
    const [emailValido, setEmailValido] = useState(true)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
        
        // Validar senha em tempo real
        if (name === 'password') {
            const validacao = validarSenha(value)
            setSenhaStatus({
                requisitos: getRequisitosSenha(value),
                isValid: validacao.isValid
            })
        }

        // Validar email em tempo real
        if (name === 'email') {
            const emailValidacao = validarEmail(value)
            setEmailValido(emailValidacao.isValid)
        }
        
        // Limpar mensagens quando usuário começar a digitar
        if (error) setError('')
        if (success) setSuccess('')
    }

    const handleFotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Verificar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                setError('Por favor, selecione apenas arquivos de imagem!')
                return
            }

            // Verificar tamanho (máximo 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('A imagem deve ter no máximo 2MB!')
                return
            }

            // Converter para base64 para armazenar no localStorage
            const reader = new FileReader()
            reader.onload = (event) => {
                const base64String = event.target.result
                setFormData({
                    ...formData,
                    foto: base64String
                })
                setFotoPreview(base64String)
            }
            reader.readAsDataURL(file)
        }
    }

    const removerFoto = () => {
        setFormData({
            ...formData,
            foto: null
        })
        setFotoPreview(null)
        // Limpar o input file
        const fileInput = document.getElementById('foto')
        if (fileInput) {
            fileInput.value = ''
        }
    }

    // Função para validar senha
    const validarSenha = (senha) => {
        const errors = []
        
        // Verificar comprimento
        if (senha.length < 8) {
            errors.push('ao menos 8 caracteres')
        }
        if (senha.length > 16) {
            errors.push('no máximo 16 caracteres')
        }
        
        // Verificar letra maiúscula
        if (!/[A-Z]/.test(senha)) {
            errors.push('1 letra maiúscula')
        }
        
        // Verificar letra minúscula
        if (!/[a-z]/.test(senha)) {
            errors.push('1 letra minúscula')
        }
        
        // Verificar número
        if (!/[0-9]/.test(senha)) {
            errors.push('1 número')
        }
        
        // Verificar caractere especial
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
            errors.push('1 caractere especial (!@#$%^&*)')
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        }
    }

    // Função para mostrar requisitos da senha com status
    const getRequisitosSenha = (senha) => {
        return [
            {
                texto: '8-16 caracteres',
                atendido: senha.length >= 8 && senha.length <= 16
            },
            {
                texto: '1 letra maiúscula (A-Z)',
                atendido: /[A-Z]/.test(senha)
            },
            {
                texto: '1 letra minúscula (a-z)',
                atendido: /[a-z]/.test(senha)
            },
            {
                texto: '1 número (0-9)',
                atendido: /[0-9]/.test(senha)
            },
            {
                texto: '1 caractere especial (!@#$%^&*)',
                atendido: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)
            }
        ]
    }

    // Função para validar domínios de email
    const validarEmail = (email) => {
        const dominiosPermitidos = [
            '@gmail.com',
            '@outlook.com',
            '@hotmail.com',
            '@alunos.ufersa.edu.br',
            '@ufersa.edu.br'
        ]

        const emailValido = dominiosPermitidos.some(dominio => 
            email.toLowerCase().endsWith(dominio.toLowerCase())
        )

        return {
            isValid: emailValido,
            dominiosPermitidos: dominiosPermitidos
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        // Validar email
        const emailValidacao = validarEmail(formData.email)
        if (!emailValidacao.isValid) {
            setError(`Email deve ser de um dos domínios permitidos: ${emailValidacao.dominiosPermitidos.join(', ')}`)
            setLoading(false)
            return
        }

        // Validar senha
        const senhaValidacao = validarSenha(formData.password)
        if (!senhaValidacao.isValid) {
            setError(`A senha deve conter: ${senhaValidacao.errors.join(', ')}.`)
            setLoading(false)
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem!')
            setLoading(false)
            return
        }

        try {
            const result = userService.registerUser({
                nome: formData.nome,
                email: formData.email,
                password: formData.password,
                foto: formData.foto
            })

            if (result.success) {
                setSuccess(result.message)
                console.log('Usuário cadastrado:', result.user)

                // Aguardar um pouco antes de redirecionar
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            } else {
                setError(result.message)
            }
        } catch (error) {
            console.error('Erro no cadastro:', error)
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
                <h2>Cadastro</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="foto">Foto de Perfil (opcional):</label>
                        <div className="foto-upload-container">
                            {fotoPreview && (
                                <div className="foto-preview">
                                    <img src={fotoPreview} alt="Preview" className="foto-preview-img" />
                                    <button 
                                        type="button" 
                                        onClick={removerFoto}
                                        className="remove-foto-btn"
                                        disabled={loading}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                id="foto"
                                name="foto"
                                accept="image/*"
                                onChange={handleFotoChange}
                                disabled={loading}
                                className="foto-input"
                            />
                            <label htmlFor="foto" className="foto-label">
                                {fotoPreview ? 'Trocar foto' : 'Escolher foto'}
                            </label>
                        </div>
                        <small className="foto-help">
                            Formatos aceitos: JPG, PNG, GIF. Máximo 2MB.
                        </small>
                    </div>

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
                            className={formData.email && !emailValido ? 'input-error' : ''}
                        />
                        {formData.email && !emailValido && (
                            <div className="email-help">
                                <small className="email-erro">
                                    ❌ Email deve terminar com um dos domínios permitidos
                                </small>
                            </div>
                        )}
                        <div className="dominios-permitidos">
                            <small className="dominios-help">
                                <strong>Domínios aceitos:</strong> @gmail.com, @outlook.com, @hotmail.com, @alunos.ufersa.edu.br, @ufersa.edu.br
                            </small>
                        </div>
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
                            minLength="8"
                            maxLength="16"
                        />
                        {formData.password && (
                            <div className="senha-requisitos">
                                <p className="requisitos-titulo">Requisitos da senha:</p>
                                {senhaStatus.requisitos.map((req, index) => (
                                    <div key={index} className={`requisito ${req.atendido ? 'atendido' : 'pendente'}`}>
                                        <span className="requisito-icon">
                                            {req.atendido ? '✓' : '✗'}
                                        </span>
                                        <span className="requisito-texto">{req.texto}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Senha:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            minLength="8"
                            maxLength="16"
                        />
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <small className="senha-erro">As senhas não coincidem</small>
                        )}
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <p className="auth-link">
                    Já tem uma conta? <Link to="/login">Faça login</Link>
                </p>
            </div>
        </div>
    )
}

export default Cadastro