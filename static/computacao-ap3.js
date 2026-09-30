// Easter egg no console - old school style AP3
console.log('%c', 'font-size: 1px;');
console.log('%c╔═══════════════════════════════════════════════════════╗', 'color: #ff0000; font-family: monospace; font-weight: bold;');
console.log('%c║ >>> AP3 CALCULATOR - LAST CHANCE MODE ACTIVATED <<< ║', 'color: #ff0000; font-family: monospace; font-weight: bold;');
console.log('%c╚═══════════════════════════════════════════════════════╝', 'color: #ff0000; font-family: monospace; font-weight: bold;');
console.log('%c', 'font-size: 1px;');
console.log('%c[ALERT] Por que está usando F12 no meu site?', 'color: #ffcc00; font-family: monospace;');
console.log('%c[QUERY] Quer me hackear?', 'color: #ff6b6b; font-family: monospace;');
console.log('%c-- Site reformulado numa sexta-feira depois de muito chá de hibisco', 'color: #888888; font-style: italic; font-family: monospace;');
console.log('%c', 'font-size: 1px;');
console.log('%c[EOF]', 'color: #888888; font-family: monospace;');

document.getElementById('ap3Form').onsubmit = function (event) {
    event.preventDefault();

    const n1 = parseNota(document.getElementById('n1').value);
    const n2 = parseNota(document.getElementById('n2').value);

    if (!notaValida(n1) || !notaValida(n2)) {
        mostrarPlacar({
            tipo: 'perigo',
            status: 'ERRO',
            detalhe: 'Preencha N1 e N2 com notas entre 0 e 10.'
        });
        return;
    }

    const media = (n1 + n2) / 2;

    if (media >= 6) {
        mostrarPlacar({
            tipo: 'ok',
            status: 'VOCÊ JÁ PASSOU!',
            rotulo: 'MÉDIA FINAL',
            numero: media,
            detalhe: 'Não precisa fazer a AP3.\nPode relaxar e curtir as férias!'
        });
        return;
    }

    const maiorNota = Math.max(n1, n2);
    const ap3Necessaria = 10 - maiorNota;

    mostrarPlacar({
        tipo: ap3Necessaria >= 10 ? 'perigo' : '',
        status: ap3Necessaria >= 10 ? 'ÚLTIMA VIDA' : 'OBJETIVO',
        rotulo: 'NOTA MÍNIMA NA AP3',
        numero: ap3Necessaria,
        detalhe: `Você precisa tirar pelo menos ${fmt(ap3Necessaria)} na AP3 para fechar média final 5.\nMédia atual: ${fmt(media)} · Maior nota (N1 ou N2): ${fmt(maiorNota)}`
    });
};
