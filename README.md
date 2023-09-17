# Sistema-bancario
## Descrição

Este projeto é uma API para um sistema bancário que oferece as seguintes funcionalidades:

- Criar conta bancária
- Listar contas bancárias
- Atualizar os dados do usuário da conta bancária
- Excluir uma conta bancária
- Depositar em uma conta bancária
- Sacar de uma conta bancária
- Transferir valores entre contas bancárias
- Consultar saldo da conta bancária
- Emitir extrato bancário

## IMAGENS
Rotas<br/>
<img src="pictures/Captura%20de%20tela.png" width="800" alt="Rotas"><br/> 

Controladores<br/>
<img src="pictures/Captura%20de%20tela2.png" width="800" alt="Controladores">

## Tecnologias Utilizadas
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [date-fns](https://date-fns.org/)
- [Nodemon](https://nodemon.io/)
## Instalação
Certifique-se de ter o Node.js e o npm instalados em sua máquina.
1. **Clone este repositório:**
   ```bash
   git clone https://github.com/eliaszlsp/Sistema-bancario.git
   
2. **Navegue até o diretório do projeto:**

    ```bash
    cd Sistema-bancario
    ```

3. **Instale as dependências:**

    ```bash
    npm install
    ```
## Uso

**Para iniciar o servidor de desenvolvimento, utilize o seguinte comando:**

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`.


## Rotas

- `POST /api/contas` - Criar conta bancária
- `GET /api/contas` - Listar contas bancárias
- `PUT /api/contas/:id` - Atualizar os dados do usuário da conta bancária
- `DELETE /api/contas/:id` - Excluir uma conta bancária
- `POST /api/contas/:id/deposito` - Depositar em uma conta bancária
- `POST /api/contas/:id/saque` - Sacar de uma conta bancária
- `POST /api/contas/transferencia` - Transferir valores entre contas bancárias
- `GET /api/contas/:id/saldo` - Consultar saldo da conta bancária
- `GET /api/contas/:id/extrato` - Emitir extrato bancário




