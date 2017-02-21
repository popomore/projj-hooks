'use strict';

const cson = require('cson');

exports.getConfig = function getConfig(defaults) {
  const config = JSON.parse(process.env.PROJJ_HOOK_CONFIG || '{}');
  return Object.assign({}, defaults, config);
};


exports.parseCson = function parseCson(body) {
  return new Promise((resolve, reject) => {
    cson.parseCSONString(body, (err, str) => {
      if (err) return reject(err);
      resolve(str);
    });
  });
};

exports.stringifyCson = function stringifyCson(body) {
  return new Promise((resolve, reject) => {
    cson.createJSONString(body, (err, str) => {
      if (err) return reject(err);
      resolve(str);
    });
  });
};
