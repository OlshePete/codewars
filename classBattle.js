var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
console.log('class test start');
var First = /** @class */ (function () {
    function First(type) {
        if (type === void 0) { type = 'first'; }
        this.type = type;
        this.showType();
    }
    First.prototype.showType = function () {
        console.log(this.type);
    };
    return First;
}());
var Second = /** @class */ (function (_super) {
    __extends(Second, _super);
    function Second() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'second';
        return _this;
    }
    return Second;
}(First));
new Second('foo');
new Second().showType();
