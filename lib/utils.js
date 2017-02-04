'use strict';

exports.getConfig = function getConfig(defaults) {
  const config = JSON.parse(process.env.PROJJ_HOOK_CONFIG || '{}');
  return Object.assign({}, defaults, config);
};
