# 🔥 Configuração do Firebase - QuizODS

## 📋 Pré-requisitos
1. Conta no Google/Gmail
2. Acesso ao [Firebase Console](https://console.firebase.google.com/)

## 🚀 Passo a Passo

### 1. Criar Projeto no Firebase
1. Acesse https://console.firebase.google.com/
2. Clique em "Criar um projeto"
3. Nome do projeto: `quizods-testesoftware`
4. Aceite os termos e continue
5. Ative o Google Analytics (opcional)
6. Clique em "Criar projeto"

### 2. Configurar Authentication
1. No painel do Firebase, clique em "Authentication"
2. Clique em "Começar"
3. Vá na aba "Sign-in method"
4. Ative "Email/Password"
5. Salve as configurações

### 3. Configurar Firestore Database
1. No painel do Firebase, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (permite leitura/escrita por 30 dias)
4. Escolha uma localização (ex: southamerica-east1)
5. Clique em "Concluído"

### 4. Configurar regras do Firestore (Importante!)
1. Vá em "Firestore Database" > "Regras"
2. Substitua o conteúdo por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que usuários autenticados leiam e escrevam apenas seus próprios dados
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Clique em "Publicar"

### 5. Obter configurações do projeto
1. No painel do Firebase, clique no ícone de engrenagem > "Configurações do projeto"
2. Role para baixo até "Seus apps"
3. Clique no ícone "</>" (Web)
4. Nome do app: `QuizODS Web`
5. Marque "Configurar também o Firebase Hosting" (opcional)
6. Clique em "Registrar app"
7. **COPIE** as configurações que aparecem

### 6. Configurar no projeto
1. Abra o arquivo `src/firebase/config.js`
2. Substitua as configurações dummy pelas suas:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "quizods-testesoftware.firebaseapp.com",
  projectId: "quizods-testesoftware", 
  storageBucket: "quizods-testesoftware.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

### 7. Testar a configuração
1. Execute o projeto: `npm run dev`
2. Tente criar uma conta
3. Verifique se o usuário aparece em Authentication
4. Verifique se os dados aparecem no Firestore

## 🔒 Segurança
- As regras do Firestore garantem que cada usuário acesse apenas seus dados
- Senhas são criptografadas automaticamente pelo Firebase Auth
- Não exponha suas chaves de API publicamente

## 🆘 Troubleshooting

### Erro: "Firebase App not initialized"
- Verifique se as configurações estão corretas em `config.js`

### Erro: "Permission denied" 
- Verifique as regras do Firestore
- Certifique-se que o usuário está autenticado

### Usuário não consegue cadastrar
- Verifique se Authentication está ativado
- Verifique se Email/Password está habilitado

## 🎯 Próximos Passos
Após configurar o Firebase:
1. Migrar os componentes para usar os novos serviços
2. Testar todas as funcionalidades
3. Deploy no GitHub Pages (Firebase configurado)

## 📞 Suporte
Se tiver dúvidas, verifique:
- [Documentação do Firebase](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore)