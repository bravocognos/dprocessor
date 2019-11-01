/**
 * Returns a beautified stringfied version of an object
 * 
 * @param {Object} obj data obj
 * @returns {String}
 */
const jsonStringifiedPretty = (obj) => {
  return JSON.stringify(obj, null, 2);
};

const checkEnvVar = () => {
  if (!process.env.DPROCESSOR_SOURCE_DB_HOST) throw new Error('Missing "DPROCESSOR_SOURCE_DB_HOST"');
  if (!process.env.DPROCESSOR_SOURCE_DB_USER) throw new Error('Missing "DPROCESSOR_SOURCE_DB_USER"');
  if (!process.env.DPROCESSOR_SOURCE_DB_PWD) throw new Error('Missing "DPROCESSOR_SOURCE_DB_PWD"');
  if (!process.env.DPROCESSOR_SOURCE_DB_DBNAME) throw new Error('Missing "DPROCESSOR_SOURCE_DB_DBNAME"');
  if (!process.env.DPROCESSOR_SOURCE_DB_PORT) throw new Error('Missing "DPROCESSOR_SOURCE_DB_PORT"');
  if (!process.env.DPROCESSOR_SOURCE_DB_TABLENAME) throw new Error('Missing "DPROCESSOR_SOURCE_DB_TABLENAME"');
  if (!process.env.DPROCESSOR_TARGET_DB_HOST) throw new Error('Missing "DPROCESSOR_TARGET_DB_HOST"');
  if (!process.env.DPROCESSOR_TARGET_DB_USER) throw new Error('Missing "DPROCESSOR_TARGET_DB_USER"');
  if (!process.env.DPROCESSOR_TARGET_DB_PWD) throw new Error('Missing "DPROCESSOR_TARGET_DB_PWD"');
  if (!process.env.DPROCESSOR_TARGET_DB_DBNAME) throw new Error('Missing "DPROCESSOR_TARGET_DB_DBNAME"');
  if (!process.env.DPROCESSOR_TARGET_DB_PORT) throw new Error('Missing "DPROCESSOR_TARGET_DB_PORT"');
  if (!process.env.DPROCESSOR_TARGET_DB_TABLENAME) throw new Error('Missing "DPROCESSOR_TARGET_DB_TABLENAME"');
};

module.exports = {
  jsonStringifiedPretty,
  checkEnvVar
};