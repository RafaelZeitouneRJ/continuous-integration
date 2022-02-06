# continuous-integration

Aula de qualidade de Software 


Há dois projetos desenvolvidos:

1- User-admin: O User-admin é uma aplicação FrontEnd foi desenvolvido utilizando o React e utilizando a biblioteca react-admin
2- User-api: O user é uma aplicação backend, utiliza o framework express e base de dados mongodb.

Testes de integração e de sistemas:
 - A aplicação User-api utiliza jest e supertest para fazer o teste da parte do backend;
 - A aplicação User-Admin utiliza cypress para fazer o teste de interface;

 Instalação

 - Basta fazer o download do projeto com a ferramenta git , utilizando o comando git clone ou baixando direto clicando no arquivo.
 - Entrar em cada pasta e executar o comando npm instal para baixar as dependências.
 - O banco de dados utilizado pela aplicação é mongoDB e é utilizado localmente. Toda configuração do banco de dados está na próprio arquivo app.js;
 - A pasta github\workflows tem o arquivo user-api.yaml de configuração da integração contínua ou CI que utilizará o gitHub;
 - É utilizado Eslint para fazer a verificação do padrão do código escrito;




