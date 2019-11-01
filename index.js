//////
// Imports
//////

const { createConnection } = require('mysql');
const { checkEnvVar } = require('./helpers');
const moment = require('moment');

//////
// Const and vars
//////

// Used for the benchmark
const startDate = moment(new Date(), 'YYYY-M-DD HH:mm:ss');

// DB source information
const source = createConnection({
  host: process.env.DPROCESSOR_SOURCE_DB_HOST,
  user: process.env.DPROCESSOR_SOURCE_DB_USER,
  password: process.env.DPROCESSOR_SOURCE_DB_PWD,
  database: process.env.DPROCESSOR_SOURCE_DB_DBNAME,
  port: process.env.DPROCESSOR_SOURCE_DB_PORT
});
const tableNameSource = process.env.DPROCESSOR_SOURCE_DB_TABLENAME;

// DB target information
const target = createConnection({
  host: process.env.DPROCESSOR_TARGET_DB_HOST,
  user: process.env.DPROCESSOR_TARGET_DB_USER,
  password: process.env.DPROCESSOR_TARGET_DB_PWD,
  database: process.env.DPROCESSOR_TARGET_DB_DBNAME,
  port: process.env.DPROCESSOR_TARGET_DB_PORT,
});
const tableNameTarget = process.env.DPROCESSOR_TARGET_DB_TABLENAME;

//////
// Starts here
//////

/*
 * Flow:
 * 1 - Drop target table
 * 2 - Create target table from source table
 * 3 - Count rows in the source table
 * 4 - Migrate rows
 * 5 - Count rown in the target table
 * 6 - Compare counts
 * 7 - Print benchmark information
 * 8 - Close connections
 */
module.exports = () => {
  checkEnvVar();

  target.query(`DROP TABLE IF EXISTS ${tableNameTarget}`, (error) => {
    if (error) throw error;
    console.log('Target table dropped');

    source.query(`SHOW CREATE TABLE ${tableNameTarget}`, (error, results) => {
      if (error) throw error;

      let tableDescription = results[0]['Create Table'];

      // Updates create statement to only create if doesn't exist
      if (!tableDescription.toUpperCase().includes('CREATE TABLE IF NOT EXISTS')) {
        tableDescription = tableDescription.replace('CREATE TABLE', 'CREATE TABLE IF NOT EXISTS')
      }

      target.query(tableDescription, (error, results) => {
        if (error) throw error;
        console.log('Target table created based on the source table');

        source.query(`SELECT COUNT(*) AS count FROM ${tableNameSource}`, (error, sourceCount) => {
          if (error) throw error;
          sourceCount = sourceCount[0].count

          console.log(`Migration process started @ ${startDate.toString()}`);
          console.log(`Source table count: ${sourceCount} rows`);

          source
            .query(`SELECT * FROM ${tableNameSource}`)
            .on('error', (err) => { throw err; })
            .stream()
            
            //////
            // Adds as many processors you want
            //////
            // Uncomment bellow to demo
            // .pipe(require('./processors/valueReplacer')('XYZ', `Today is ${new Date().toDateString()}`))
            // Uncomment bellow to debug
            // .pipe(require('./processors/dataLogger')())
            .pipe(require('./processors/dataMigrator')(target, tableNameTarget, sourceCount))

            .on('finish', () => {
              target.query(`SELECT COUNT(*) AS count FROM ${tableNameTarget}`, (error, targetCount) => {
                if (error) throw error;
                targetCount = targetCount[0].count;

                console.log(`Target table count: ${targetCount} rows`);

                // Check if source and target rows match
                sourceCount === targetCount ? undefined : console.error(`Error, count doesn't match! Have: ${targetCount} Expected: ${sourceCount}`);

                // Calculate benchmark
                const endDate = moment(new Date(), 'YYYY-M-DD HH:mm:ss');
                const secondsDiff = endDate.diff(startDate, 'seconds');
                console.log(`Migration process finished @ ${endDate.toString()}`);
                console.log(`Migration took ${secondsDiff} second(s)`);

                // Close connections
                source.end();
                target.end();
              });
            })
        });
      });
    });
  });
};