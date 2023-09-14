require('dotenv').config()

const hostDB = process.env.DB_HOST
const portDB = process.env.DB_PORT
const usuarioDB = process.env.DB_USER
const senhaDB = process.env.DB_PASS
const nomeDB = process.env.DB_NAME

const senhaToken = "senhaToken"

module.exports = {
  hostDB,
  portDB,
  usuarioDB,
  senhaDB,
  nomeDB,
  senhaToken,
}
