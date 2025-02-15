export const WalletRow = ({
  className,
  amount,
  usdValue,
  formattedAmount,
}: {
  className: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}) => {
  return (
    <div className={className}>
      {amount} {usdValue} {formattedAmount}
    </div>
  );
};
