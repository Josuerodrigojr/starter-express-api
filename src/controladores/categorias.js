const { listaCategorias } = require("../repositorios/categorias")

const listarCategorias = async (req, res) => {
  try {
    const categorias = await listaCategorias()

    return res.status(200).json(categorias)
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

module.exports = {
  listarCategorias,
}
