// Formato peso chileno (sin decimales, con punto como separador de miles)
export const formatCLP = (amount: number): string => {
  return '$' + Math.round(amount).toLocaleString('es-CL');
};
