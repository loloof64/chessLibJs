export function InstantiationError(message){
    this.name = 'InstantiationError';
    this.message = message || '';
    this.stack = (new Error()).stack;
};
InstantiationError.prototype = Object.create(Error.prototype);
InstantiationError.prototype.constructor = InstantiationError;

export function UnknownPieceFENError(message) {
    this.name = 'UnknownPieceFENError';
    this.message = message || '';
    this.stack = (new Error()).stack;
};
UnknownPieceFENError.prototype = Object.create(Error.prototype);
UnknownPieceFENError.prototype.constructor = UnknownPieceFENError;