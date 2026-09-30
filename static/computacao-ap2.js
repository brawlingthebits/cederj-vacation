// Easter egg no console - old school style
console.log('%c', 'font-size: 1px;');
console.log('%c╔═══════════════════════════════════════════════════════╗', 'color: #00ff00; font-family: monospace;');
console.log('%c║   CEDERJ VACATION CALCULATOR v2.0                    ║', 'color: #00ff00; font-family: monospace;');
console.log('%c║   [Sistema de Cálculo de Notas Acadêmicas]          ║', 'color: #00ff00; font-family: monospace;');
console.log('%c╚═══════════════════════════════════════════════════════╝', 'color: #00ff00; font-family: monospace;');
console.log('%c', 'font-size: 1px;');
console.log('%c> ALERT: Estudante curioso detectado!', 'color: #ff0000; font-family: monospace;');
console.log('%c> Analisando intenções...', 'color: #ffcc00; font-family: monospace;');
console.log('%c', 'font-size: 1px;');
console.log('%c[SCAN COMPLETE]', 'color: #00ff00; font-family: monospace;');
console.log('%cSe você está aqui, duas possibilidades:', 'color: #ffffff; font-family: monospace;');
console.log('%c  [1] Você é dev e tá checando o código (salve, colega!)', 'color: #00d2ff; font-family: monospace;');
console.log('%c  [2] Você tá tentando me hacker...', 'color: #ff6b6b; font-family: monospace;');
console.log('%c-- Site reformulado numa sexta-feira depois de muito chá de hibisco', 'color: #888888; font-style: italic; font-family: monospace;');
console.log('%c', 'font-size: 1px;');

document.getElementById('notaForm').onsubmit = async function (event) {
    event.preventDefault();

    const ad1 = parseNota(document.getElementById('ad1').value);
    const ap1 = parseNota(document.getElementById('ap1').value);
    const ad2 = parseNota(document.getElementById('ad2').value);

    if (![ad1, ap1, ad2].every(notaValida)) {
        mostrarPlacar({
            tipo: 'perigo',
            status: 'ERRO',
            detalhe: 'Preencha AD1, AP1 e AD2 com notas entre 0 e 10.'
        });
        return;
    }

    // Trava o botão enquanto espera o servidor
    const botoes = document.querySelectorAll('button[type="submit"]');
    botoes.forEach(function (botao) {
        botao.disabled = true;
    });

    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ad1, ap1, ad2 })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            mostrarPlacar({
                tipo: 'perigo',
                status: 'ERRO',
                detalhe: result.error || 'Erro ao calcular. Tente novamente.'
            });
            return;
        }

        const nota = result.nota_ap2;
        const n1 = (ad1 * 2 + ap1 * 8) / 10;

        if (nota <= 0) {
            mostrarPlacar({
                tipo: 'ok',
                status: 'FASE CONCLUÍDA!',
                rotulo: 'NOTA MÍNIMA NA AP2',
                numero: 0,
                detalhe: `Você já garantiu média 6. Qualquer nota na AP2 serve.\nSua N1: ${fmt(n1)}`
            });
        } else if (nota > 10) {
            mostrarPlacar({
                tipo: 'perigo',
                status: 'CONTINUE?',
                rotulo: 'NOTA MÍNIMA NA AP2',
                numero: nota,
                detalhe: `Nem com 10 na AP2 dá pra fechar média 6. Mas na AP3 ainda dá pra passar!\nSua N1: ${fmt(n1)}`,
                acao: { href: '/ap3.html', texto: 'IR PARA A FASE 2' }
            });
        } else {
            mostrarPlacar({
                status: 'OBJETIVO',
                rotulo: 'NOTA MÍNIMA NA AP2',
                numero: nota,
                detalhe: `Você precisa tirar pelo menos ${fmt(nota)} na AP2 para fechar média 6.\nSua N1: ${fmt(n1)}`
            });
        }
    } catch (error) {
        mostrarPlacar({
            tipo: 'perigo',
            status: 'SEM CONEXÃO',
            detalhe: 'Não deu pra falar com o servidor. Tente novamente.'
        });
    } finally {
        botoes.forEach(function (botao) {
            botao.disabled = false;
        });
    }
};
