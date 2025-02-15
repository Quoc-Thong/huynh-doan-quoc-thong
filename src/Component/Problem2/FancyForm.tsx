import styles from "./styles.module.less";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  Button,
  Typography,
  Flex,
  Form,
  InputNumber,
  message,
} from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

interface Currency {
  currency: string;
  date?: Date;
  price: number;
}

export const FancyForm = () => {
  const [currencyForm] = Form.useForm();
  const [currencyList, setCurrencyList] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>({
    currency: "BLUR",
    date: new Date(),
    price: 0,
  });
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "your crypto exchange successfully",
    });
  };

  useEffect(() => {
    fetch(`https://interview.switcheo.com/prices.json`)
      .then((response) => response.json())
      .then((res: Currency[]) => {
        const uniqueCurrencies = res.filter(
          (item, index, array) =>
            index === array.findIndex((t) => t.currency === item.currency)
        );

        const safeData = JSON.parse(JSON.stringify(uniqueCurrencies));

        setCurrencyList(safeData);
        setSelectedCurrency(safeData?.[0]);
        currencyForm.setFieldsValue({
          input: 1,
          output: safeData?.[0]?.price,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCurrencyChange = useCallback(
    (value: string) => {
      const _selectedCurrency = currencyList.find(
        (item) => item.currency === value
      );
      setSelectedCurrency({
        currency: _selectedCurrency?.currency || "",
        date: _selectedCurrency?.date,
        price: _selectedCurrency?.price || 0,
      });
      currencyForm.setFieldsValue({
        input: 1,
        output: _selectedCurrency?.price,
      });
    },
    [currencyForm, currencyList]
  );

  const hanldeOnClickSwap = () => {
    success();
    currencyForm.resetFields();
  };

  const handleOnChangeInput = useCallback(
    (ev: number | null) => {
      currencyForm.setFieldsValue({
        output: Number(ev) * selectedCurrency?.price,
      });
    },
    [currencyForm, selectedCurrency?.price]
  );

  const handleOnChangeOutput = useCallback(
    (ev: number | null) => {
      currencyForm.setFieldsValue({
        input: Number(ev) / selectedCurrency?.price,
      });
    },
    [currencyForm, selectedCurrency?.price]
  );

  return (
    <div className={styles["fancy-form"]}>
      {contextHolder}
      <Title level={1}>Currency Exchange</Title>

      <Form form={currencyForm} layout="vertical">
        <Flex gap={8} justify="space-between" style={{ padding: "0px 16px" }}>
          <Form.Item
            label={"Input amount"}
            name={["input"]}
            style={{ marginBottom: 0, width: "100%" }}
          >
            <InputNumber
              className="w-full"
              onChange={handleOnChangeInput}
              formatter={(value) =>
                `${value}`?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              addonAfter={<div style={{ width: "100px" }}>USD</div>}
            />
          </Form.Item>

          <Form.Item
            label={"Output amount"}
            name={["output"]}
            style={{ marginBottom: 0, width: "100%" }}
          >
            <InputNumber
              className="w-full"
              onChange={(ev: number | null) => handleOnChangeOutput(ev)}
              addonAfter={
                <Select
                  defaultValue={selectedCurrency.currency.toString() || ""}
                  style={{ width: "140px" }}
                  onChange={handleCurrencyChange}
                >
                  {currencyList
                    .filter((e) => e.currency && e.price)
                    .map((e) => (
                      <Select.Option
                        key={`${e.currency}_${e.price}`}
                        value={e.currency}
                      >
                        {e.currency}
                      </Select.Option>
                    ))}
                </Select>
              }
            />
          </Form.Item>
        </Flex>
      </Form>

      <Flex justify="space-between" style={{ padding: "16px" }}>
        <Flex vertical align="flex-start">
          <div>
            $1 USD ={" "}
            <span className={styles["text-currency"]}>
              {selectedCurrency?.price} {selectedCurrency?.currency}
            </span>
          </div>
          <div className="text-left" style={{ color: "#6b7280" }}>
            Mid-market exchange rate at{" "}
            {dayjs(selectedCurrency?.date).format("HH:mm, DD/MM/YYYY")}
          </div>
        </Flex>

        <Button type="primary" onClick={hanldeOnClickSwap}>
          Swap Currency
        </Button>
      </Flex>
    </div>
  );
};
