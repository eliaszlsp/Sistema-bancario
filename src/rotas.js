const express = require("express");
const rotas = express();

const {
    listarTodasAsContas,
    novaConta,
    atualizarUsuarioConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
} = require("./controllers/controllers");



rotas.get("/contas", listarTodasAsContas);
rotas.post("/contas", novaConta);
rotas.put("/contas/:numeroConta/usuario", atualizarUsuarioConta);
rotas.delete("/contas/:numeroConta", excluirConta);
rotas.post("/transacoes/depositar", depositar);
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir)
rotas.get('/contas/saldo', saldo)
rotas.get('/contas/extrato', extrato)







module.exports = rotas;
