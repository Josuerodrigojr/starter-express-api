const bcrypt = require("bcrypt")

const criptografarSenha = (senha) => {
  const salt = bcrypt.genSaltSync(10)
  const senhaCriptografada = bcrypt.hashSync(senha, salt)

  return senhaCriptografada
}

const compararSenha = (senha, senhaCriptografada) => {
  const senhaValida = bcrypt.compareSync(senha, senhaCriptografada)

  return senhaValida
}

module.exports = {
  criptografarSenha,
  compararSenha,
}
