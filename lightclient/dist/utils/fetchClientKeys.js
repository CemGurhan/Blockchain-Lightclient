'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = fetchDefaultKeys;

var _exonumClient = require('exonum-client');

var exonum = _interopRequireWildcard(_exonumClient);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');

function fetchDefaultKeys() {
    return new _promise2.default(function (resolve) {
        if (process.argv.length < 7) {
            var keys = exonum.keyPair();
            fs.writeFileSync("keys.json", (0, _stringify2.default)(keys));
            resolve(keys);
        } else {
            fs.readFile(process.argv[6], function (err, data) {
                if (err) throw err;
                var keys = JSON.parse(data);
                resolve(keys);
            });
        }
    });
}