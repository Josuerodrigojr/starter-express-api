const conexaoBanco = require("../config/conexao")

const listaCategorias = async () => {
  const listaCategorias = await conexaoBanco.query(`SELECT * FROM categorias`)

  return listaCategorias.rows
}
const encontrarCategoriasId = async (id) => {
  const categoria = await conexaoBanco.query(
    "select * from categorias where id=$1",
    [id]
  )

  return categoria
}
module.exports = {
  listaCategorias,
  encontrarCategoriasId,
}
