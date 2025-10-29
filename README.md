# QuizODS - Sistema de Quiz Educacional sobre ODS

Um aplicativo web interativo desenvolvido com React que oferece quizzes educacionais sobre os 17 Objetivos de Desenvolvimento Sustentável (ODS) da ONU. O sistema inclui funcionalidades avançadas como sistema de usuários, favoritos, acompanhamento de progresso e interface responsiva.

## 🌟 Visão Geral

O QuizODS foi desenvolvido como parte de um projeto de Teste de Software, oferecendo uma plataforma educacional completa para aprendizado sobre sustentabilidade e desenvolvimento sustentável através de quizzes interativos.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces de usuário
- **Vite** - Ferramenta de build moderna e rápida
- **React Router DOM** - Roteamento para aplicações React
- **CSS3** - Estilização com variáveis CSS e design responsivo
- **LocalStorage API** - Persistência de dados no navegador
- **React Icons** - Biblioteca de ícones

## ✨ Funcionalidades Principais

### Sistema de Usuários
- ✅ Cadastro e login de usuários
- ✅ Gerenciamento de perfil com foto personalizada
- ✅ Dados de progresso individualizados por usuário
- ✅ Sistema de saudações baseado no horário (Bom dia/Boa tarde/Boa noite)
- ✅ Indicador de pontuação total no cabeçalho

### Quiz Interativo
- ✅ 17 quizzes diferentes (um para cada ODS)
- ✅ Perguntas múltipla escolha
- ✅ Sistema de pontuação em tempo real
- ✅ Feedback instantâneo para respostas
- ✅ Acompanhamento de progresso por quiz

### Interface e Experiência
- ✅ Design responsivo e moderno
- ✅ Sistema de tema claro/escuro com alternância
- ✅ Sistema de favoritos personalizado
- ✅ Filtros para visualizar todos os quizzes ou apenas favoritos
- ✅ Interface intuitiva com navegação fluida
- ✅ Indicadores visuais de progresso

### Recursos Avançados
- ✅ Persistência de dados no navegador
- ✅ Sistema de busca de quizzes
- ✅ Resultados detalhados com percentual de acerto
- ✅ Histórico de conclusão de quizzes
- ✅ Logout seguro com limpeza de sessão

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
1. **Cadastro/Login**: Crie uma conta ou faça login com credenciais existentes
2. **Dashboard Principal**: Visualize todos os 17 ODS disponíveis
3. **Seleção de Quiz**: Clique em qualquer card de ODS para ver detalhes
4. **Iniciar Quiz**: Clique em "Iniciar" para começar o quiz selecionado

### Funcionalidades Avançadas
- **Favoritos**: Clique no ❤️ para adicionar/remover quizzes dos favoritos
- **Filtros**: Use os botões "Todos" e "Favoritos" para filtrar a visualização
- **Busca**: Utilize a barra de pesquisa no header para encontrar quizzes específicos
- **Progresso**: Acompanhe seu progresso através dos badges de status nos cards
- **Tema**: Alterne entre modo claro e escuro usando o botão de tema no cabeçalho

## 🏗️ Estrutura do Projeto

```
src/
├── assets/            # Recursos estáticos
│   └── img/           # Imagens dos ODS
├── components/          # Componentes React
│   ├── Header/         # Cabeçalho com navegação
│   ├── MainHome/       # Dashboard principal
│   ├── Quiz/           # Sistema de quiz
│   ├── Login/          # Sistema de autenticação
│   └── Footer/         # Rodapé da aplicação
├── hooks/              # Custom hooks React
├── pages/              # Páginas da aplicação
├── services/           # Serviços e lógica de negócio
│   ├── userService.js  # Gerenciamento de usuários
│   ├── quizService.js  # Lógica dos quizzes
│   └── favoriteService.js # Sistema de favoritos
├── utils/              # Funções utilitárias
└── App.jsx            # Componente principal
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

### 🧑‍💻 Éverson
- **GitHub**: [github.com/Everson-Alisson](https://github.com/Everson-Alisson)
- **Contribuições**: 
  - Desenvolvimento da página de Profile e gerenciamento de perfil
  - Criação dos mocks e dados dos quizzes
  - Implementação de todas as funcionalidades do MainHome (dashboard, filtros, favoritos)

### 🧑‍💻 Luiz
- **GitHub**: [github.com/LuizEdu-AR](https://github.com/LuizEdu-AR)
- **Contribuições**: 
  - Desenvolvimento de todos os serviços (userService, quizService, favoriteService)
  - Configurações do App.jsx e estilos globais (index.css)
  - Documentação completa do projeto (README)
  - Gerenciamento de todos os assets e recursos visuais
  - **Configuração completa do GitHub Pages** (Vite config, gh-pages, deploy automatizado)

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

**© 2024 Todos os direitos reservados à Luiz, Evelyn e Éverson**

*Desenvolvido com ❤️ para promover educação sobre sustentabilidade e os Objetivos de Desenvolvimento Sustentável da ONU.*
