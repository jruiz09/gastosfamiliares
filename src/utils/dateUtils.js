export function getMonthDateRange(anio, mes) {
  const fechaInicio = new Date(Date.UTC(anio, mes - 1, 1));
  const fechaFin = new Date(Date.UTC(anio, mes, 0));

  return {
    fechaDesde: fechaInicio.toISOString().slice(0, 10),
    fechaHasta: fechaFin.toISOString().slice(0, 10),
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
