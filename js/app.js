const $ = seletor => document.querySelector(seletor);
const $$ = seletor => [...document.querySelectorAll(seletor)];

const db = {
    get(chave, padrao) {
        try {
            return JSON.parse(localStorage.getItem(chave)) ?? padrao;
        } catch {
            return padrao;
        }
    },
    set(chave, valor) {
        localStorage.setItem(chave, JSON.stringify(valor));
    }
};

const EMAIL_FUNCIONARIO = 'funcionario@autocenterveloz.com.br';
const SENHA_FUNCIONARIO = 'Veloz@2026';
const pagina = document.body.dataset.page;

const ERROS = {
    placa: 'Placa inválida. Use o formato ABC1D23 ou ABC1234.',
    email: 'Informe um e-mail válido, como nome@exemplo.com.',
    tel: 'Informe um número válido com DDD, como (41) 91234-5678.',
    renavam: 'RENAVAM inválido. Confira os números (9 a 11 dígitos).',
    senha: 'A senha deve ter de 6 a 32 caracteres, sem espaços e sem os símbolos " \' < > \\',
    login: 'E-mail/número ou senha incorretos.',
    emUso: 'Esse e-mail/número já está em uso.'
};

const normalizarContato = valor => valor.includes('@') ? valor.trim().toLowerCase() : valor.replace(/\D/g, '');
const normalizarPlaca = valor => valor.toUpperCase().replace(/[^A-Z0-9]/g, '');
const moeda = numero => 'R$ ' + numero.toFixed(2).replace('.', ',');

const escapar = texto => String(texto).replace(/[&<>"']/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[caractere]));

const emailValido = valor => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(valor) && !valor.includes('..');
const telefoneValido = valor => /^[\d\s()+-]+$/.test(valor) && /^[1-9]{2}(9\d{8}|[2-5]\d{7})$/.test(valor.replace(/\D/g, ''));
const placaValida = placa => /^([A-Z]{3}\d[A-Z]\d{2}|[A-Z]{3}\d{4})$/.test(placa);
const senhaValida = senha => /^[^\s"'<>\\]{6,32}$/.test(senha);

const renavamValido = renavam => {
    if (!/^\d{9,11}$/.test(renavam)) {
        return false;
    }

    renavam = renavam.padStart(11, '0');
    const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(renavam[i]) * pesos[i];
    }

    const digito = (soma * 10) % 11 % 10;
    return digito === Number(renavam[10]);
};

const mostrarMensagem = (elemento, texto, sucesso = false) => {
    elemento.className = 'msg ' + (sucesso ? 'ok' : 'erro');
    elemento.textContent = texto;
};

const usuarios = () => db.get('acv_usuarios', []);
const salvarUsuarios = lista => db.set('acv_usuarios', lista);
const sessao = () => db.get('acv_sessao', null);
const servicos = () => db.get('acv_servicos', []);
const salvarServicos = lista => db.set('acv_servicos', lista);

const usuarioLogado = () => {
    const atual = sessao();
    return atual && !atual.staff ? usuarios().find(u => u.id === atual.id) : null;
};

const contatoEmUso = (contato, idIgnorado) => {
    return contato === EMAIL_FUNCIONARIO
        || usuarios().some(u => u.id !== idIgnorado && (u.email === contato || u.tel === contato));
};

if (!localStorage.getItem('acv_servicos')) {
    salvarServicos([{
        id: 1001,
        placa: 'ABC1D23',
        modelo: 'Honda Civic 2018',
        cliente: 'Cliente Demo',
        etapas: [
            { t: 'Veículo recebido e inspeção concluída' },
            { t: 'Óleo do motor trocado' }
        ],
        orcs: [{
            i: 1,
            itens: [
                { n: 'Pastilhas de freio dianteiras', v: 320 },
                { n: 'Mão de obra', v: 120 }
            ],
            estado: 'pendente'
        }]
    }]);
}

const sessaoAtual = sessao();
const linkFuncionario = $('#link-func');

if (linkFuncionario) {
    linkFuncionario.hidden = !sessaoAtual?.staff;
}

$('#mi-criar').hidden = !!sessaoAtual;
$('#mi-entrar').hidden = !!sessaoAtual;
$('#mi-conta').hidden = !sessaoAtual || !!sessaoAtual.staff;
$('#sair').hidden = !sessaoAtual;

$('#pf').onclick = () => {
    const menu = $('#pm');
    menu.hidden = !menu.hidden;
    $('#pf').setAttribute('aria-expanded', !menu.hidden);
};

$('#sair').onclick = () => {
    localStorage.removeItem('acv_sessao');
    location.href = 'index.html';
};

const totalOrcamento = orcamento => orcamento.itens.reduce((soma, item) => soma + item.v, 0);

const listaItens = itens => `
    <ul class="et">
        ${itens.map(item => `<li>${escapar(item.n)}: ${moeda(item.v)}</li>`).join('')}
    </ul>`;

const lerItens = texto => texto
    .split('\n')
    .map(linha => linha.split(';'))
    .filter(partes => partes[0].trim() && partes[1] && !isNaN(parseFloat(partes[1].replace(',', '.'))))
    .map(partes => ({
        n: partes[0].trim(),
        v: parseFloat(partes[1].replace(',', '.'))
    }));

const cartaoOrcamento = (servico, orcamento, funcionario) => {
    const proposta = orcamento.mud;
    const dados = `data-id="${servico.id}" data-o="${orcamento.i}"`;
    const titulo = orcamento.ad ? 'Aumento de orçamento' : 'Orçamento';

    let html = `
        <h4>${titulo}: ${moeda(totalOrcamento(orcamento))}</h4>
        ${listaItens(orcamento.itens)}`;

    if (proposta) {
        const autor = funcionario ? 'Aguardando o cliente:' : 'A oficina propõe';
        const acao = proposta.tipo === 'remover'
            ? 'remover este orçamento.'
            : `alterar este orçamento para ${moeda(totalOrcamento(proposta))}:`;

        html += `<p class="msg">${autor} ${acao}</p>`;

        if (proposta.tipo === 'alterar') {
            html += listaItens(proposta.itens);
        }

        if (!funcionario) {
            html += `
                <div class="acoes" ${dados}>
                    <button data-a="perm">Permitir</button>
                    <button data-a="nega">Recusar</button>
                </div>`;
        }
    } else if (orcamento.estado === 'pendente' && !funcionario) {
        html += `
            <div class="acoes" ${dados}>
                <button data-a="aprovado">Aceitar</button>
                <button data-a="recusado">Recusar</button>
                ${orcamento.ad ? '' : '<button data-a="cancelado">Cancelar serviço</button>'}
                <a class="btn" href="#contato">Entrar em contato</a>
            </div>`;
    } else {
        html += `<p class="msg">Situação: <b>${orcamento.estado}</b></p>`;
    }

    if (funcionario && !proposta) {
        const linhas = orcamento.itens.map(item => `${item.n};${item.v}`).join('\n');

        html += `
            <form class="alt" ${dados}>
                <textarea name="t" rows="3">${escapar(linhas)}</textarea>
                <div class="acoes">
                    <button value="alterar">Propor alteração</button>
                    <button value="remover">Propor remoção</button>
                </div>
            </form>`;
    }

    return html;
};

const cartaoEtapas = servico => {
    const etapas = servico.etapas.map(etapa => {
        const anexo = etapa.arq ? ` <a href="${etapa.arq}" download="${escapar(etapa.an)}">anexo</a>` : '';
        return `<li>${escapar(etapa.t)}${anexo}</li>`;
    });

    return `<ul class="et">${etapas.join('') || '<li>Aguardando início</li>'}</ul>`;
};

const formulariosFuncionario = servico => `
    <form class="aum" data-id="${servico.id}">
        <label>
            Aumento no orçamento (opcional, um item por linha: descrição;valor)
            <textarea name="t" rows="2" placeholder="Troca de correia;250" required></textarea>
        </label>
        <button>Enviar aumento para aprovação</button>
    </form>
    <form class="etapa" data-id="${servico.id}">
        <input name="t" placeholder="Etapa concluída, ex.: Filtro de ar trocado" required>
        <input type="file" name="f" accept="image/*,.pdf">
        <button>Registrar etapa</button>
    </form>`;

const cartaoServico = (servico, funcionario = false) => `
    <article class="card">
        <h4>${escapar(servico.modelo)}, placa ${escapar(servico.placa)} (protocolo ${servico.id})</h4>
        ${funcionario ? `<p>Cliente: ${escapar(servico.cliente)}</p>` : ''}
        ${cartaoEtapas(servico)}
        ${servico.orcs.map(orcamento => cartaoOrcamento(servico, orcamento, funcionario)).join('')}
        ${funcionario ? formulariosFuncionario(servico) : ''}
    </article>`;

const iniciarIndex = () => {
    const consultados = [];
    const slides = $$('.carrossel div');
    let slideAtual = 0;

    setInterval(() => {
        slides[slideAtual].classList.remove('on');
        slideAtual = (slideAtual + 1) % slides.length;
        slides[slideAtual].classList.add('on');
    }, 4000);

    $$('.svc').forEach(servico => {
        const botao = servico.querySelector('.top');

        botao.onclick = () => {
            const aberto = servico.classList.toggle('open');
            servico.classList.toggle('fecha', !aberto);
            botao.setAttribute('aria-expanded', aberto);
        };

        servico.onmouseleave = () => servico.classList.remove('fecha');
    });

    const desenhar = () => {
        const usuario = usuarioLogado();

        if (usuario) {
            const placas = usuario.veiculos.map(veiculo => veiculo.placa);
            const meus = servicos().filter(s => placas.includes(s.placa));

            $('#meus').innerHTML = meus.map(s => cartaoServico(s)).join('')
                || '<p class="msg">Nenhum serviço em andamento para seus veículos. Cadastre placas em "Gerenciar minha conta".</p>';
        } else {
            $('#meus').innerHTML = '<p class="msg">Entre na sua conta para ver seus veículos aqui automaticamente, ou consulte pela placa abaixo.</p>';
        }

        $('#consulta').innerHTML = servicos()
            .filter(s => consultados.includes(s.id))
            .map(s => cartaoServico(s))
            .join('');
    };

    $('#area-placa').hidden = !!usuarioLogado();
    desenhar();

    $('#f-consulta').onsubmit = evento => {
        evento.preventDefault();

        const formulario = evento.target;
        const placa = normalizarPlaca(formulario.placa.value);
        const protocolo = formulario.protocolo.value.trim();
        const mensagem = $('#m-consulta');
        const servico = servicos().find(s => s.placa === placa && String(s.id) === protocolo);

        if (!servico) {
            return mostrarMensagem(mensagem, 'Não encontramos esse veículo. Confira a placa e o protocolo da recepção.');
        }

        if (!consultados.includes(servico.id)) {
            consultados.push(servico.id);
        }

        mostrarMensagem(mensagem, 'Veículo encontrado.', true);
        desenhar();
    };

    $('#status').onclick = evento => {
        const acao = evento.target.dataset.a;

        if (!acao) {
            return;
        }

        const dados = evento.target.parentElement.dataset;
        const todos = servicos();
        const servico = todos.find(s => s.id === Number(dados.id));
        const orcamento = servico.orcs.find(o => o.i === Number(dados.o));

        if (acao === 'perm') {
            if (orcamento.mud.tipo === 'remover') {
                servico.orcs = servico.orcs.filter(o => o !== orcamento);
            } else {
                orcamento.itens = orcamento.mud.itens;
                orcamento.estado = 'aprovado';
                delete orcamento.mud;
            }
        } else if (acao === 'nega') {
            delete orcamento.mud;
        } else {
            orcamento.estado = acao;
        }

        salvarServicos(todos);
        desenhar();
    };

    $('#f-agenda').onsubmit = evento => {
        evento.preventDefault();

        const formulario = evento.target;
        const mensagem = $('#m-agenda');
        const contatoBruto = formulario.contato.value.trim();
        const contato = normalizarContato(contatoBruto);
        const placa = normalizarPlaca(formulario.placa.value);
        const porEmail = contatoBruto.includes('@');

        if (!(porEmail ? emailValido(contato) : telefoneValido(contatoBruto))) {
            return mostrarMensagem(mensagem, porEmail ? ERROS.email : ERROS.tel);
        }

        if (!placaValida(placa)) {
            return mostrarMensagem(mensagem, ERROS.placa);
        }

        const agendamentos = db.get('acv_agendamentos', []);

        agendamentos.push({
            nome: formulario.nome.value,
            contato,
            placa,
            problema: formulario.problema.value
        });

        db.set('acv_agendamentos', agendamentos);
        formulario.reset();
        mostrarMensagem(mensagem, 'Pedido enviado! Entraremos em contato pelo e-mail ou número informado.', true);
    };
};

const iniciarFuncionario = () => {
    if (!sessao()?.staff) {
        location.href = 'conta.html#entrar';
    }

    const desenhar = () => {
        $('#todos').innerHTML = servicos().map(s => cartaoServico(s, true)).join('');
    };

    const alterarOrcamento = (formulario, evento, todos, servico) => {
        const itens = lerItens(formulario.t.value);
        const remocao = evento.submitter?.value === 'remover';

        if (!remocao && !itens.length) {
            return alert('Use o formato descrição;valor, um item por linha.');
        }

        if (formulario.classList.contains('aum')) {
            servico.orcs.push({
                i: Math.max(0, ...servico.orcs.map(o => o.i)) + 1,
                ad: true,
                itens,
                estado: 'pendente'
            });
        } else {
            const orcamento = servico.orcs.find(o => o.i === Number(formulario.dataset.o));
            orcamento.mud = remocao ? { tipo: 'remover' } : { tipo: 'alterar', itens };
        }

        salvarServicos(todos);
        desenhar();
    };

    const registrarEtapa = (formulario, todos, servico) => {
        const arquivo = formulario.f.files[0];

        const salvar = anexo => {
            servico.etapas.push({ t: formulario.t.value, ...anexo });
            salvarServicos(todos);
            desenhar();
        };

        if (!arquivo) {
            return salvar({});
        }

        if (arquivo.size > 700000) {
            return alert('Arquivo muito grande para a simulação local (máx. 700 KB).');
        }

        const leitor = new FileReader();
        leitor.onload = () => salvar({ arq: leitor.result, an: arquivo.name });
        leitor.readAsDataURL(arquivo);
    };

    desenhar();

    $('#todos').onsubmit = evento => {
        evento.preventDefault();

        const formulario = evento.target;
        const todos = servicos();
        const servico = todos.find(s => s.id === Number(formulario.dataset.id));

        if (formulario.classList.contains('etapa')) {
            registrarEtapa(formulario, todos, servico);
        } else {
            alterarOrcamento(formulario, evento, todos, servico);
        }
    };

    $('#f-novo').onsubmit = evento => {
        evento.preventDefault();

        const formulario = evento.target;
        const mensagem = $('#m-novo');
        const placa = normalizarPlaca(formulario.placa.value);

        if (!placaValida(placa)) {
            return mostrarMensagem(mensagem, ERROS.placa);
        }

        const todos = servicos();
        const itens = lerItens(formulario.orc.value);
        const id = Math.max(1000, ...todos.map(s => s.id)) + 1;

        todos.push({
            id,
            placa,
            modelo: formulario.modelo.value,
            cliente: formulario.cliente.value,
            etapas: [],
            orcs: itens.length ? [{ i: 1, itens, estado: 'pendente' }] : []
        });

        salvarServicos(todos);
        formulario.reset();
        mostrarMensagem(mensagem, 'Serviço registrado. Protocolo: ' + id, true);
        desenhar();
    };
};

const iniciarConta = () => {
    const buscarUsuario = todos => todos.find(u => u.id === sessao().id);

    const desenharConta = () => {
        const usuario = usuarioLogado();

        $('#f-email').v.value = usuario.email || '';
        $('#f-tel').v.value = usuario.tel || '';

        $('#lista-veic').innerHTML = usuario.veiculos
            .map(v => `<li>${escapar(v.placa)} (RENAVAM ${escapar(v.renavam)}) <button class="btn" data-rm="${v.placa}">Remover</button></li>`)
            .join('') || '<li>Nenhum veículo cadastrado.</li>';
    };

    const mostrarSecao = () => {
        const secao = (location.hash || '#entrar').slice(1);

        if (secao === 'gerenciar' && !usuarioLogado()) {
            return location.hash = '#entrar';
        }

        ['entrar', 'criar', 'gerenciar'].forEach(id => {
            $('#' + id).hidden = id !== secao;
        });

        if (secao === 'gerenciar') {
            desenharConta();
        }
    };

    const alterarContato = (campo, valor, mensagem) => {
        const todos = usuarios();
        const usuario = buscarUsuario(todos);

        if (contatoEmUso(valor, usuario.id)) {
            return mostrarMensagem(mensagem, ERROS.emUso);
        }

        usuario[campo] = valor;
        salvarUsuarios(todos);
        mostrarMensagem(mensagem, 'Alteração salva.', true);
    };

    addEventListener('hashchange', mostrarSecao);

    $('#f-entrar').onsubmit = evento => {
        evento.preventDefault();

        const login = normalizarContato(evento.target.login.value);
        const senha = evento.target.senha.value;

        if (login === EMAIL_FUNCIONARIO && senha === SENHA_FUNCIONARIO) {
            db.set('acv_sessao', { staff: true });
            return location.href = 'funcionario.html';
        }

        const usuario = usuarios().find(u => (u.email === login || u.tel === login) && u.senha === senha);

        if (!usuario) {
            return mostrarMensagem($('#m-entrar'), ERROS.login);
        }

        db.set('acv_sessao', { id: usuario.id });
        location.href = 'index.html';
    };

    $('#f-criar').onsubmit = evento => {
        evento.preventDefault();

        const mensagem = $('#m-criar');
        const contatoBruto = evento.target.login.value.trim();
        const contato = normalizarContato(contatoBruto);
        const senha = evento.target.senha.value;
        const porEmail = contatoBruto.includes('@');

        if (!(porEmail ? emailValido(contato) : telefoneValido(contatoBruto))) {
            return mostrarMensagem(mensagem, 'Informe um e-mail válido ou um número válido com DDD.');
        }

        if (!senhaValida(senha)) {
            return mostrarMensagem(mensagem, ERROS.senha);
        }

        if (contatoEmUso(contato)) {
            return mostrarMensagem(mensagem, ERROS.emUso);
        }

        const todos = usuarios();
        const usuario = {
            id: Date.now(),
            [porEmail ? 'email' : 'tel']: contato,
            senha,
            veiculos: []
        };

        todos.push(usuario);
        salvarUsuarios(todos);
        db.set('acv_sessao', { id: usuario.id });
        location.href = 'index.html';
    };

    $('#f-email').onsubmit = evento => {
        evento.preventDefault();

        const email = normalizarContato(evento.target.v.value);
        const mensagem = $('#m-email');

        if (emailValido(email)) {
            alterarContato('email', email, mensagem);
        } else {
            mostrarMensagem(mensagem, ERROS.email);
        }
    };

    $('#f-tel').onsubmit = evento => {
        evento.preventDefault();

        const telefone = evento.target.v.value.trim();
        const mensagem = $('#m-tel');

        if (telefoneValido(telefone)) {
            alterarContato('tel', normalizarContato(telefone), mensagem);
        } else {
            mostrarMensagem(mensagem, ERROS.tel);
        }
    };

    $('#f-senha').onsubmit = evento => {
        evento.preventDefault();

        const todos = usuarios();
        const usuario = buscarUsuario(todos);
        const mensagem = $('#m-senha');

        if (usuario.senha !== evento.target.atual.value) {
            return mostrarMensagem(mensagem, 'A senha atual não confere.');
        }

        if (!senhaValida(evento.target.nova.value)) {
            return mostrarMensagem(mensagem, ERROS.senha);
        }

        usuario.senha = evento.target.nova.value;
        salvarUsuarios(todos);
        evento.target.reset();
        mostrarMensagem(mensagem, 'Senha alterada.', true);
    };

    $('#f-veic').onsubmit = evento => {
        evento.preventDefault();

        const todos = usuarios();
        const usuario = buscarUsuario(todos);
        const mensagem = $('#m-veic');
        const placa = normalizarPlaca(evento.target.placa.value);
        const renavam = evento.target.renavam.value.replace(/\D/g, '');

        if (!placaValida(placa)) {
            return mostrarMensagem(mensagem, ERROS.placa);
        }

        if (!renavamValido(renavam)) {
            return mostrarMensagem(mensagem, ERROS.renavam);
        }

        if (usuario.veiculos.some(v => v.placa === placa)) {
            return mostrarMensagem(mensagem, 'Essa placa já está cadastrada.');
        }

        usuario.veiculos.push({ placa, renavam });
        salvarUsuarios(todos);
        evento.target.reset();
        mostrarMensagem(mensagem, 'Veículo cadastrado.', true);
        desenharConta();
    };

    $('#lista-veic').onclick = evento => {
        const placa = evento.target.dataset.rm;

        if (!placa) {
            return;
        }

        const todos = usuarios();
        const usuario = buscarUsuario(todos);

        usuario.veiculos = usuario.veiculos.filter(v => v.placa !== placa);
        salvarUsuarios(todos);
        desenharConta();
    };

    mostrarSecao();
};

if (pagina === 'index') {
    iniciarIndex();
} else if (pagina === 'func') {
    iniciarFuncionario();
} else if (pagina === 'conta') {
    iniciarConta();
}
