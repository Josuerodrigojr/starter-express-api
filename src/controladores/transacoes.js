const { encontrarCategoriasId } = require("../repositorios/categorias")
const {
  encontrarUsuarioTransacoesId,
  encontrarTransacaoId,
  cadastrarTransacao,
  deletarTransacaoId,
  atualizarTransacao,
  encontrarTransacaoCategoria,
} = require("../repositorios/transacoes")
const { encontrarPeloID } = require("../repositorios/usuarios")
const {
  validarTipoTransicao,
  validarCamposTransicao,
  validarCampoIdNumerico,
} = require("../utils/funcoesAuxiliares")

const listarTransacoes = async (req, res) => {
  const id = req.usuarioLogado.id
  const { filtro: categorias } = req.query

  try {
    const { rows: transacoesUsuario } = await encontrarUsuarioTransacoesId(id)
    if (categorias == undefined) {
      return res.status(200).json(transacoesUsuario)
    }

    const transacaoCategoria = await encontrarTransacaoCategoria(
      categorias,
      transacoesUsuario
    )

    return res.status(200).json(transacaoCategoria)
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

const detalharTransacao = async (req, res) => {
  const { id: idUsuario } = req.usuarioLogado
  const { id: idTransacao } = req.params

  const IdNumerico = await validarCampoIdNumerico(idTransacao)

  if (!IdNumerico) {
    return res.status(400).json({ mensagem: "Id informado é invalido!" })
  }

  try {
    const { rows: transacoes } = await encontrarUsuarioTransacoesId(idUsuario)
    const verificarTransacaoId = transacoes.some(
      (transacao) => transacao.id == idTransacao
    )

    if (transacoes.length < 1 || !verificarTransacaoId) {
      return res.status(404).json({ mensagem: "Transação não encontrada." })
    }

    const transacaoUsuario = transacoes.find(
      (transacao) => transacao.id == idTransacao
    )

    return res.status(200).json(transacaoUsuario)
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

const cadastrarTransacoes = async (req, res) => {
  const id = req.usuarioLogado.id
  const { descricao, valor, data, categoria_id, tipo } = req.body

  try {
    const validarCampos = await validarCamposTransicao(
      descricao,
      valor,
      data,
      categoria_id,
      tipo
    )

    if (!validarCampos) {
      return res.status(400).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      })
    }

    const validarTipo = await validarTipoTransicao(tipo)

    if (!validarTipo) {
      return res.status(400).json({
        mensagem: "O tipo só é valido para 'entrada' ou 'saida'",
      })
    }

    const { rows: categoria } = await encontrarCategoriasId(categoria_id)

    if (categoria.length < 1) {
      return res.status(404).json({ mensagem: "Categoria Inexistente" })
    }

    const transacao = {
      descricao,
      valor,
      data,
      categoria_id,
      usuario_id: id,
      tipo,
    }

    const { rows: transacaoCadastrada } = await cadastrarTransacao(transacao)

    const transacaoFormatoRetorno = await encontrarTransacaoId(
      transacaoCadastrada[0].id
    )

    return res.status(201).json(transacaoFormatoRetorno.rows[0])
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

const atualizarTransacoes = async (req, res) => {
  const { id: idUsuario } = req.usuarioLogado
  const { id: idTransacao } = req.params

  const IdNumerico = await validarCampoIdNumerico(idTransacao)

  if (!IdNumerico) {
    return res.status(400).json({ mensagem: "Id informado é invalido!" })
  }

  const { descricao, valor, data, categoria_id, tipo } = req.body
  try {
    const validarCampos = await validarCamposTransicao(
      descricao,
      valor,
      data,
      categoria_id,
      tipo
    )

    if (!validarCampos) {
      return res.status(400).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      })
    }
    const validarTipo = await validarTipoTransicao(tipo)

    if (!validarTipo) {
      return res.status(400).json({
        mensagem: "O tipo só é valido para 'entrada' ou 'saida'",
      })
    }
    const { rows: categoria } = await encontrarCategoriasId(categoria_id)
    if (categoria.length < 1) {
      return res.status(404).json({ mensagem: "Categoria Inexistente" })
    }

    const { rows: transacoes } = await encontrarUsuarioTransacoesId(idUsuario)
    const verificarTransacaoId = transacoes.some(
      (transacao) => transacao.id == idTransacao
    )

    if (transacoes.length < 1 || !verificarTransacaoId) {
      return res.status(404).json({ mensagem: "Transação não encontrada." })
    }

    const dados = {
      descricao,
      valor,
      data,
      categoria_id,
      tipo,
      idTransacao,
    }

    await atualizarTransacao(dados)

    return res.status(204).json()
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

const deletarTransacao = async (req, res) => {
  const { id: idUsuario } = req.usuarioLogado
  const { id: idTransacao } = req.params

  const IdNumerico = await validarCampoIdNumerico(idTransacao)

  if (!IdNumerico) {
    return res.status(400).json({ mensagem: "Id informado é invalido!" })
  }

  try {
    const { rows: transacoes } = await encontrarUsuarioTransacoesId(idUsuario)
    const verificarTransacaoId = transacoes.some(
      (transacao) => transacao.id == idTransacao
    )

    if (transacoes.length < 1 || !verificarTransacaoId) {
      return res.status(404).json({ mensagem: "Transação não encontrada." })
    }

    await deletarTransacaoId(idTransacao)

    return res.status(204).json()
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

const transacaoExtrato = async (req, res) => {
  const id = req.usuarioLogado.id
  try {
    const { rows: transacao } = await encontrarUsuarioTransacoesId(id)
    let entrada = 0
    let saida = 0
    for (let i = 0; i < transacao.length; i++) {
      if (transacao[i].tipo == "saida") {
        saida += transacao[i].valor
      } else if (transacao[i].tipo == "entrada") {
        entrada += transacao[i].valor
      }
    }
    const extrato = {
      entrada,
      saida,
    }
    res.status(200).json(extrato)
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

module.exports = {
  listarTransacoes,
  detalharTransacao,
  cadastrarTransacoes,
  atualizarTransacoes,
  deletarTransacao,
  transacaoExtrato,
}
