const {
  usuarioDB,
  hostDB,
  nomeDB,
  senhaDB,
  portDB,
} = require("../../dadosSensiveis")
const { Pool } = require("pg")

const conexaoBanco = new Pool({
  user: usuarioDB,
  host: hostDB,
  database: nomeDB,
  password: senhaDB,
  port: portDB,
  ssl:{rejectUnauthorized:false},
})

module.exports = conexaoBanco
