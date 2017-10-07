'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('babel-polyfill');
var kayn = require('./dist')()([{ count: 20, per: 1 }]);

var print = function print(val) {
  return console.log(val);
};

var main = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var res1, res2, res3;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return kayn.Summoner.by.name('Faker').query({ hi: 'there' }).region('kr');

          case 2:
            res1 = _context.sent;

            console.log(res1.id);
            _context.next = 6;
            return kayn.Summoner.by.name().region('kr').query({ hi: 'there' });

          case 6:
            res2 = _context.sent;


            kayn.Summoner.by.name().region('na').callback(function (err, data) {
              if (err) {
                console.log('there is an error');
              } else {
                console.log('there is no error:', data);
              }
            });

            kayn.Summoner.by.id(1183421).callback(function (error, res) {
              return console.log(error);
            });

            _context.prev = 9;
            _context.next = 12;
            return kayn.Summoner.by.id(1183421);

          case 12:
            res3 = _context.sent;
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](9);

            console.log(_context.t0);

          case 18:

            kayn.Summoner.by.id(1183421).then(print).catch(print);

            kayn.Summoner.by.id(1183421).region('kr').then(print).catch(print);

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[9, 15]]);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

main();