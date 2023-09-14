const express = require("express")
const app = express()
const rotas = require("./rotas")
require('dotenv').config()

app.use(express.json())
app.use(rotas)

const PORTA = process.env.PORT || 3000

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`)
})
