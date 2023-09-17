const {
    contas,
    banco,
    depositos,
    saques,
    transferencias,
} = require("../database/database");
const { format } = require("date-fns");
let id = 1;

const listarTodasAsContas = (req, res) => {
    const { senha_banco } = req.query;
    if (!senha_banco) {
        return res.status(400).json({ message: "A senha não foi fornecida" });
    }
    if (senha_banco !== banco.senha) {
        return res
            .status(403)
            .json({ message: "A senha do banco informada é inválida!" });
    }
    if (contas.length === 0) {
        return res.status(200).json({ messagem: "nenhuma conta encontrada" });
    } else {
        return res.status(200).json(contas);
    }
};

const novaConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const cpfEEmailUnico = contas.find((unico) => {
        return unico.usuario.cpf === cpf || unico.usuario.email === email;
    });
    if (cpfEEmailUnico) {
        return res
            .status(409)
            .json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    }
    const conta = {
        numero: id.toString(),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        },
    };
    Object.keys(conta.usuario).forEach((falta) => {
        if (conta.usuario[falta]) {
            conta.usuario[falta] = conta.usuario[falta].trim();
        }
    });
    const dadosPendentes = Object.keys(conta.usuario).filter((falta) => {
        return !conta.usuario[falta];
    });

    if (dadosPendentes.length !== 0) {
        return res
            .status(400)
            .json({ mensagem: `Dados pendentes : ${dadosPendentes.join(",")}` });
    }
    id += 1;
    contas.push(conta);
    return res.status(201).send();
};

const atualizarUsuarioConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    const encontrarConta = contas.findIndex((conta) => {
        return conta.numero === numeroConta;
    });

    if (encontrarConta === -1) {
        return res.status(404).json({ mensagem: "Conta não encontrada" });
    }

    const conta = {
        numero: numeroConta,
        saldo: contas[encontrarConta].saldo,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        },
    };


    Object.keys(conta.usuario).forEach((falta) => {
        if (conta.usuario[falta]) {
            conta.usuario[falta] = conta.usuario[falta].trim();
        }
    });

    const dadosPendentes = Object.keys(conta.usuario).filter((falta) => {
        return !conta.usuario[falta];
    });

    if (dadosPendentes.length > 0) {
        return res
            .status(400)
            .json({ mensagem: `Dados pendentes : ${dadosPendentes.join(",")}` });
    }

    const verificacaoCPF = contas.filter((unico) => {
        return unico.usuario.cpf === cpf && unico.numero !== numeroConta;
    });
    const verificacaoEmail = contas.filter((unico) => {
        return unico.usuario.email === email && unico.numero !== numeroConta;
    });
    if (verificacaoCPF.length > 0) {
        return res
            .status(400)
            .json({ mensagem: "Já existe uma conta com o cpf  informado!" });
    }
    if (verificacaoEmail.length > 0) {
        return res
            .status(400)
            .json({ mensagem: "Já existe uma conta com o e-mail informado!" });
    }

    contas[encontrarConta] = conta;
    return res.status(201).send();
};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;
    const encontrarConta = contas.findIndex((conta) => {
        return conta.numero === numeroConta;
    });
    if (encontrarConta === -1) {
        return res
            .status(404)
            .json({ mensagem: " O numero da conta está invalido" });
    }
    const { saldo } = contas[encontrarConta];

    if (saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    }
    contas.splice(encontrarConta, 1);
    res.status(204).send();
};

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    if (!numero_conta || valor === undefined) {
        return res.status(400).json({
            mensagem: "O número da conta e o valor são obrigatórios!",
        });
    }
    const contaEncontrada = contas.find((conta) => {
        return conta.numero === numero_conta;
    });
    if (!contaEncontrada) {
        return res
            .status(404)
            .json({ mensagem: " O numero da conta está invalido" });
    }
    if (valor <= 0) {
        return res
            .status(400)
            .json({ mensagem: " O valor de deposito está invalido " });
    }
    const dataeHoraFormat = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const registroDeposito = {
        data: dataeHoraFormat,
        numero_conta,
        valor,
    };
    contaEncontrada.saldo += valor;
    depositos.push(registroDeposito);
    res.status(200).json();
};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    if ([numero_conta, valor, senha].includes(undefined)) {
        return res.status(400).json({
            mensagem: "O número da conta, valor e a senha são obrigatórios!",
        });
    }

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!contaEncontrada) {
        return res
            .status(404)
            .json({ mensagem: "O numero da conta está invalido" });
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(404).json({ mensagem: "Senha incorreta" });
    }

    if (contaEncontrada.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
    }

    if (valor <= 0) {
        return res
            .status(400)
            .json({ mensagem: " O valor não pode ser menor ou igual a zero!" });
    }
    const dataeHoraFormat = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    const registroSacar = {
        data: dataeHoraFormat,
        numero_conta,
        valor,
    };
    contaEncontrada.saldo -= valor;
    saques.push(registroSacar);
    res.status(204).json();
};

const transferir = (req, res) => {
    const { numero_conta_origem, valor, senha, numero_conta_destino } = req.body;

    if (
        [numero_conta_origem, valor, senha, numero_conta_destino].includes(
            undefined
        )
    ) {
        return res.status(400).json({
            mensagem:
                "O número da conta origem e destino, valor e a senha são obrigatórios!",
        });
    }
    if (numero_conta_origem === numero_conta_destino) {
        return res
            .status(404)
            .json({ mensagem: "O número da conta origem e destino são iguais" });
    }

    const contaEncontradaOrigem = contas.find((conta) => {
        return conta.numero === numero_conta_origem;
    });
    if (!contaEncontradaOrigem) {
        return res
            .status(404)
            .json({ mensagem: " O numero da conta está invalido" });
    }

    if (contaEncontradaOrigem.usuario.senha !== senha) {
        return res.status(404).json({ mensagem: "Senha incorreta" });
    }

    if (valor <= 0) {
        return res
            .status(400)
            .json({ mensagem: " O valor não pode ser menor ou igual a zero! " });
    }
    if (contaEncontradaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
    }

    const contaEncontradaDestino = contas.find((conta) => {
        return conta.numero === numero_conta_destino;
    });

    if (contaEncontradaDestino === undefined) {
        return res
            .status(404)
            .json({ mensagem: " O numero da conta está invalido" });
    }

    contaEncontradaOrigem.saldo -= valor;
    contaEncontradaDestino.saldo += valor;
    const dataeHoraFormat = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const registroTransferencia = {
        data: dataeHoraFormat,
        numero_conta_origem,
        numero_conta_destino,
        valor,
    };
    transferencias.push(registroTransferencia);
    return res.status(200).json();
};

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;
    if ([numero_conta, senha].includes(undefined)) {
        return res.status(400).json({
            mensagem: "O número da conta e a senha são obrigatórios!",
        });
    }

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!contaEncontrada) {
        return res
            .status(404)
            .json({ mensagem: " O numero da conta está invalido" });
    }
    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(404).json({ mensagem: "Senha incorreta" });
    }
    const saldo = contaEncontrada.saldo;
    res.status(200).json({ saldo });
};

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;
    if ([numero_conta, senha].includes(undefined)) {
        return res.status(400).json({
            mensagem: "O número da conta e a senha são obrigatórios!",
        });
    }

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (contaEncontrada === undefined) {
        return res.status(404).json({ mensagem: "Conta bancária não encontada!" });
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(404).json({ mensagem: "Senha incorreta" });
    }
    const transferenciasEnviadas = transferencias.filter((transferencias) => {
        return transferencias.numero_conta_origem === numero_conta;
    });
    const transferenciasRecebidas = transferencias.filter((transferencias) => {
        return transferencias.numero_conta_destino === numero_conta;
    });
    const saquesExtrato = saques.filter((extrato) => {
        return extrato.numero_conta === numero_conta;
    });
    const depositosExtrato = depositos.filter((extrato) => {
        return extrato.numero_conta === numero_conta;
    });

    const extrato = {
        depositos: depositosExtrato,
        saques: saquesExtrato,
        transferenciasEnviadas,
        transferenciasRecebidas,
    };

    res.status(201).json(extrato);
};

module.exports = {
    listarTodasAsContas,
    novaConta,
    atualizarUsuarioConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato,
};
