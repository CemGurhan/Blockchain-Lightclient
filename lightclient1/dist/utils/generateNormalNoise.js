"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

exports.default = generateNormalNoise;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CLT_SIZE = 7;

function generateNormalNoise(update_length, scale) {
    var sample = (0, _from2.default)({ length: update_length }, function () {
        return (0, _from2.default)({ length: CLT_SIZE }, Math.random);
    });
    return sample.map(function (list) {
        var sm = 0;
        for (var i = 0; i < CLT_SIZE; i++) {
            sm += list[i];
        }return 2.0 * scale * (sm / CLT_SIZE - 0.5);
    });
}