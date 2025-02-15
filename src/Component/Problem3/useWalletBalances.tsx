export interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

export const useWalletBalances = () => {
  const balances: WalletBalance[] = [];

  return balances;
};
