const conexaoBanco = require("../config/conexao")

const encontrarUsuarioTransacoesId = async (id) => {
  const transacoesUsuario = await conexaoBanco.query(
    `select transacoes.id, tipo, transacoes.descricao, valor, data, usuario_id, categoria_id, categorias.descricao as categoria_nome 
        from transacoes left join categorias on transacoes.categoria_id = categorias.id 
        where usuario_id=$1`,
    [id]
  )

  return transacoesUsuario
}

const encontrarTransacaoId = (id) => {
  const transacao = conexaoBanco.query(
    `select transacoes.id, tipo, transacoes.descricao, valor, data, usuario_id, categoria_id, categorias.descricao as categoria_nome 
        from transacoes left join categorias on transacoes.categoria_id = categorias.id 
        where transacoes.id=$1`,
    [id]
  )
  return transacao
}

const atualizarTransacao = async (dados) => {
  const { descricao, valor, data, categoria_id, tipo, idTransacao } = dados
  const atualizacaoTransacao = await conexaoBanco.query(
    `update transacoes set descricao=$1, valor=$2,data=$3, categoria_id=$4, tipo=$5 where id=$6  RETURNING *`,
    [descricao, valor, data, categoria_id, tipo, idTransacao]
  )
  return atualizacaoTransacao
}

const encontrarTransacaoCategoria = async (categorias, transacoesUsuario) => {
  let transacaoCategoria = []

  for (let i = 0; i < categorias.length; i++) {
    let transacao = await conexaoBanco.query(
      `select transacoes.id, tipo, transacoes.descricao, valor, data, usuario_id, categoria_id, categorias.descricao as categoria_nome from transacoes left join categorias on transacoes.categoria_id = categorias.id  where categorias.descricao ilike $1 and transacoes.usuario_id = $2`,
      [categorias[i], transacoesUsuario[0].usuario_id]
    )

    if (transacao.rowCount > 0) {
      transacaoCategoria.push(transacao.rows)
    }
  }

  return transacaoCategoria
}
const cadastrarTransacao = async (transacao) => {
  const { descricao, valor, data, categoria_id, usuario_id, tipo } = transacao
  const cadastroTransacao = await conexaoBanco.query(
    "insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6) returning *",
    [descricao, valor, data, categoria_id, usuario_id, tipo]
  )

  return cadastroTransacao
}

const deletarTransacaoId = async (id) => {
  const deletarTransacao = await conexaoBanco.query(
    "delete from transacoes where id=$1",
    [id]
  )

  return deletarTransacao
}

module.exports = {
  encontrarUsuarioTransacoesId,
  encontrarTransacaoId,
  cadastrarTransacao,
  deletarTransacaoId,
  encontrarUsuarioTransacoesId,
  encontrarTransacaoId,
  atualizarTransacao,
  encontrarTransacaoCategoria,
}
