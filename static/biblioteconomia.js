// Funções comuns às telas de Biblioteconomia
// Notas: N = (ADx4 + APx6)/10
// 60h (regra #19): N1 e N2; média (N1 + N2)/2 >= 6, senão NF = [MAIOR(N1, N2) + AP3]/2
// 30h (regras #37 e #38): só uma AD e uma AP; N >= 6, senão NF = (N + AP3)/2
// Com AP3, precisa de NF >= 5

console.log('%c[BIBLIO] Catalogando curiosos no console... CDD 020', 'color: #b3261e; font-family: monospace;');
console.log('%c-- Site reformulado numa sexta-feira depois de muito chá de hibisco', 'color: #888888; font-style: italic; font-family: monospace;');

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

function cargaHoraria() {
    return document.querySelector('input[name="carga"]:checked').value;
}

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

// Data no formato de carimbo de biblioteca: 29 SET 2026
function dataCarimbo() {
    const hoje = new Date();
    return `${String(hoje.getDate()).padStart(2, '0')} ${MESES[hoje.getMonth()]} ${hoje.getFullYear()}`;
}

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let digitacao = null;

// Escreve o texto como numa máquina de escrever
function datilografar(elemento, texto) {
    clearInterval(digitacao);
    elemento.classList.remove('digitando');

    if (semAnimacao) {
        elemento.innerText = texto;
        return;
    }

    let i = 0;
    elemento.innerText = '';
    elemento.classList.add('digitando');
    digitacao = setInterval(function () {
        i++;
        elemento.innerText = texto.slice(0, i);
        if (i >= texto.length) {
            clearInterval(digitacao);
            elemento.classList.remove('digitando');
        }
    }, 18);
}

// Mostra o resultado como carimbo na ficha
function carimbar(carimbo, detalhe, ok) {
    const resultado = document.getElementById('result');
    const elCarimbo = resultado.querySelector('.carimbo');

    elCarimbo.querySelector('.carimbo-texto').innerText = carimbo;
    elCarimbo.querySelector('.carimbo-data').innerText = dataCarimbo();
    elCarimbo.classList.toggle('ok', !!ok);
    elCarimbo.classList.remove('batendo');
    void elCarimbo.offsetWidth; // reinicia a animação
    elCarimbo.classList.add('batendo');

    resultado.querySelector('.detalhe-leitura').innerText = detalhe;
    resultado.classList.remove('hidden');
    datilografar(resultado.querySelector('.detalhe-digitado'), detalhe);
}

// Alterna os campos de 60h e 30h
function ligarCargaHoraria(notas) {
    function atualizar() {
        const is60 = cargaHoraria() === '60';
        document.getElementById('campos60').classList.toggle('hidden', !is60);
        document.getElementById('campos30').classList.toggle('hidden', is60);
        document.getElementById('hintCarga').innerText = is60 ? notas['60'] : notas['30'];
        document.getElementById('result').classList.add('hidden');
    }

    document.querySelectorAll('input[name="carga"]').forEach(function (radio) {
        radio.onchange = atualizar;
    });
    atualizar();
}
