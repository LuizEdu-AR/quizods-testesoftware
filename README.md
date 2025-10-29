# QuizODS - Sistema de Quiz Educacional sobre ODS

Um aplicativo web interativo desenvolvido com React que oferece quizzes educacionais sobre os 17 Objetivos de Desenvolvimento Sustentável (ODS) da ONU. O sistema inclui funcionalidades avançadas como sistema de usuários com Firebase, favoritos, acompanhamento de progresso e interface totalmente responsiva.

## 🌟 Visão Geral

O QuizODS foi desenvolvido como parte de um projeto de Teste de Software, oferecendo uma plataforma educacional completa para aprendizado sobre sustentabilidade e desenvolvimento sustentável através de quizzes interativos.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces de usuário
- **Vite** - Ferramenta de build moderna e rápida
- **React Router DOM** - Roteamento para aplicações React
- **Firebase** - Plataforma de desenvolvimento web com autenticação e banco de dados
  - **Firebase Authentication** - Sistema de autenticação seguro
  - **Cloud Firestore** - Banco de dados NoSQL em tempo real
- **CSS3** - Estilização com variáveis CSS e design totalmente responsivo
- **LocalStorage API** - Persistência de dados local (modo fallback)
- **React Icons** - Biblioteca de ícones

## ✨ Funcionalidades Principais

### Sistema de Usuários com Firebase
- ✅ Cadastro e login de usuários com Firebase Authentication
- ✅ Gerenciamento de perfil com foto personalizada
- ✅ Persistência segura de dados no Cloud Firestore
- ✅ Sistema de saudações baseado no horário (Bom dia/Boa tarde/Boa noite)
- ✅ Indicador de pontuação total no cabeçalho
- ✅ Proteção de rotas e verificação de autenticação
- ✅ Fallback para localStorage quando Firebase não está disponível

### Quiz Interativo
- ✅ 17 quizzes diferentes (um para cada ODS)
- ✅ Perguntas múltipla escolha com explicações
- ✅ Sistema de pontuação em tempo real
- ✅ Feedback instantâneo para respostas corretas/incorretas
- ✅ Acompanhamento de progresso por quiz
- ✅ Histórico de quizzes completados
- ✅ Navegação intuitiva entre questões

### Interface Totalmente Responsiva
- ✅ **Design responsivo** para todas as resoluções:
  - **Desktop** (acima de 810px)
  - **Tablet** (810px)
  - **Mobile L** (425px) 
  - **Mobile** (390px)
- ✅ Menu hamburger para dispositivos móveis
- ✅ Sistema de tema claro/escuro com alternância
- ✅ Touch targets otimizados para mobile
- ✅ Layout adaptativo para todas as páginas
- ✅ Componentes de carregamento estilizados

### Recursos Avançados
- ✅ Sistema de favoritos com persistência no Firebase
- ✅ Filtros para visualizar todos os quizzes ou apenas favoritos
- ✅ Interface intuitiva com navegação fluida
- ✅ Indicadores visuais de progresso e status
- ✅ Resultados detalhados com percentual de acerto
- ✅ Sistema de rotas protegidas
- ✅ Logout seguro com limpeza completa de sessão

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/quizods-testesoftware.git
```

2. **Navegue até o diretório:**
```bash
cd quizods-testesoftware
```

3. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```

4. **Execute o projeto em modo de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse a aplicação:**
   - Abra seu navegador e vá para `http://localhost:5173`

## 📖 Como Usar

### Primeiros Passos
1. **Cadastro/Login**: Crie uma conta ou faça login com credenciais existentes (Firebase)
2. **Dashboard Principal**: Visualize todos os 17 ODS disponíveis em layout responsivo
3. **Seleção de Quiz**: Clique em qualquer card de ODS para ver detalhes
4. **Iniciar Quiz**: Clique em "Iniciar" para começar o quiz selecionado

### Funcionalidades Avançadas
- **Favoritos**: Clique no ❤️ para adicionar/remover quizzes dos favoritos (persistido no Firebase)
- **Filtros**: Use os botões "Todos" e "Favoritos" para filtrar a visualização
- **Progresso**: Acompanhe seu progresso através dos badges de status nos cards
- **Tema**: Alterne entre modo claro e escuro usando o botão de tema no cabeçalho
- **Responsividade**: Acesse de qualquer dispositivo com layout otimizado
- **Menu Mobile**: Em dispositivos móveis, use o menu hamburger para navegação

## 🏗️ Estrutura do Projeto

```
src/
├── assets/            # Recursos estáticos
│   └── img/           # Imagens dos ODS
├── components/        # Componentes React
│   ├── Header/        # Cabeçalho com navegação responsiva
│   ├── MainHome/      # Dashboard principal responsivo
│   ├── Quiz/          # Sistema de quiz interativo
│   ├── ProtectedRoute/# Proteção de rotas autenticadas
│   └── Footer/        # Rodapé da aplicação
├── firebase/          # Configuração e serviços Firebase
│   ├── config.js      # Configuração do Firebase
│   └── auth.js        # Serviços de autenticação
├── hooks/             # Custom hooks React
├── pages/             # Páginas da aplicação
│   ├── Auth/          # Sistema de autenticação
│   ├── Home/          # Página principal
│   └── Profile/       # Gerenciamento de perfil
├── services/          # Serviços e lógica de negócio
│   ├── userService.js # Gerenciamento de usuários (localStorage)
│   ├── userServiceFirebase.js # Gerenciamento com Firebase
│   ├── quizService.js # Lógica dos quizzes
│   ├── favoriteService.js # Sistema de favoritos
│   └── index.js       # Serviço unificado (Firebase/localStorage)
├── utils/             # Funções utilitárias
└── App.jsx           # Componente principal com roteamento
```

## 🧪 Testes

Para executar os testes unitários:
```bash
npm run test
# ou
yarn test
```

Para executar testes com cobertura:
```bash
npm run test:coverage
# ou
yarn test:coverage
```

## 📦 Build e Deploy

### Build de Produção
```bash
npm run build
# ou
yarn build
```

### Preview da Build
```bash
npm run preview
# ou
yarn preview
```

### Deploy no GitHub Pages

🚀 **O projeto está totalmente configurado para GitHub Pages!**

**Configuração realizada por Luiz Eduardo**, incluindo:
- Configuração do Vite com base path correto (`/quizods-testesoftware/`)
- Instalação e configuração do gh-pages
- Script de deploy automatizado no package.json
- Deploy inicial já realizado e funcionando

**Site ao vivo**: https://luizedu-ar.github.io/quizods-testesoftware/

Para fazer atualizações futuras:
```bash
npm run deploy
```

Este comando irá:
- Criar um novo build otimizado
- Fazer deploy automático para a branch gh-pages
- Atualizar o site em produção

## 🎯 Objetivos de Desenvolvimento Sustentável Abordados

O sistema cobre todos os 17 ODS da ONU:
1. Erradicação da Pobreza
2. Fome Zero e Agricultura Sustentável
3. Saúde e Bem-Estar
4. Educação de Qualidade
5. Igualdade de Gênero
6. Água Potável e Saneamento
7. Energia Limpa e Acessível
8. Trabalho Decente e Crescimento Econômico
9. Indústria, Inovação e Infraestrutura
10. Redução das Desigualdades
11. Cidades e Comunidades Sustentáveis
12. Consumo e Produção Responsáveis
13. Ação Contra a Mudança Global do Clima
14. Vida na Água
15. Vida Terrestre
16. Paz, Justiça e Instituições Eficazes
17. Parcerias e Meios de Implementação

## 👥 Desenvolvedores

Este projeto foi desenvolvido por uma equipe dedicada de estudantes:

### 👩‍💻 Evelyn
- **GitHub**: [github.com/EvelynAires](https://github.com/EvelynAires)  
- **Contribuições**: 
  - Desenvolvimento do Footer da aplicação
  - Criação e implementação das páginas Home e Auth
  - Desenvolvimento completo do sistema de Quiz (JSX e CSS)
  - Implementação de todas as funcionalidades do Header (saudações, tema, pontuação)
  - **Responsividade**: Trabalhou junto com Luiz na implementação completa do design responsivo

### 🧑‍💻 Éverson
- **GitHub**: [github.com/Everson-Alisson](https://github.com/Everson-Alisson)
- **Contribuições**: 
  - Desenvolvimento da página de Profile e gerenciamento de perfil
  - Criação dos mocks e dados dos quizzes
  - Implementação de todas as funcionalidades do MainHome (dashboard, filtros, favoritos)
  - **Firebase**: Trabalhou junto com Luiz na implementação completa do Firebase Authentication e Firestore

### 🧑‍💻 Luiz
- **GitHub**: [github.com/LuizEdu-AR](https://github.com/LuizEdu-AR)
- **Contribuições**: 
  - Desenvolvimento de todos os serviços (userService, quizService, favoriteService)
  - Configurações do App.jsx e estilos globais (index.css)
  - Documentação completa do projeto (README)
  - Gerenciamento de todos os assets e recursos visuais
  - **Configuração completa do GitHub Pages** (Vite config, gh-pages, deploy automatizado)
  - **Firebase**: Trabalhou junto com Éverson na implementação completa do Firebase Authentication e Firestore
  - **Responsividade**: Trabalhou junto com Evelyn na implementação completa do design responsivo

## 🔥 Recursos Especiais Implementados

### 🔐 Sistema Firebase Completo
**Implementado por Luiz e Éverson**
- Autenticação segura com Firebase Authentication
- Banco de dados em tempo real com Cloud Firestore
- Sincronização de dados entre dispositivos
- Fallback inteligente para localStorage
- Verificação de estado de autenticação em tempo real

### 📱 Design Totalmente Responsivo
**Implementado por Luiz e Evelyn**
- Breakpoints otimizados: Desktop (810px+), Tablet (810px), Mobile L (425px), Mobile (390px)
- Menu hamburger para dispositivos móveis
- Touch targets otimizados para mobile
- Layout adaptativo em todas as páginas
- Componentes de loading responsivos
- Sistema de tema responsivo

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. **Abra** um Pull Request

### Diretrizes para Contribuição
- Mantenha o código limpo e bem documentado
- Siga os padrões de código estabelecidos
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter detalhes completos.

## 📞 Contato e Suporte

Para dúvidas, sugestões ou relatórios de bugs, abra uma issue no repositório GitHub ou entre em contato com a equipe de desenvolvimento.

---

**© 2024 Todos os direitos reservados à Luiz Eduardo, Evelyn e Éverson**

*Desenvolvido com ❤️ para promover educação sobre sustentabilidade e os Objetivos de Desenvolvimento Sustentável da ONU.*

### 🏆 Destaques Técnicos

- **Sistema Híbrido**: Firebase + LocalStorage para máxima compatibilidade
- **Design Responsivo**: 4 breakpoints otimizados para todos os dispositivos
- **Autenticação Segura**: Firebase Authentication com proteção de rotas
- **Deploy Automatizado**: GitHub Pages com pipeline de deploy automático
- **UX Otimizada**: Loading states, feedback visual e navegação intuitiva
- **Código Limpo**: Estrutura modular e bem documentada
