const conexaoBanco = require("../config/conexao")
const {
  criptografarSenha,
  compararSenha,
} = require("../utils/criptografiaSenhas")

const encontrarUsuarioPeloEmail = (email) => {
  const usuario = conexaoBanco.query(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  )
  return usuario
}

const encontrarPeloID = async (id) => {
  const usuario = await conexaoBanco.query(
    "SELECT * FROM usuarios WHERE id = $1",
    [id]
  )

  return usuario
}

const cadastrarUsuario = async (dadosUsuario) => {
  const { nome, email, senhaCriptografada } = dadosUsuario

  const Usuariocadastrado = await conexaoBanco.query(
    `
        INSERT INTO
	        usuarios (nome, email, senha)
        VALUES
	        ($1, $2, $3)
        RETURNING id,nome, email
    `,
    [nome, email, senhaCriptografada]
  )
  return Usuariocadastrado
}

const atualizaUsuario = async (dadosUsuario) => {
  const { nome, email, senhaCriptografada, id } = dadosUsuario
  const usuarioAtualizado = await conexaoBanco.query(
    `
        UPDATE usuarios
        SET nome = $1, email = $2, senha = $3
        WHERE id = $4
    `,
    [nome, email, senhaCriptografada, id]
  )
  return usuarioAtualizado
}

module.exports = {
  cadastrarUsuario,
  encontrarUsuarioPeloEmail,
  encontrarPeloID,
  atualizaUsuario,
}
