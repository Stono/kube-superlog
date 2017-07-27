'use strict';
const async = require('async');

module.exports = function Kube() {
  const util = require('./util');
  const exec = new require('./exec')();
  let self = {};

  self.pods = function(namespace, labels, done) {
    namespace = util.defaultValue(namespace, 'default');
    if(labels.length === 0) {
      exec.command(`kubectl --namespace=${namespace} get pods --no-headers -o json`, null, (err, data) => {
        if(err) { return done(err); }
        const json = JSON.parse(data.stdout);
        done(null, json.items);
      });
    } else {
      const pods = [];
      const getPods = (label, next) => {
        exec.command(`kubectl --namespace=${namespace} get pods -l ${label} --no-headers -o json`, null, (err, data) => {
          if(err) { return done(err); }
          const json = JSON.parse(data.stdout);
          pods.push.apply(pods, json.items);
          next();
        });
      };
      const merge = () => {
        const dupesremoved = [];
        async.eachSeries(pods, (pod, next) => {
          if(!dupesremoved.find(d => { return d.metadata.name === pod.metadata.name })) {
            dupesremoved.push(pod);
          }
          next();
        }, () => { done(null, dupesremoved); });
      };
      async.each(labels, getPods, merge);
    }
  };
  self.followLog = function(namespace, pod, done) {
    namespace = util.defaultValue(namespace, 'default');
    const debug = require('debug')(pod);
    const write = function(data) {
      debug(data);
    };
    exec.command(`kubectl --namespace=${namespace} logs --tail=1 --follow ${pod.trim()}`, {
      stdout: write,
      stderr: write
    }, done);
  };

  return Object.freeze(self);
};
