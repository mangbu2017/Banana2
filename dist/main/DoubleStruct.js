"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DoubleStructImpl = /** @class */ (function () {
    function DoubleStructImpl() {
        this.stack = [];
        this.queue = [];
    }
    DoubleStructImpl.prototype.pushStack = function (element) {
        this.stack.push(element);
    };
    DoubleStructImpl.prototype.popStack = function () {
        return this.stack.pop();
    };
    DoubleStructImpl.prototype.stackSize = function () {
        return this.stack.length;
    };
    DoubleStructImpl.prototype.getStackCurrentElement = function () {
        var len = this.stackSize();
        return this.stack[len - 1];
    };
    DoubleStructImpl.prototype.offerQueue = function (element) {
        this.queue.push(element);
    };
    DoubleStructImpl.prototype.pollQueue = function () {
        return this.queue.shift();
    };
    DoubleStructImpl.prototype.queueSize = function () {
        return this.queue.length;
    };
    DoubleStructImpl.prototype.getQueueCurrentElement = function () {
        var len = this.queueSize();
        return this.queue[len - 1];
    };
    return DoubleStructImpl;
}());
exports.DoubleStructImpl = DoubleStructImpl;
//# sourceMappingURL=DoubleStruct.js.map