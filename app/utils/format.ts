export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
  return amount.toFixed(8);
};

export const formatCrypto = (amount: number, decimals: number = 8): string => {
  return amount.toFixed(decimals);
};

export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const maskValue = (value: string, hidden: boolean): string => {
  if (!hidden) return value;
  return '••••••';
};
