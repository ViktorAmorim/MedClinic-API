export function validarData(valor: string): boolean {
  const formatoData = /^\d{4}-\d{2}-\d{2}$/;
  const formatoDataHora =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/i;

  if (!formatoData.test(valor) && !formatoDataHora.test(valor)) {
    return false;
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return false;
  }

  const [ano, mes, dia] = valor.slice(0, 10).split("-").map(Number);
  const ultimoDia = new Date(Date.UTC(ano!, mes!, 0)).getUTCDate();

  return mes! >= 1 && mes! <= 12 && dia! >= 1 && dia! <= ultimoDia;
}
