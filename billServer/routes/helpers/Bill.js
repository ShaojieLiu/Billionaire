const Kline = require('./Kline')

class Bill {
  constructor(ability = 148.5, param = 126.1) {
    Object.assign(this, {
      ability,
      param
    })
  }

  async init() {
    const {
      ability,
      param
    } = this
    this.brc = await new Kline('brc_qc', 'brc.json').readOrFetch();
    this.eth = await new Kline('eth_qc', 'eth.json').readOrFetch();
    const {
      brc,
      eth
    } = this
    const short = brc.data.length < eth.data.length ? brc : eth;

    this.kl = {}
    const tsArr = Object.keys(short.kl);
    tsArr.forEach(ts => {
      const ethHigh = eth.kl[ts] && eth.kl[ts].high
      const brcHigh = brc.kl[ts] && brc.kl[ts].high
      let dayQc = 0
      let dayBrc = 0
      if (ethHigh && brcHigh) {
        dayQc = ethHigh * ability / param
        dayBrc = dayQc / brcHigh
      }
      const time = new Date(Number(ts))
      const b = {
        ts,
        time,
        ethHigh,
        brcHigh,
        dayQc,
        dayBrc
      }
      this.kl[ts] = b
    })
    return this
  }

  get() {
    return this.kl
  }
}

module.exports = Bill