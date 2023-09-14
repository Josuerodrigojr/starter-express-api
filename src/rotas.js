const express = require("express")
const {
  cadastrarUsuarios,
  logarUsuario,
  detalharUsuario,
  atualizarUsuario,
} = require("./controladores/usuarios")
const { listarCategorias } = require("./controladores/categorias")
const {
  listarTransacoes,
  detalharTransacao,
  cadastrarTransacoes,
  atualizarTransacoes,
  deletarTransacao,
  transacaoExtrato,
} = require("./controladores/transacoes")
const verificarUsuarioLogado = require("./verificacoes/verificarUsuarioLogado")

const rotas = express()

rotas.post("/usuario", cadastrarUsuarios)
rotas.post("/login", logarUsuario)

rotas.use(verificarUsuarioLogado)

rotas.get("/usuario", detalharUsuario)
rotas.put("/usuario", atualizarUsuario)
rotas.get("/categoria", listarCategorias)
rotas.get("/transacao", listarTransacoes)
rotas.get("/transacao/extrato", transacaoExtrato)
rotas.get("/transacao/:id", detalharTransacao)
rotas.post("/transacao", cadastrarTransacoes)
rotas.put("/transacao/:id", atualizarTransacoes)
rotas.delete("/transacao/:id", deletarTransacao)

module.exports = rotas
