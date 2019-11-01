const { Transform } = require('stream');

/**
 * Log stream data to stdout
 * 
 * @returns {Stream} stream
 */
const dataLogger = () => {
  return new Transform({
    objectMode: true,
    transform(data, _, next) {
      // Custom logic here
      console.log(data);

      // Push data into the pipe
      this.push(data);

      // Move to the next row
      this.resume();
      next();
    }
  });
};

module.exports = dataLogger;