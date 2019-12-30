const fetch = require("node-fetch");

module.exports = async function getCompoundTokens() {
  const res = await fetch("https://api.compound.finance/api/v2/ctoken")
    .then(res => res.json())
    .catch(err => console.log(err));
  return res;
};
