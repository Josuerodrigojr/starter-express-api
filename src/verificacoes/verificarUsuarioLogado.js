const jwt = require("jsonwebtoken")
const { senhaToken } = require("../../dadosSensiveis")
const verificarUsuarioExistente = require("../repositorios/usuarios")

const verificarUsuarioLogado = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ mensagem: "É necessário fazer login" })
  }
  try {
    const token = req.headers.authorization.replace("Bearer ", "")

    const { id } = jwt.verify(token, senhaToken)

    const { rows: usuario, rowCount } =
      await verificarUsuarioExistente.encontrarPeloID(id)
    if (rowCount === 0) {
      return res.status(401).json({ mensagem: "Usuário não encontrado" })
    }
    req.usuarioLogado = usuario[0]
    next()
  } catch (error) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    })
  }
}

module.exports = verificarUsuarioLogado
