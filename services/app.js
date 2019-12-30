const fs = require("fs");
const Arweave = require("arweave/node");
const getCompoundTokens = require("./compound_api");

// Set Arweave parameters from commandline or defaults.
const arweave_port = 443;
const arweave_host = "arweave.net";
const arweave_protocol = "https";
const walletFile = "wallet/arweave-keyfile.json";

const raw_wallet = fs.readFileSync(walletFile);
const wallet = JSON.parse(raw_wallet);

const arweave = Arweave.init({
  host: arweave_host,
  port: arweave_port,
  protocol: arweave_protocol
});

async function archive() {
  const now = new Date();
  //   console.log(`Data: ${data}`);

  const res = await getCompoundTokens();
  // console.log(res);

  if (res.cToken) {
    const token_data = res.cToken.map(token => ({
      name: token.name,
      symbol: token.symbol,
      token_address: token.token_address,
      underlying_name: token.underlying_name,
      underlying_symbol: token.underlying_symbol,
      underlying_address: token.underlying_address,
      underlying_price: token.underlying_price.value,
      exchange_rate: token.exchange_rate.value,
      collateral_factor: token.collateral_factor.value,
      borrow_rate: token.borrow_rate.value,
      supply_rate: token.supply_rate.value,
      reserves: token.reserves.value,
      total_borrows: token.total_borrows.value,
      total_supply: token.total_supply.value,
      cash: token.cash.value,
      number_of_borrowers: token.number_of_borrowers,
      number_of_suppliers: token.number_of_suppliers,
      interest_rate_model_address: token.interest_rate_model_address
    }));

    let date = now.toISOString().split("T")[0];
    let hour = now.getHours();

    await Promise.all(
      token_data.map(async data => {
        data = JSON.stringify(data);
        let tx = await arweave.createTransaction({ data }, wallet);
        tx.addTag("Content-Type", "application/json");
        tx.addTag("Stream-Name", "cTokensV1");
        tx.addTag("cToken-Name", data.name);
        tx.addTag("cToken-Symbol", data.symbol);
        tx.addTag("Date", date);
        tx.addTag("Hour", hour.toString());
        return dispatchTX(tx);
      })
    );
  }
}

async function dispatchTX(tx) {
  const now = new Date();
  // Manually set the transaction anchor, for now.
  const anchor_id = await arweave.api.get("/tx_anchor").then(x => x.data);
  tx.last_tx = anchor_id;

  // Sign and dispatch the TX.
  await arweave.transactions.sign(tx, wallet);
  let resp = await arweave.transactions.post(tx);

  let output =
    `Transaction ${tx.get("id")} dispatched to ` +
    `${arweave_host}:${arweave_port} with response: ${
      resp.status
    }. at ${now.toISOString()}`;
  console.log(output);
}

module.exports = async function run() {
  const address = await arweave.wallets.jwkToAddress(wallet);
  let balance = arweave.ar.winstonToAr(
    await arweave.wallets.getBalance(address)
  );

  console.log(`Using wallet ${address} (balance: ${balance} AR).`);

  archive().catch(err => console.error(err));
};
