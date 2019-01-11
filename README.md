# pt.md
Library for working with https://pt.md

## Prerequisites

- [ ] NodeJS >= v8.x.x

## Installation

```javascript
npm install pt.md
```

## Usage

```javascript
Pt = require('pt.md');

// Authenticate

const username = 'user@example.com'
const password = 'qwe123';

const pt = Pt.create();

await pt.authenticate(username, password);

// List items

const yesterday = new Date(Date.now() - 86400000);
const now = new Date();
const page = 1;
const pageSize = 100;

const { total, items } = await pt.list(
  yesterday, // from date
  now, // to date
  page, // page number
  pageSize // Items per page
);

/*
total = 1;
items = [
  {
    "isPaid": false,
    "paymentURI": "https://pt.md/BeneficiarZone/TransactionJournal/CardPayOrder?id=123456",
    "rowNum": 1,
    "orderID": 123456,
    "orderDate": "2019-01-01T07:00:00.007Z",
    "orderStateID": 12736,
    "orderStateCode": "PickedUp",
    "orderStateName": "Recepționat",
    "goodsName": "internet magazin",
    "shopCompanyName": null,
    "deliveryCompanyName": "Posta Moldovei",
    "invoiceID": 123456,
    "invoiceNumber": "L000123456",
    "invoicePaymentStateID": 12990,
    "packageWidth": 1,
    "packageHeight": 1,
    "packageDepth": 1,
    "packageWeight": 1,
    "terminalCode": null,
    "moduleCode": null,
    "cellCode": null,
    "cellCategoryName": null,
    "cellTimeBegin": "2019-01-01T07:00:00.000Z",
    "cellTimeEnd": null
  }
]
*/
```

## Development

Running tests:

```javascript
DEBUG='pt.md:*' USER='' PASS='' npm test
```

Running linter (eslint):

```javascript
npm run lint
```

# Support development

I really love open source, however i do need your help to
keep the library up to date. There are several ways to do it:
open issues, submit PRs, share the library w/ community or simply-

<a href="https://etherdonation.com/d?to=0x4a1eade6b3780b50582344c162a547d04e4e8e4a" target="_blank" title="Donate ETH"><img src="https://etherdonation.com/i/btn/donate-btn.png" alt="Donate ETH"/></a>

