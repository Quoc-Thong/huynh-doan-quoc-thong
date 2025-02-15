/*
- FormattedWalletBalance sử dụng extends để kế thừa 2 thuộc tính từ WalletBalance
- cần khai báo interface BoxProps
- thiếu export default WalletPage 
- chưa khai báo biến children trong Props
- thiếu import hoặc tạo hook trong page của 2 hook dưới
- thiếu import useMemo từ React
- khai báo thêm biến blockchain trong interface WalletBalance
- chưa khai báo biến lhsPriority thay đổi bằng so sánh ternary operator
- khai báo biến formattedBalances mà chưa được sử dụng
- chưa import component WalletRow, khai bao classes từ module css
- thêm .toFixed() cho formatted cần thêm số để làm tròn số 

+ Sau đây là file chỉnh sửa lại
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
