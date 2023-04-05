"use strict";

var P = Parsimmon;

var variables = {};

// JSON is pretty relaxed about whitespace, so let's make it easy to ignore
// after most text.
function token(parser) {
    return parser.skip(P.optWhitespace);
}

// Several parsers are just strings with optional whitespace.
function word(str) {
    return P.string(str).thru(token);
}

function foldr(foldFn, element, ...rest) {
    if (rest.length === 0) {
        return element;
    }
    return foldFn(element, foldr(foldFn, rest));
};

var MathParser = P.createLanguage({
    exp: (r) => {
        return r.addExp;
    },
    addExp: (r) => {
        return r.subExp.sepBy(word("+")).map((result) => result.reduce((a, b) => a + b));
    },
    subExp: (r) => {
        return r.mulExp.sepBy(word("-")).map((result) => result.reduce((a, b) => a - b));
    },
    mulExp: (r) => {
        return r.divExp.sepBy(word("*")).map((result) => result.reduce((a, b) => a * b));
    },
    divExp: (r) => {
        return r.powExp.sepBy(word("/")).map((result) => result.reduce((a, b) => a / b));
    },
    powExp: (r) => {
        return r.unaryExp.sepBy(word("^")).map((result) => result.reduce(Math.pow));
    },
    unaryExp: (r) => {
        return P.alt(r.basicExp, word("-").then(r.basicExp).map((result) => -result));
    },
    basicExp: (r) => {
        return P.alt(r.num, r.variable, r.parenExp, r.funcExp);
    },
    funcExp: (r) => {
        return P.alt(word("sin").then(r.parenExp).map(Math.sin),
            word("cos").then(r.parenExp).map(Math.cos));
    },
    funcExp: (r) => {
        return P.alt(
            word("exp").then(r.parenExp).map(Math.exp),
            word("log").then(r.parenExp).map(Math.log),
            word("sqrt").then(r.parenExp).map(Math.sqrt),
            word("sin").then(r.parenExp).map(Math.sin),
            word("cos").then(r.parenExp).map(Math.cos),
            word("tan").then(r.parenExp).map(Math.tan),
            word("asin").then(r.parenExp).map(Math.asin),
            word("acos").then(r.parenExp).map(Math.acos),
            word("atan").then(r.parenExp).map(Math.atan),
            word("atan").then(r.parenExp).map(Math.atan));
    },
    parenExp: (r) => {
        return r.exp.wrap(word("("), word(")"));
    },
    num: () => {
        return token(P.regexp(/(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/))
            .map(Number);
    },
    variable: () => {
        return P.alt(
            word("x").map(() => variables.x),
            word("y").map(() => variables.y)
        );
    }
});

function evalMathExp(exp, x, y) {
    variables.x = x;
    variables.y = y;
    try {
        var result = MathParser.exp.tryParse(exp);
    } catch (e) {
        document.querySelector("#error").innerText = "Parsing error";
        throw e;
    }

    document.querySelector("#error").innerText = "";

    return result;
}