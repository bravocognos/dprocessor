const { jsonStringifiedPretty } = require('../helpers');
const { Transform } = require('stream');
const ProgressBar = require('progress');

/**
 * Inserts data from a source table into the target table
 * 
 * @param {Object} mySQLConnectionTarget target MySQL connection
 * @param {String} tableNameTarget target table name
 * @param {Number} sourceCount source table rows count
 * 
 * @returns {Stream} stream
 */
const dataMigrator = (mySQLConnectionTarget, tableNameTarget, sourceCount) => {
  const bar = new ProgressBar('Copying [:bar] :rate/bps :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 31,
    total: sourceCount
  });

  return new Transform({
    objectMode: true,
    transform(data, _, next) {
      // Custom logic here
      const stream = this;

      mySQLConnectionTarget.query(`INSERT INTO ${tableNameTarget} SET ?`, data, (error) => {
        if (error) throw error;

        // Increase progress bar
        bar.tick(1);

        // Push data into the pipe
        stream.push(data);
        
        // Move to the next row
        stream.resume();
        next();
      }).on('error', (err) => {
        throw new Error(`Failed to insert row ${jsonStringifiedPretty(data)}. Error: ${err.message}`)
      })
    }
  });
};

module.exports = dataMigrator;