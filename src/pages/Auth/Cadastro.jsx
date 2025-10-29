import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
// Usar o serviço unificado que alterna entre localStorage e Firebase
import { UserService, USE_FIREBASE } from '../../services'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import LogoODSAuth from '../../assets/img/logoodsauth.png'
import DefaultProfile from '../../assets/img/defaultprofile.webp'

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
    const [emailJaExiste, setEmailJaExiste] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        // Filtrar apenas letras e espaços para o campo nome
        if (name === 'nome') {
            const filteredValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
            setFormData({
                ...formData,
                [name]: filteredValue
            })
        } else {
            setFormData({
                ...formData,
                [name]: value
            })
        }

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

            // Verificar se email já existe será feito pelo Firebase
            // if (value && emailValidacao.isValid) {
            //     const emailExiste = UserService.emailExists(value)
            //     setEmailJaExiste(emailExiste)
            // } else {
            //     setEmailJaExiste(false)
            // }
            setEmailJaExiste(false) // Firebase fará a validação
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

    const validarSenha = (senha) => {
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

            try {
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

                console.log('🔥 Iniciando cadastro...', {
                    nome: formData.nome,
                    email: formData.email,
                    senha_length: formData.password.length,
                    useFirebase: USE_FIREBASE
                })

                // Usar o serviço unificado (Firebase ou localStorage)
                const result = await UserService.registerUser({
                    nome: formData.nome,
                    email: formData.email,
                    password: formData.password,
                    foto: formData.foto || DefaultProfile
                })

                console.log('🔥 Resultado do cadastro:', result)

                if (result.success) {
                    setSuccess(result.message)
                    console.log('✅ Usuário cadastrado:', result.user)

                    // Aguardar um pouco antes de redirecionar
                    setTimeout(() => {
                        navigate('/')
                    }, 2000)
                } else {
                    console.log('❌ Erro no cadastro:', result.message)
                    setError(result.message)
                }
            } catch (error) {
                console.error('❌ Erro no cadastro (catch):', error)
                // Tratamento de erro mais específico
                if (error.code) {
                    // Erro do Firebase
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            setError('Este email já está sendo usado por outra conta!')
                            break
                        case 'auth/weak-password':
                            setError('A senha é muito fraca. Use pelo menos 6 caracteres!')
                            break
                        case 'auth/invalid-email':
                            setError('Formato de email inválido!')
                            break
                        case 'auth/network-request-failed':
                            setError('Erro de conectividade. Verifique sua conexão com a internet.')
                            break
                        default:
                            setError(`Erro do Firebase: ${error.message}`)
                    }
                } else {
                    setError(`Erro interno: ${error.message}`)
                }
            } finally {
                console.log('🏁 Finalizando cadastro, setLoading(false)')
                setLoading(false)
            }
        }

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword)
        }

        const toggleConfirmPasswordVisibility = () => {
            setShowConfirmPassword(!showConfirmPassword)
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
                                maxLength="16"
                            />
                            {formData.nome && formData.nome.length >= 16 && (
                                <small className="nome-help">
                                    Máximo de 16 caracteres ({formData.nome.length}/16)
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="foto">Foto de Perfil (opcional):</label>
                            <div className="foto-upload-container">
                                {fotoPreview && (
                                    <div className="foto-preview">
                                        <img src={fotoPreview} alt="Preview" className="foto-preview-img" />
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
                                <label htmlFor="foto" className="foto-label" style={{ color: "#FFF" }}>
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
                                className={
                                    formData.email && (!emailValido || emailJaExiste)
                                        ? 'input-error'
                                        : ''
                                }
                            />
                            {formData.email && !emailValido && (
                                <div className="email-help">
                                    <small className="email-erro">
                                        ❌ Email deve terminar com um dos domínios permitidos
                                    </small>
                                </div>
                            )}
                            {formData.email && emailValido && emailJaExiste && (
                                <div className="email-help">
                                    <small className="email-erro">
                                        ❌ Este email já está em uso
                                    </small>
                                </div>
                            )}
                            {formData.email && emailValido && !emailJaExiste && (
                                <div className="email-help">
                                    <small className="email-sucesso">
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
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    minLength="8"
                                    maxLength="16"
                                    className="password-input"
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={togglePasswordVisibility}
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <AiOutlineEyeInvisible size={20} />
                                    ) : (
                                        <AiOutlineEye size={20} />
                                    )}
                                </button>
                            </div>
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
                            <div className="password-input-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    minLength="8"
                                    maxLength="16"
                                    className="password-input"
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={toggleConfirmPasswordVisibility}
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? (
                                        <AiOutlineEyeInvisible size={20} />
                                    ) : (
                                        <AiOutlineEye size={20} />
                                    )}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <small className="senha-erro">As senhas não coincidem</small>
                            )}
                        </div>

                        <button type="submit" className="auth-button" disabled={loading || emailJaExiste || !emailValido}>
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>

                    <p className="auth-link">
                        Já tem uma conta? <Link to="/">Faça login</Link>
                    </p>
                </div>
            </div>
        )
    }
}

export default Cadastro