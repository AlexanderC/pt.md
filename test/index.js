/* eslint no-undef:0, one-var-declaration-per-line:0, one-var:0, no-unused-expressions:0 */

const { expect } = require('chai');
const Pt = require('../src');

suite('pt.md', async () => {
  let pt, username, password;

  setup(async () => {
    pt = Pt.create();

    const { USER, PASS } = process.env;

    if (!USER || !PASS) {
      throw new Error('You should provide USER and PASS to authenticate');
    }

    username = USER;
    password = PASS;
  });

  suite('Pt', async () => {
    test('should authenticate and list items', async () => {
      const yesterday = new Date(Date.now() - 86400000);
      const now = new Date();
      const page = 1;
      const pageSize = 100;

      let error = null;

      try {
        await pt.authenticate(username, password);
      } catch (e) {
        error = e;
      }

      const { total, items } = await pt.list(yesterday, now, page, pageSize);
console.log('total', total)
console.log('items', ...items)
      expect(total).to.be.gte(0);
      expect(items).to.be.an('array');

      expect(error).to.be.null;
    });

//     test('should list items', async () => {
//       const yesterday = new Date(Date.now() - 86400000);
//       const now = new Date();
//       const page = 1;
//       const pageSize = 100;

//       const { total, items } = await pt.list(yesterday, now, page, pageSize);
// console.log('total', ...total)
// console.log('items', ...items)
//       expect(total).to.be.gte(0);
//       expect(items).to.be.an('array');
//     });
  });
});
