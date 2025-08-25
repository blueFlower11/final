// __mocks__/db.js
class Row {
  constructor(props) { Object.assign(this, props); }
  async save() { return this; }
  async increment(field, { by = 1 } = {}) {
    this[field] = (this[field] || 0) + by;
    return this;
  }
}

const data = {
  smart: [],
  stupid: [],
  statistics: [],
};

let nextId = 1;
function addSmartRow(row) {
  const r = new Row({ id: nextId++, ...row });
  data.smart.push(r);
  return r;
}
function addStupidRow(row) {
  const r = new Row({ id: nextId++, ...row });
  data.stupid.push(r);
  return r;
}
function resetAll() {
  data.smart = [];
  data.stupid = [];
  data.statistics = [];
  nextId = 1;
}

const makeModel = (key) => ({
  async findAll({ where = {}, limit } = {}) {
    let rows = data[key];
    if (where.step !== undefined) {
      rows = rows.filter(r => r.step === where.step);
    }
    if (where.board && where.board['$in'] /* Sequelize Op.in placeholder for tests */) {
      const list = where.board['$in'];
      rows = rows.filter(r => list.includes(r.board));
    }
    if (Array.isArray(where.board)) {
      rows = rows.filter(r => where.board.includes(r.board));
    }
    return (limit ? rows.slice(0, limit) : rows);
  },
  async findByPk(id) {
    return data[key].find(r => r.id === id) || null;
  },
  get sequelize() {
    return sequelize;
  }
});

const Smart = makeModel('smart');
const Stupid = makeModel('stupid');

const Statistics = {
  async findAll({ where = {}, order, attributes } = {}) {
    let rows = data.statistics;
    if (where.ip) rows = rows.filter(r => r.ip === where.ip);
    // Shape attributes
    return rows.map(r => {
      const obj = {};
      (attributes || ['ip','smartW','smartD','smartL','stupidW','stupidD','stupidL']).forEach(k => { obj[k] = r[k]; });
      return obj;
    });
  },
  async findOrCreate({ where = {}, defaults = {}, transaction } = {}) {
    let row = data.statistics.find(r => r.ip === where.ip);
    if (!row) {
      row = new Row({ id: nextId++, smartW:0, smartD:0, smartL:0, stupidW:0, stupidD:0, stupidL:0, ...defaults });
      data.statistics.push(row);
      return [row, true];
    }
    return [row, false];
  },
};

const sequelize = {
  async authenticate() { return true; },
  async transaction(fn) {
    const t = { LOCK: { UPDATE: 'UPDATE' } };
    return await fn(t);
  },
};

module.exports = {
  sequelize, Smart, Stupid, Statistics,
  __testing: { addSmartRow, addStupidRow, resetAll, data }
};