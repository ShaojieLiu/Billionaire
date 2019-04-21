const path = require('path');
const pathPrice = './public/price'
var axios = require('axios');
var fs = require('fs');

class Kline {
  constructor(market, filePath) {
    this.market = market;
    this.filePath = path.join(pathPrice, filePath);
  }

  init(kline) {
    this.moneyType = kline.moneyType;
    this.symbol = kline.symbol;
    this.data = kline.data;
    this.origin = kline;
    this.initKL()
  }

  fetch() {
    const {
      market
    } = this;
    return (
      axios.get(`http://api.zb.cn/data/v1/kline?market=${market}&type=1day`)
      .then(resp => {
        const {
          data,
          error
        } = resp
        if (data) {
          console.log('after fetch')
          this.init(data);
          return this;
        }
      })
      .then(() => this.write())
      .catch(e => console.error(e)))
  }

  async read() {
    const str = await fs.readFileSync(this.filePath)
    const obj = JSON.parse(str)
    this.init(obj)
    return this;
  }

  async write() {
    const obj = this.origin;
    fs.writeFile(this.filePath, JSON.stringify(obj), () => {});
    this.init(obj)
    return this;
  }

  initKL() {
    this.kl = {};
    this.data.forEach(d => {
      const [ts, start, high, low, end, trade] = d
      this.kl[ts] = {
        ts,
        start,
        high,
        low,
        end,
        trade
      }
    })
  }

  getLastTS() {
    const len = this.data.length;
    return Number(this.data[len - 1][0]);
  }

  isOverDay() {
    return Number(new Date()) - this.getLastTS() > 1000 * 60 * 60 * 24;
  }

  async readOrFetch() {
    await this.read()
    this.isOverDay() && await this.fetch()
    return this;
  }
}

module.exports = Kline