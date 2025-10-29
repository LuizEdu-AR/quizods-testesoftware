import { useState } from 'react'
import { auth, db } from '../firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

function TesteFirebase() {
  const [resultado, setResultado] = useState('')
  const [loading, setLoading] = useState(false)

  const testarFirebase = async () => {
    setLoading(true)
    setResultado('Testando...')
    
    try {
      // Teste 1: Criar usuário
      console.log('🔥 Testando Firebase Auth...')
      const email = `teste${Date.now()}@firebase.com`
      const senha = '123456'
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
      const user = userCredential.user
      console.log('✅ Auth funcionou! User:', user.uid)
      
      // Teste 2: Salvar no Firestore
      console.log('🔥 Testando Firestore...')
      await setDoc(doc(db, 'usuarios', user.uid), {
        nome: 'Teste',
        email: email,
        criadoEm: new Date().toISOString()
      })
      console.log('✅ Firestore funcionou!')
      
      setResultado(`✅ SUCESSO! Usuário criado: ${user.uid}`)
      
    } catch (error) {
      console.error('❌ Erro:', error)
      setResultado(`❌ ERRO: ${error.code} - ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>🧪 Teste Firebase</h3>
      <button 
        onClick={testarFirebase} 
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        {loading ? 'Testando...' : 'Testar Firebase'}
      </button>
      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <strong>Resultado:</strong> {resultado}
      </div>
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <strong>Abra o Console (F12) para ver detalhes dos testes</strong>
      </div>
    </div>
  )
}

export default TesteFirebase