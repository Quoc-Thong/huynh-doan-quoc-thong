/*
- `FormattedWalletBalance` uses `extends` to inherit two properties from `WalletBalance`.
- Need to declare the `BoxProps` interface.
- Missing `export default WalletPage`.
- The `children` variable is not declared in `Props`.
- Missing imports or hook definitions for the two hooks in the page.
- Missing import of `useMemo` from React.
- Need to declare the `blockchain` variable in the `WalletBalance` interface.
- The `lhsPriority` variable has not been declared, which should change based on a ternary operator comparison.
- The `formattedBalances` variable is declared but not used.
- The `WalletRow` component and CSS module classes are not imported.
- `.toFixed()` should be added to `formatted` with a specified number to round the value.

+ Below is the revised file
*/

import classes from "./styles.module.less";
import { useMemo } from "react";
import { WalletRow } from "./WalletRow";
import { usePrices } from "./usePrices";
import { useWalletBalances, WalletBalance } from "./useWalletBalances";

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

const WalletPage = () => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      ?.filter?.((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      ?.sort?.((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances]);

  const formattedBalances: FormattedWalletBalance[] = sortedBalances?.map(
    (balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(4),
    })
  );

  const rows = formattedBalances?.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices?.[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div>{rows}</div>;
};

export default WalletPage;
