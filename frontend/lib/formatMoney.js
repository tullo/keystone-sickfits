export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'DKK',
    minimumFractionDigits: 2,
  };

  if (amount % 100 === 0) {
    // its a clean danish krone amount
    options.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('da-DK', options);

  return formatter.format(amount / 100);
}
