// Funções comuns às telas de Computação
// Notas: N = (ADx2 + APx8)/10
// Média (N1 + N2)/2 >= 6 aprova; senão NF = [MAIOR(N1, N2) + AP3]/2 e precisa de NF >= 5

// Aceita vírgula e ponto
function parseNota(valor) {
    return parseFloat(valor.trim().replace(',', '.'));
}

function notaValida(valor) {
    return !isNaN(valor) && valor >= 0 && valor <= 10;
}

function fmt(valor) {
    return valor.toFixed(2).replace('.', ',');
}

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let contagem = null;

// Sobe o número do placar de 0 até o valor, como num fliperama
function contar(elemento, valor) {
    clearInterval(contagem);

    if (semAnimacao) {
        elemento.innerText = fmt(valor);
        return;
    }

    const passos = 12;
    let passo = 0;
    contagem = setInterval(function () {
        passo++;
        elemento.innerText = fmt((valor * passo) / passos);
        if (passo >= passos) {
            clearInterval(contagem);
        }
    }, 35);
}

// Mostra o resultado no placar
// tipo: 'ok' (verde), 'perigo' (vermelho) ou vazio (amarelo)
function mostrarPlacar(opcoes) {
    const hud = document.getElementById('result');
    const placar = hud.querySelector('.hud-placar');
    const energia = hud.querySelector('.hud-energia');
    const barra = hud.querySelector('.barra');
    const acao = hud.querySelector('.hud-acao');
    const temNumero = typeof opcoes.numero === 'number';

    hud.classList.remove('ok', 'perigo', 'aparecendo');
    if (opcoes.tipo) {
        hud.classList.add(opcoes.tipo);
    }

    hud.querySelector('.hud-status').innerText = opcoes.status;
    hud.querySelector('.hud-detalhe').innerText = opcoes.detalhe;

    placar.hidden = !temNumero;
    energia.hidden = !temNumero;
    barra.style.setProperty('--nivel', 0);

    if (opcoes.acao) {
        acao.href = opcoes.acao.href;
        acao.innerText = opcoes.acao.texto;
        acao.hidden = false;
    } else {
        acao.hidden = true;
    }

    hud.hidden = false;
    void hud.offsetWidth; // reinicia a animação
    hud.classList.add('aparecendo');

    if (temNumero) {
        hud.querySelector('.hud-rotulo').innerText = opcoes.rotulo;
        contar(hud.querySelector('.hud-numero'), Math.max(opcoes.numero, 0));
        // Espera um quadro para a barra encher a partir do zero
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                barra.style.setProperty('--nivel', Math.min(Math.max(opcoes.numero, 0), 10));
            });
        });
    }
}
