function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  let totalFatura = 0;
  let creditos = 0;

  for (let apre of fatura.apresentacoes) {
    const peca = pecas[getPeca(apre)];
    let total = calcularTotalApresentacao(apre, peca);

    // créditos para próximas contratações
    creditos += Math.max(apre.audiencia - 30, 0);
    if (peca.tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }

    // mais uma linha da fatura
    faturaStr += `  ${peca.nome}: ${formatarMoeda(total / 100)} (${apre.audiencia} assentos)\n`;
    totalFatura += total;
  }

  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
  faturaStr += `Créditos acumulados: ${creditos}\n`;

  return faturaStr;
}