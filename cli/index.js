#!/usr/bin/env node

const Configstore = require('configstore');
const { prompt } = require('enquirer');
const chalk = require('chalk');
const Table = require('terminal-table');
const terminalLink = require('terminal-link');
const yargs = require('yargs');
const pkg = require('../package.json');
const Pt = require('../src/index');
const debug = require('../src/helper/debug')(__filename);

function config() {
  const conf = new Configstore(pkg.name, {
    username: null,
    password: null,
  });

  debug(`Configuration for "${pkg.name}" loaded`, conf);

  return conf;
}

function info(msg) {
  console.info(chalk.yellow(msg)); // eslint-disable-line
}

function error(err, hint = null) {
  console.error(chalk.red(err)); // eslint-disable-line

  if (hint) {
    console.log(''); // eslint-disable-line
    info(hint);
  }

  process.exit(1);
}

function display(items) {
  const table = new Table({
    borderStyle: 3,
    horizontalLine: true,
    leftPadding: 1,
    rightPadding: 1,
  });

  table.push(
    [
      'Paid', 'Id', 'Date', 'Status', 'Shop', 'Goods Name', 'Delivery Company', 'Actions',
    ].map(col => chalk.gray(col)),
  );

  for (const item of items) { // eslint-disable-line
    const {
      isPaid, orderID, orderDate, orderStateCode, shopCompanyName, goodsName, deliveryCompanyName,
    } = item;

    const row = [
      isPaid ? chalk.green('v') : chalk.yellow('x'),
      orderID,
      orderDate.toGMTString(),
      orderStateCode,
      shopCompanyName || chalk.blue('N/A'),
      goodsName,
      deliveryCompanyName,
    ];

    if (!isPaid) {
      row.push(terminalLink('Pay', item.paymentURI));
    } else {
      row.push(chalk.blue('N/A'));
    }

    table.push(row);
  }

  console.log(table.toString()); // eslint-disable-line
}

yargs // eslint-disable-line
  .command(
    'configure',
    'Configure pt.md client',
    () => {},
    async () => {
      const conf = config();

      const response = await prompt([
        {
          type: 'input',
          name: 'username',
          message: `Username [${conf.get('username', 'N/A')}]`,
        },
        {
          type: 'input',
          name: 'password',
          message: `Password [${conf.get('password', 'N/A')}]`,
        },
      ]);

      conf.set('username', response.username || conf.get('username'));
      conf.set('password', response.password || conf.get('password'));
    },
  )
  .command(
    'list',
    'List current deliveries',
    (yargs) => { // eslint-disable-line
      const last7Days = new Date(Date.now() - 86400000 * 7);

      return yargs
        .option('from', {
          alias: 'f',
          type: 'string',
          coerce(arg) { return new Date(arg); },
          describe: 'Date to list from. Default: Last 7 days',
          default: last7Days,
        })
        .option('to', {
          alias: 't',
          type: 'string',
          coerce(arg) { return new Date(arg); },
          describe: 'Date to list to. Default: now',
          default: new Date(),
        })
        .option('page', {
          alias: 'p',
          type: 'number',
          describe: 'Page number',
          default: 1,
        })
        .option('size', {
          alias: 's',
          type: 'number',
          describe: 'How many items to retrieve per page',
          default: 10,
        });
    },
    async (argv) => {
      const conf = config();
      const {
        from, to, page, size,
      } = argv;

      const pt = Pt.create();

      try {
        debug(`Authorize with username:${conf.get('username')} and password:${conf.get('password') ? 'YES' : 'N/A'}`);

        await pt.authenticate(conf.get('username'), conf.get('password'));
      } catch (err) {
        error(
          err,
          'Configure your pt.md client using "pt.md configure" command.',
        );
      }

      try {
        debug('List arguments', {
          from, to, page, size,
        });

        const { items } = await pt.list(from, to, page, size);

        display(items);
      } catch (err) {
        error(err);
      }
    },
  )
  .command({ command: '*', handler() { yargs.showHelp(); } })
  .help('h')
  .alias('h', 'help')
  .epilog('Made with ♡ by AlexanderC')
  .scriptName(pkg.name)
  .argv;
