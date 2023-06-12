class ServicoCalculoFatura {

  constructor(repo) {
     this.repo = repo;
  }

 calcularCredito(apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(apre).tipo === "comedia")
    creditos += Math.floor(apre.audiencia / 5);
  return creditos;
}
   
   calcularTotalCreditos(pecas, apresentacoes) {
  let creditos = 0;
  for (let apre of apresentacoes) {
    creditos += calcularCredito(apre);
  }
  return creditos;
}
   
   calcularTotalApresentacao(apre, peca) {
  let total = 0;
  switch (peca.tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) {
        total += 10000 + 500 * (apre.audiencia - 20);
      }
      total += 300 * apre.audiencia;
      break;
    default:
      throw new Error(`Peça desconhecida: ${peca.tipo}`);
  }
  return total;
}
   
   calcularTotalFatura(fatura, pecas) {
  let totalFatura = 0;
  let faturaStr = '';
  let creditos = 0;

  for (let apre of fatura.apresentacoes) {
    const peca = pecas[getPeca(apre)];
    let total = calcularTotalApresentacao(apre, peca);

    // créditos para próximas contratações
    creditos += Math.max(apre.audiencia - 30, 0);
    if (peca.tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);

    // mais uma linha da fatura
    faturaStr += `  ${peca.nome}: ${formatarMoeda(total / 100)} (${apre.audiencia} assentos)\n`;
    totalFatura += total;
  }

  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
  faturaStr += `Créditos acumulados: ${creditos} \n`;

  return faturaStr;
}
}