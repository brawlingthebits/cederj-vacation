ligarCargaHoraria({
    '60': 'AD1, AP1, AD2 e AP2. No SCA: regra #19.',
    '30': 'Só AD1 e AP1, ou só AD2 e AP2. No SCA: regra #37 ou #38.'
});

document.querySelectorAll('input[name="carga"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        document.getElementById('botaoCalcular').innerText = cargaHoraria() === '60' ? 'Calcular AP2' : 'Calcular AP';
    });
});

document.getElementById('notaForm').onsubmit = function (event) {
    event.preventDefault();

    let apNecessaria, nomeAP;

    if (cargaHoraria() === '60') {
        const ad1 = parseNota(document.getElementById('ad1').value);
        const ap1 = parseNota(document.getElementById('ap1').value);
        const ad2 = parseNota(document.getElementById('ad2').value);

        if (![ad1, ap1, ad2].every(notaValida)) {
            carimbar('Ficha incompleta', 'Preencha AD1, AP1 e AD2 com notas entre 0 e 10.');
            return;
        }

        const n1 = (ad1 * 4 + ap1 * 6) / 10;
        const n2Necessario = 12 - n1;
        apNecessaria = (n2Necessario * 10 - ad2 * 4) / 6;
        nomeAP = 'AP2';
    } else {
        const ad = parseNota(document.getElementById('ad').value);

        if (!notaValida(ad)) {
            carimbar('Ficha incompleta', 'Preencha a AD com uma nota entre 0 e 10.');
            return;
        }

        apNecessaria = (6 * 10 - ad * 4) / 6;
        nomeAP = 'AP';
    }

    if (apNecessaria <= 0) {
        carimbar('Média 6 garantida', `Qualquer nota na ${nomeAP} serve.`, true);
    } else if (apNecessaria > 10) {
        carimbar('Vai pra AP3', `Nem com 10 na ${nomeAP} dá pra fechar média 6, mas na AP3 ainda dá pra passar.`);
    } else {
        carimbar(`${nomeAP} ≥ ${fmt(apNecessaria)}`, `Você precisa tirar pelo menos ${fmt(apNecessaria)} na ${nomeAP} para fechar média 6.`, true);
    }
};
