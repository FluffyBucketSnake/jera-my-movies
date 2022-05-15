# MyMovies

Trabalho para o desafio técnico do processo seletivo realizado pela Jera

## TODO

- [x] Desenvolver o login/cadastro de usuário básico
  - [x] Criar middleware para restringir usuários sem autentificação
- [x] Desenvolver o login/cadastro de usuário com Facebook
  - [x] Redirecionar o usuário para a tela de cadastro para finalizar o registro
    - Os campos de valores obtidos do Facebook devem ser desabilitados
- [x] Desenvolver a busca de filmes
  - [x] Criar a rota para obter os filmes
    - Recebe uma parâmetro de busca para filtrar por título
  - [x] Criar a pagina principal
    - [x] Criar o layout padrão
      - [x] Desfecho com a logo do TMDB
    - [x] Criar o componente de filme
    - [x] Criar o componente de filtro
    - [x] Finalizar a montagem da página
- [x] Desenvolver o gerenciamento de perfis
  - [x] Criar uma rota para criar perfis
  - [x] Criar uma rota para buscar perfis
  - [x] Criar página de criação de perfil
    - [x] FIX: NextAuth não atualizando o estado da sessão quando um perfil é criado
  - [x] Adicionar seletor de perfil atual
- [x] Desenvolver o gerenciamento de lista de filmes para assistir
  - [x] Criar uma rota para adicionar filmes a watchlist de um perfil
  - [x] Rota para obter a watchlist de um perfil
  - [x] Criar uma rota para marcar filme como assistido
  - [x] Atualizar o componente de filme
  - [ ] Criar uma página para listar os filmes a assistir do perfil atual
- [ ] Desenvolver o sistema de lista de filmes sugeridos
  - [ ] Criar uma rota para obter os filmes sugeridos ao perfil
  - [ ] Criar uma página com a lista de filmes sugeridos
- [ ] Limpar o código da aplicação
- [ ] Desenvolver o compartilhamento de filmes
- [ ] Desenvolver o agendamento de filmes
- [ ] Filtro de filmes adultos

## Executando

1. Certifique-se que esteja com o Node.js 16.14.0 instalado
   - Obs: Node.js 17 não funciona
2. Instale todas as dependências
   - Comando `npm install`
3. Certifique-se que está com PostgreSQL instalado
4. Crie um aplicativo Facebook
   - Anote o identificador e a chave secreta do aplicativo
5. Crie uma chave de *API* do *TMDB(The Movie Database)*
6. Crie um arquivo `.env` e defina as seguintes variáveis de ambiente:
   - `FACEBOOK_CLIENT_ID`: ID do aplicativo Facebook
   - `FACEBOOK_CLIENT_SECRET`: Chave secreta do aplicativo Facebook
   - `DATABASE_URL`: a URL de conexão com um banco de dados PostgreSQL
   - `NEXTAUTH_URL`: a URL por onde este serviço será hospedado. Ex.: "http://localhost:3000"
   - `NEXTAUTH_SECRET`: uma *string* aleatória usada no sistema de autentificação
     - Recomenda-se criar uma com o comando: `openssl rand -base64 32`
   - `TMDB_API_KEY`: a chave de *API* para o *TMDB*
7. Execute a aplicação com o comando: `npm run dev`
