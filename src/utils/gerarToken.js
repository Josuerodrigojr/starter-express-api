const jwt = require("jsonwebtoken")
const { senhaToken } = require("../../dadosSensiveis")
const tempoExpiracao = "5h"

const gerarToken = (id, email) => {
  const token = jwt.sign({ id, email }, senhaToken, {
    expiresIn: tempoExpiracao,
  })

  return token
}

module.exports = { gerarToken }
