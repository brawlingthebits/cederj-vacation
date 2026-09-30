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

// Reinicia uma animação de CSS trocando a classe
function reanimar(elemento, classe) {
    if (!elemento) {
        return;
    }
    elemento.classList.remove(classe);
    void elemento.offsetWidth;
    elemento.classList.add(classe);
}

const CORES_CONFETE = ['#ffcc00', '#ff66c4', '#6c5ce7', '#00ff88', '#3ee6ff'];

// Estoura confete de pixels na tela
function soltarConfete() {
    if (semAnimacao) {
        return;
    }

    const crt = document.getElementById('crt');
    const hud = document.getElementById('result');
    const origem = hud.offsetTop + 30 + 'px';

    for (let i = 0; i < 28; i++) {
        const confete = document.createElement('span');
        const angulo = Math.random() * Math.PI * 2;
        const distancia = 60 + Math.random() * 140;
        confete.className = 'confete';
        confete.style.setProperty('--y0', origem);
        confete.style.setProperty('--x', Math.cos(angulo) * distancia + 'px');
        confete.style.setProperty('--y', Math.sin(angulo) * distancia + 60 + 'px');
        confete.style.setProperty('--r', Math.round(Math.random() * 720) + 'deg');
        confete.style.setProperty('--cor', CORES_CONFETE[i % CORES_CONFETE.length]);
        confete.addEventListener('animationend', function () {
            confete.remove();
        });
        crt.appendChild(confete);
    }
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
    reanimar(hud, 'aparecendo');

    // Uma ficha cai na porta de fichas e o joystick dá uma mexida
    reanimar(document.getElementById('ficha'), 'caindo');
    reanimar(document.getElementById('joystick'), 'mexe');

    if (opcoes.tipo === 'perigo') {
        reanimar(document.getElementById('crt'), 'tremendo');
    } else if (opcoes.tipo === 'ok') {
        soltarConfete();
    }

    hud.scrollIntoView({ block: 'nearest', behavior: semAnimacao ? 'auto' : 'smooth' });

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

// Liga a TV uma vez ao abrir a página (só no computador; no celular a tela já aparece pronta)
(function ligarTela() {
    const conteudo = document.querySelector('.crt-conteudo');
    if (!conteudo || semAnimacao || !window.matchMedia('(min-width: 601px)').matches) {
        return;
    }
    conteudo.classList.add('ligando');
    conteudo.addEventListener('animationend', function fim(event) {
        if (event.animationName === 'ligar') {
            conteudo.classList.remove('ligando');
            conteudo.removeEventListener('animationend', fim);
        }
    });
})();

// O botão LIMPAR apaga as notas e o placar
document.querySelector('form').addEventListener('reset', function () {
    document.getElementById('result').hidden = true;
    document.querySelector('.barra').style.setProperty('--nivel', 0);
});
