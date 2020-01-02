# Compound Tokens Permafeed

Track **Compound** platform token data statistics.
Stats are pulled directly from the Compound Api and stored in **Arweave** for faster
historical querying.

## What's included

Data is archived from address `Nzza7AYNpAzSTVIcNJA-ye-_SzKZS-nPwkiJe4bAfEM` hourly in `Json` format:

```
{
 "name": "Compound Sai",
 "symbol": "cSAI",
 "token_address": "0xf5dce57282a584d2746faf1593d3121fcac444dc",
 "underlying_name": "Sai",
 "underlying_symbol": "SAI",
 "underlying_address": "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
 "underlying_price": "0.007535457218968673",
 "exchange_rate": "0.021130231584625500",
 "collateral_factor": "0.75000000000000000",
 "borrow_rate": "0.091029851194463559",
 "supply_rate": "0.029680895378911329",
 "reserves": "26038.06148182209625167935000",
 "total_borrows": "2346526.60587783501553418",
 "total_supply": "323557645.08791056",
 "cash": "4516359.427287602559199114",
 "number_of_borrowers": 447,
 "number_of_suppliers": 8611,
 "interest_rate_model_address": "0xa1046abfc2598f48c44fb320d281d3f3c0733c9a"
}
```

|Name|Description|Unit|Example|
|---|---|---|---|
|name|The name of the ctoken|	|Compound Sai|
|symbol|The symbol of the ctoken| |cSAI|
|token_address|The public Ethereum address of the cToken| |0xf5dce57282a584d2746faf1593d3121fcac444dc|
|underlying_name|The name of the underlying token| |Sai|
|underlying_symbol|The symbol of the underlying token| |SAI|
|underlying_address|The address of the underlying token| |0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359|
|underlying_price|The price of the underlying token in eth|ETH|0.007535457218968673|
|exchange_rate|The cToken / underlying exchange rate. This rate increases over time as supply interest accrues.| |0.021130231584625500|
|collateral_factor|The amount of the value of the underlying token that will count as collateral.| |0.75000000000000000|
|borrow_rate|The floating borrow interest rate| |0.091029851194463559|
|supply_rate|The floating supply interest rate| |0.029680895378911329|
|reserves|The amount of underylying tokens held by reserves| |26038.06148182209625167935000|
|total_borrows|The amount of underlying tokens borrowed from the cToken| |2346526.60587783501553418|
|total_supply|The number of cTokens in existence| |323557645.08791056|
|cash|The current liquidity of the cToken| |4516359.427287602559199114|
|number_of_borrowers|The number of accounts with oustanding borrows| |447|
|number_of_suppliers|The number of accounts holding this cToken| |8611|
|interest_rate_model_address|The address of the interest rate model| |0xa1046abfc2598f48c44fb320d281d3f3c0733c9a|

Each data point is also attached to these tags:

* `Feed-Name` is always `cTokensV2`, use to search for all transactions in the stream.
* `cToken-Name` will take name of compound token to search from all transaction in the feeds, e.g `Compound Sai`.
* `cToken-Symbol` will take symbol of compound token to search from all transaction in the feeds, e.g `cSai`.
* `Date` in `YYYY-MM-DD` format, use to search data points by date.
* `Hour` in `hh` format, use to chart by 1h, 3h, 1D...

## ArQL Example

* Get all data point:

```
{
  op: "and",
  expr1: {
    op: "equals",
    expr1: "from",
    expr2: "Nzza7AYNpAzSTVIcNJA-ye-_SzKZS-nPwkiJe4bAfEM"
  },
  expr2: {
    op: "equals",
    expr1: "Feed-Name",
    expr2: "cTokensV2"
  }
}
```

* Get all data point of Compound Sai token by token name:

```
{
  op: "and",
  expr1: {
    op: "equals",
    expr1: "from",
    expr2: "Nzza7AYNpAzSTVIcNJA-ye-_SzKZS-nPwkiJe4bAfEM"
  },
  expr2: {
    op: "and",
    expr1: {
      op: "equals",
      expr1: "cToken-Name",
      expr2: "Compound Sai"
    },
    expr2: {
      op: "equals",
      expr1: "Feed-Name",
      expr2: "cTokensV2"
    }
  }
}
```

* Get all data point of Compound Sai token by token symbol:

```
{
  op: "and",
  expr1: {
    op: "equals",
    expr1: "from",
    expr2: "Nzza7AYNpAzSTVIcNJA-ye-_SzKZS-nPwkiJe4bAfEM"
  },
  expr2: {
    op: "and",
    expr1: {
      op: "equals",
      expr1: "cToken-Symbol",
      expr2: "cSai"
    },
    expr2: {
      op: "equals",
      expr1: "Feed-Name",
      expr2: "cTokensV2"
    }
  }
}
```

* Get data points by date `2020-01-02`:
  
```
{
  op: "and",
  expr1: {
    op: "equals",
    expr1: "from",
    expr2: "Nzza7AYNpAzSTVIcNJA-ye-_SzKZS-nPwkiJe4bAfEM"
  },
  expr2: {
    op: "and",
    expr1: {
      op: "equals",
      expr1: "Date",
      expr2: "2020-01-02"
    },
    expr2: {
      op: "equals",
      expr1: "Feed-Name",
      expr2: "cTokensV2"
    }
  }
}
```

* Get data daily at `00:00 AM`:

```
{
  op: "and",
  expr1: {
    op: "equals",
    expr1: "from",
    expr2: "Nzza7AYNpAzSTVIcNJA-ye-_SzKZS-nPwkiJe4bAfEM"
  },
  expr2: {
    op: "and",
    expr1: {
      op: "equals",
      expr1: "Hour",
      expr2: "0"
    },
    expr2: {
      op: "equals",
      expr1: "Feed-Name",
      expr2: "cTokensV2"
    }
  }
}
```

## How to run

1. Clone the project:
    ```bash
    git clone https://github.com/mmitrasish/cTokenPermafeed.git
    ```

2. Enter the directory and install the dependencies:
    ```bash
    cd cTokenPermafeed
    npm install
    ```
3. Run the app
    ```bash
    npm start
    ```
