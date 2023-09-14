const validarTipoTransicao = async (tipo) => {
  if (tipo != "entrada" && tipo != "saida") {
    return false
  } else {
    return true
  }
}

const validarCamposTransicao = async (
  descricao,
  valor,
  data,
  categoria_id,
  tipo
) => {
  if (!descricao || !valor || !data || !categoria_id || !tipo) {
    return false
  } else {
    return true
  }
}

const validarCamposObrigatoriosUsuario = async (nome, email, senha) => {
  if (!nome || !email || !senha) {
    return false
  } else {
    return true
  }
}

const validarCampoIdNumerico = async (id) => {
  if (!Number(id)) {
    return false
  } else {
    return true
  }
}

module.exports = {
  validarTipoTransicao,
  validarCamposTransicao,
  validarCampoIdNumerico,
  validarCamposObrigatoriosUsuario,
}
