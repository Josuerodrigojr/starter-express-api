const {
  encontrarPeloID,
  cadastrarUsuario,
  encontrarUsuarioPeloEmail,
  atualizaUsuario,
} = require("../repositorios/usuarios")
const { gerarToken } = require("../utils/gerarToken")
const verificarUsuarioExistente = require("../repositorios/usuarios")
const {
  criptografarSenha,
  compararSenha,
} = require("../utils/criptografiaSenhas")
const {
  validarCamposObrigatoriosUsuario,
} = require("../utils/funcoesAuxiliares")
const conexaoBanco = require("../config/conexao")

const cadastrarUsuarios = async (req, res) => {
  const { nome, email, senha } = req.body

  try {
    const validarCampos = await validarCamposObrigatoriosUsuario(
      nome,
      email,
      senha
    )

    if (!validarCampos) {
      return res
        .status(400)
        .json({ mensagem: "Todos os campos são obrigatórios!" })
    }

    const { rows: usuario } = await encontrarUsuarioPeloEmail(email)
    if (usuario.length > 0) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      })
    }
    const senhaCriptografada = await criptografarSenha(senha)

    const dadosUsuario = { nome, email, senhaCriptografada }

    const Usuariocadastrado = await cadastrarUsuario(dadosUsuario)
    return res.status(201).json(Usuariocadastrado.rows[0])
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

const logarUsuario = async (req, res) => {
  const { email, senha } = req.body

  try {
    if (!email || !senha) {
      return res
        .status(400)
        .json({ mensagem: "Todos os campos são obrigatórios!" })
    }

    const { rows: usuario, rowCount } =
      await verificarUsuarioExistente.encontrarUsuarioPeloEmail(email)

    if (rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." })
    }

    const usuarioEncontrado = usuario[0]
    const { senha: senhaUsuario, ...dadosUsuario } = usuarioEncontrado

    const senhaCorreta = await compararSenha(senha, usuarioEncontrado.senha)

    if (!senhaCorreta) {
      return res
        .status(401)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." })
    }

    const token = gerarToken(usuarioEncontrado.id, usuarioEncontrado.email)

    return res.status(200).json({
      usuario: dadosUsuario,
      token,
    })
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

const detalharUsuario = async (req, res) => {
  try {
    const id = req.usuarioLogado.id
    const { rows: usuarios } = await encontrarPeloID(id)

    const usuario = {
      id: usuarios[0].id,
      nome: usuarios[0].nome,
      email: usuarios[0].email,
    }
    return res.status(200).json(usuario)
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

const atualizarUsuario = async (req, res) => {
  const id = req.usuarioLogado.id
  const { nome, email, senha } = req.body

  try {
    const validarCampos = await validarCamposObrigatoriosUsuario(
      nome,
      email,
      senha
    )

    if (!validarCampos) {
      return res
        .status(400)
        .json({ mensagem: "Todos os campos são obrigatórios!" })
    }

    const { rows: usuario } = await encontrarPeloID(id)
    const { rows: usuarioEmail } = await encontrarUsuarioPeloEmail(email)

    if (usuarioEmail.length > 0 && usuarioEmail[0].id !== usuario[0].id) {
      return res.status(404).json({
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      })
    }

    const senhaCriptografada = await criptografarSenha(senha)
    const dadosUsuario = { nome, email, senhaCriptografada, id }
    const usuarioAtualizado = await atualizaUsuario(dadosUsuario)

    return res.status(204).json()
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

module.exports = {
  cadastrarUsuarios,
  logarUsuario,
  detalharUsuario,
  atualizarUsuario,
}
