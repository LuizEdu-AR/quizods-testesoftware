import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import Header from '../../components/Header'
// Usar o serviço unificado que alterna entre localStorage e Firebase
import { UserService } from '../../services'
import DefaultProfile from '../../assets/img/defaultprofile.webp'
import './index.css'

const Profile = () => {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState(null)
    const [editMode, setEditMode] = useState(null) // 'nome', 'senha', 'foto'
    const [formData, setFormData] = useState({
        nome: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        foto: null
    })
    const [fotoPreview, setFotoPreview] = useState(null)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [senhaStatus, setSenhaStatus] = useState({ requisitos: [], isValid: false })

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const user = await UserService.getCurrentUser()
                if (user) {
                    setCurrentUser(user)
                    setFormData({
                        nome: user.nome,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                        foto: user.foto
                    })
                    if (user.foto) {
                        setFotoPreview(user.foto)
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error)
                navigate('/')
            }
        }
        
        loadUserData()
    }, [navigate])

    const handleInputChange = (e) => {
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

        // Validar nova senha em tempo real
        if (name === 'newPassword') {
            const validacao = validarSenha(value)
            setSenhaStatus({
                requisitos: getRequisitosSenha(value),
                isValid: validacao.isValid
            })
        }
        
        setError('')
        setSuccess('')
    }

    const handleFotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Por favor, selecione apenas arquivos de imagem!')
                return
            }

            if (file.size > 2 * 1024 * 1024) {
                setError('A imagem deve ter no máximo 2MB!')
                return
            }

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            let result = { success: false, message: 'Erro desconhecido' }

            switch (editMode) {
                case 'nome':
                    if (formData.nome.trim().length === 0) {
                        setError('Nome não pode estar vazio')
                        setLoading(false)
                        return
                    }
                    if (formData.nome.length > 16) {
                        setError('Nome deve ter no máximo 16 caracteres')
                        setLoading(false)
                        return
                    }
                    // Firebase: Atualizar nome
                    result = await UserService.updateUser(currentUser.id || currentUser.uid, { 
                        nome: formData.nome 
                    })
                    break

                case 'senha':
                    // Validações da senha
                    if (!formData.currentPassword) {
                        setError('Senha atual é obrigatória')
                        setLoading(false)
                        return
                    }
                    if (!formData.newPassword) {
                        setError('Nova senha é obrigatória')
                        setLoading(false)
                        return
                    }
                    if (formData.newPassword !== formData.confirmPassword) {
                        setError('As senhas não coincidem')
                        setLoading(false)
                        return
                    }
                    if (!senhaStatus.isValid) {
                        setError('A nova senha não atende aos requisitos')
                        setLoading(false)
                        return
                    }
                    
                    // Firebase: Alterar senha
                    result = await UserService.changePassword(formData.currentPassword, formData.newPassword)
                    break
                    
                case 'foto':
                    // Firebase: Atualizar foto
                    result = await UserService.updateUser(currentUser.id || currentUser.uid, { 
                        foto: formData.foto 
                    })
                    break

                default:
                    setError('Modo de edição inválido')
                    setLoading(false)
                    return
            }

            if (result.success) {
                setSuccess(result.message)
                // Update current user data
                const updatedUser = await UserService.getCurrentUser()
                setCurrentUser(updatedUser)
                setEditMode(null)
                
                // Clear form fields
                setFormData({
                    nome: formData.nome,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    foto: formData.foto
                })

                // Header will update automatically
            } else {
                setError(result.message)
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error)
            setError('Erro interno. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const cancelEdit = () => {
        setEditMode(null)
        setError('')
        setSuccess('')
        setSenhaStatus({ requisitos: [], isValid: false })
        if (currentUser) {
            setFormData({
                nome: currentUser.nome,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                foto: currentUser.foto
            })
            setFotoPreview(currentUser.foto)
        }
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
                    <p>Carregando perfil...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="settings-app">
            <Header />
            <main className="settings-main">
                <div className="settings-container">
                    <div className="settings-header">
                        <button onClick={() => navigate('/home')} className="back-button">
                            <BiArrowBack size={20} />
                            Voltar
                        </button>
                        <h1>Meu Perfil</h1>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <div className="settings-content">
                        {/* Nome */}
                        <div className="settings-section">
                            <div className="section-header">
                                <h3>Nome</h3>
                                {editMode !== 'nome' && (
                                    <button onClick={() => setEditMode('nome')} className="edit-btn">
                                        Editar
                                    </button>
                                )}
                            </div>
                            {editMode === 'nome' ? (
                                <form onSubmit={handleSubmit} className="edit-form">
                                    <input
                                        type="text"
                                        name="nome"
                                        placeholder="Novo nome"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        maxLength="16"
                                        required
                                        disabled={loading}
                                    />
                                    <div className="form-actions">
                                        <button type="submit" disabled={loading} className="save-btn">
                                            {loading ? 'Salvando...' : 'Salvar'}
                                        </button>
                                        <button type="button" onClick={cancelEdit} className="cancel-btn">
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p className="current-value">{currentUser.nome}</p>
                            )}
                        </div>

                        {/* Senha */}
                        <div className="settings-section">
                            <div className="section-header">
                                <h3>Senha</h3>
                                {editMode !== 'senha' && (
                                    <button onClick={() => setEditMode('senha')} className="edit-btn">
                                        Alterar
                                    </button>
                                )}
                            </div>
                            {editMode === 'senha' ? (
                                <form onSubmit={handleSubmit} className="edit-form">
                                    <div className="password-input-container">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            placeholder="Senha atual"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                        </button>
                                    </div>
                                    <div className="password-input-container">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            placeholder="Nova senha"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                            minLength="8"
                                            maxLength="16"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                        </button>
                                    </div>
                                    {formData.newPassword && (
                                        <div className="senha-requisitos">
                                            <p className="requisitos-titulo">Requisitos da nova senha:</p>
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
                                    <div className="password-input-container">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirmar nova senha"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                            minLength="8"
                                            maxLength="16"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                        </button>
                                    </div>
                                    {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                        <small className="senha-erro">As senhas não coincidem</small>
                                    )}
                                    <div className="form-actions">
                                        <button type="submit" disabled={loading || !senhaStatus.isValid || formData.newPassword !== formData.confirmPassword} className="save-btn">
                                            {loading ? 'Salvando...' : 'Salvar'}
                                        </button>
                                        <button type="button" onClick={cancelEdit} className="cancel-btn">
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p className="current-value">••••••••</p>
                            )}
                        </div>

                        {/* Foto */}
                        <div className="settings-section">
                            <div className="section-header">
                                <h3>Foto de Perfil</h3>
                                {editMode !== 'foto' && (
                                    <button onClick={() => setEditMode('foto')} className="edit-btn">
                                        Alterar
                                    </button>
                                )}
                            </div>
                            {editMode === 'foto' ? (
                                <form onSubmit={handleSubmit} className="edit-form">
                                    <div className="foto-upload-container">
                                        {fotoPreview && (
                                            <div className="foto-preview">
                                                <img src={fotoPreview} alt="Preview" className="foto-preview-img" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="foto"
                                            accept="image/*"
                                            onChange={handleFotoChange}
                                            disabled={loading}
                                            className="foto-input"
                                        />
                                        <label htmlFor="foto" className="foto-label">
                                            {fotoPreview ? 'Trocar foto' : 'Escolher foto'}
                                        </label>
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" disabled={loading} className="save-btn">
                                            {loading ? 'Salvando...' : 'Salvar'}
                                        </button>
                                        <button type="button" onClick={cancelEdit} className="cancel-btn">
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="current-photo">
                                    <img 
                                        src={currentUser.foto || DefaultProfile} 
                                        alt="Foto atual" 
                                        className="current-photo-img" 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Profile
