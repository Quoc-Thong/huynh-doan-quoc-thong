interface Prices {
  [currency: string]: number;
}

export const usePrices = () => {
  const prices: Prices = {
    ETH: 18,
    BTC: 25,
    OSMO: 1.5,
    bNEO: 0.4,
  };

  return prices;
};
