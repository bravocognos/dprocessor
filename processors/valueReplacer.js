const { Transform } = require('stream');

/**
 * Replaces the value of the specified column
 * 
 * @param {String} columnName column name
 * @param {Any} value value
 * 
 * @returns {Stream} stream
 */
const valueReplacer = (columnName, value) => {
  return new Transform({
    objectMode: true,
    transform(data, _, next) {
      // Custom logic here
      data[columnName] = value;

      // Push data into the pipe
      this.push(data);
      
      // Move to the next row
      this.resume();
      next();
    }
  });
};

module.exports = valueReplacer;