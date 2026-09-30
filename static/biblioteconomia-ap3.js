ligarCargaHoraria({
    '60': 'Use N1 e N2 como aparecem no SCA. Regra #19.',
    '30': 'Use a única nota (N1 ou N2) que aparece no SCA. Regra #37 ou #38.'
});

document.getElementById('ap3Form').onsubmit = function (event) {
    event.preventDefault();

    let media, notaBase, detalhes;

    if (cargaHoraria() === '60') {
        const n1 = parseNota(document.getElementById('n1').value);
        const n2 = parseNota(document.getElementById('n2').value);

        if (!notaValida(n1) || !notaValida(n2)) {
            carimbar('Ficha incompleta', 'Preencha N1 e N2 com notas entre 0 e 10.');
            return;
        }

        media = (n1 + n2) / 2;
        notaBase = Math.max(n1, n2);
        detalhes = `Média N1 e N2: ${fmt(media)}\nMaior nota (N1 ou N2): ${fmt(notaBase)}`;
    } else {
        const n = parseNota(document.getElementById('n').value);

        if (!notaValida(n)) {
            carimbar('Ficha incompleta', 'Preencha a nota com um número entre 0 e 10.');
            return;
        }

        media = n;
        notaBase = n;
        detalhes = `Sua nota: ${fmt(n)}`;
    }

    if (media >= 6) {
        carimbar('Aprovada', `Média final: ${fmt(media)}\nNão precisa fazer a AP3. Boas férias!`, true);
        return;
    }

    const ap3Necessaria = 10 - notaBase;

    if (ap3Necessaria > 10) {
        carimbar('Sem chance', `Nem com 10 na AP3 dá pra chegar em 5.\n\n${detalhes}`);
    } else {
        carimbar(`AP3 ≥ ${fmt(ap3Necessaria)}`, `Você precisa tirar pelo menos ${fmt(ap3Necessaria)} na AP3 para fechar média final 5.\n\n${detalhes}`);
    }
};
