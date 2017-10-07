'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Endpoint2 = require('../Endpoint');

var _Endpoint3 = _interopRequireDefault(_Endpoint2);

var _Request = require('../RequestClient/Request');

var _Request2 = _interopRequireDefault(_Request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SummonerEndpoint = function (_Endpoint) {
  _inherits(SummonerEndpoint, _Endpoint);

  function SummonerEndpoint(config) {
    _classCallCheck(this, SummonerEndpoint);

    var _this = _possibleConstructorReturn(this, (SummonerEndpoint.__proto__ || Object.getPrototypeOf(SummonerEndpoint)).call(this));

    _this.name = _this.name.bind(_this);
    _this.id = _this.id.bind(_this);
    _this.accountID = _this.accountID.bind(_this);

    _this.config = config;

    _this.by = {
      name: _this.name,
      id: _this.id,
      accountID: _this.accountID
    };

    _this.resourceName = 'summoner';
    return _this;
  }

  _createClass(SummonerEndpoint, [{
    key: 'name',
    value: function name(val) {
      return new _Request2.default(this.config, this.resourceName, 'summoners/by-name/' + val, 'GET');
    }
  }, {
    key: 'id',
    value: function id(val) {
      return new _Request2.default(this.config, this.resourceName, 'summoners/' + val);
    }
  }, {
    key: 'accountID',
    value: function accountID(val) {
      return new _Request2.default(this.config, this.resourceName, 'summoners/by-account/' + val);
    }
  }]);

  return SummonerEndpoint;
}(_Endpoint3.default);

exports.default = SummonerEndpoint;