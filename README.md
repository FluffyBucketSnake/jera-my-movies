# MyMovies

Trabalho para o desafio técnico do processo seletivo realizado pela Jera 

## TODO

- [x] Desenvolver o login/cadastro de usuário básico
  - [x] Criar middleware para restringir usuários sem autentificação
- [ ] Desenvolver o login/cadastro de usuário com Facebook
  - [ ] Redirecionar o usuário para a tela de cadastro para finalizar o registro
    - Os campos de valores obtidos do Facebook devem ser desabilitados
- [ ] Desenvolver a busca de filmes
  - [ ] Criar a pagina principal
    - [ ] Criar a rota para obter os filmes
      - Recebe uma parâmetro de busca para filtrar por título
    - [ ] Criar o layout padrão
    - [ ] Criar o componente de filme
    - [ ] Criar o componente de filtro
    - [ ] Finalizar a montagem da página
- [ ] Desenvolver o gerenciamento de perfis
  - [ ] Criar uma rota para criar perfis
  - [ ] Criar uma rota para buscar perfis
  - [ ] Criar página de criação de perfil
  - [ ] Adicionar seletor de perfil atual
- [ ] Desenvolver o gerenciamento de lista de filmes para assistir
  - [ ] Criar uma rota para adicionar filmes a watchlist de um perfil
  - [ ] Rota para obter a watchlist de um perfil
  - [ ] Atualizar o componente de filme
  - [ ] Criar uma página para listar os filmes a assistir do perfil atual
- [ ] Desenvolver o sistema de lista de filmes sugeridos
  - [ ] Criar uma rota para obter os filmes sugeridos ao perfil
  - [ ] Criar uma página com a lista de filmes sugeridos
- [ ] Limpar o código da aplicação
- [ ] Desenvolver o compartilhamento de filmes
- [ ] Desenvolver o agendamento de filmes

## Executando

1. Certifique-se que esteja com o Node.js 16.14.0 instalado
   - Obs: Node.js 17 não funciona
2. Instale todas as dependências
   - Comando `npm install`
3. Certifique-se que está com PostgreSQL instalado
4. Crie um aplicativo Facebook
   - Anote o identificador e a chave secreta do aplicativo
5. Crie um arquivo `.env` e defina as seguintes variáveis de ambiente:
   - `FACEBOOK_CLIENT_ID`: ID do aplicativo Facebook
   - `FACEBOOK_CLIENT_SECRET`: Chave secreta do aplicativo Facebook
   - `DATABASE_URL`: a URL de conexão com um banco de dados PostgreSQL
   - `NEXTAUTH_URL`: a URL por onde este serviço será hospedado. Ex.: "http://localhost:3000"
   - `NEXTAUTH_SECRET`: uma *string* aleatória usada no sistema de autentificação
     - Recomenda-se criar uma com o comando: `openssl rand -base64 32`
6. Execute a aplicação com o comando: `npm run dev`
