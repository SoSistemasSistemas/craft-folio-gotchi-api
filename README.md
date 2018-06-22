# craft-folio-gotchi-api

O CraftFolioGotchi é uma aplicação Web que possibilita a criação e personalização de mundos virtuais onde vivem personagens controlados pelos usuários.

Esse projeto faz parte do [trabalho final da disciplina Programação para Web](https://github.com/fegemo/cefet-web/tree/master/assignments/project-craftfoliogotchi) do curso de Engenharia de Computação do CEFET-MG.

A aplicação está publicada na nuvem e pode ser acessada [aqui](http://35.184.50.176).

## Requisitos de ambiente

- npm
- node

## Como rodar aplicação local

```shell
$ npm install
$ API_PORT=3000 MONGO_CONNECTION_STRING='mongodb://{mongo_host}/craft-folio-gotchi' JWT_SECRET=10b1346b75e107cc522ee6ad440d409e node src/app.js
```
