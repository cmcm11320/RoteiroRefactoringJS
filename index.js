const { readFileSync } = require('fs');

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor / 100);
}

function getPeca(pecas) {
      return pecas.id;
    }

function calcularCredito(apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(apre).tipo === "comedia")
    creditos += Math.floor(apre.audiencia / 5);
  return creditos;
}

function calcularTotalCreditos(pecas, apresentacoes) {
  let creditos = 0;
  for (let apre of apresentacoes) {
    creditos += calcularCredito(apre);
  }
  return creditos;
}
function calcularTotalApresentacao(apre, peca) {
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

function calcularTotalFatura(fatura, pecas) {
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

function gerarFaturaHTML(fatura, pecas) {
  let faturaHTML = '<html>\n';
  faturaHTML += '<p> Fatura ' + fatura.cliente + '</p>\n';
  faturaHTML += '<ul>\n';

  for (let apre of fatura.apresentacoes) {
    const peca = pecas[getPeca(apre)];
    let total = calcularTotalApresentacao(apre, peca);

    faturaHTML += '<li> ' + peca.nome + ': ' + formatarMoeda(total / 100) + ' (' + apre.audiencia + ' assentos) </li>\n';
  }

  faturaHTML += '</ul>\n';
  faturaHTML += '<p> Valor total: ' + formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes)) + '</p>\n';
  faturaHTML += '<p> Créditos acumulados: ' + calcularTotalCreditos(pecas, fatura.apresentacoes) + '</p>\n';
  faturaHTML += '</html>';

  return faturaHTML;
}


const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);












