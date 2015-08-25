import id from '../General/id';
import isType from '../General/isType';
import { merge } from '../Obj';
import { curry, compose, deny } from '../Func';

//:: (Number, Number?, Number?) -> [Number]
export const range = (to, from = 1, step = 1) => {
  const result = [];
  for (let i = from; i <= to; i += step) {
    result.push(i);
  }
  return result;
};

//:: (a -> b) -> [a] -> void
export const each = curry((fn, xs) => xs.forEach(fn));

//:: (a -> b) -> [a] -> [b]
export const map = curry((fn, xs) => xs.map(fn));

//:: (a -> Boolean) -> [a] -> [a]
export const filter = curry((fn, xs) => xs.filter(fn));

//:: [a] -> [a]
export const compact = filter(id);

//:: (a -> Boolean) -> [a] -> [a]
export const reject = curry((fn, xs) => xs.filter(deny(fn)));

//:: ((a, b) -> a) -> [b] -> a
export const reduce = curry((fn, memo, xs) => xs.reduce(fn, memo));

//:: (a -> Boolean) -> [a] -> [[a] [a]]
export const partition = curry((fn, xs) => {
  let passed = [];
  let failed = [];
  xs.forEach((x) => (fn(x) ? passed : failed ).push(x));
  return [passed, failed];
});

//:: (a -> Boolean) -> [a] -> a
export const find = curry((fn, [x, ...xs]) => x
  ? fn(x) ? x : find(fn, xs)
  : undefined
);

//:: [a] -> a
export const head = (xs) => xs[0];

//:: [a] -> [a]
export const tail = ([x, ...xs]) => xs;

//:: [a] -> a
export const first = head;

//:: [a] -> a
export const last = (xs) => xs.slice(-1)[0];

//:: [a] -> [a]
export const initial = (xs) => !xs.length ? undefined : xs.slice(0, -1);

//:: [a] -> Boolean
export const empty = (xs) => !xs.length;

//:: [a] -> [a]
export const reverse = (xs) => xs.concat().reverse();

//:: (a -> b) -> [a] -> [a]
export const uniqueBy = curry((f, xs) => {
  const reducer = (memo, x) => merge(memo, { [`K_${x}`]: x });
  return Object.values(xs.map(f).reduce(reducer, {}));
});

//:: [a] -> [a]
export const unique = (xs) => uniqueBy(id, xs);

//:: (b -> a -> b) -> b -> [a] -> b
export const foldl = curry((fn, memo, xs) => xs.reduce(fn, memo));

//:: (a -> a -> a) -> [a] -> a
export const foldl1 = curry((fn, xs) => xs.reduce(fn, 0));

//:: (b -> a -> b) -> b -> [a] -> b
export const foldr = curry((fn, memo, xs) => {
  for (let i = xs.length - 1; i >= 0; i--) {
    memo = fn(xs[i], memo);
  }
  return memo;
});

//:: (a -> a -> a) -> [a] -> a
export const foldr1 = curry((fn, xs) => foldr(fn, 0, xs));

//:: (a -> [b]) -> [a] -> [b]
export const unfoldr = curry((fn, b) => {
  let result = [];
  let x = b;
  let that;
  while ((that = fn(b))) {
    result.push(that[0]);
    x = that[1];
  }
  return result;
});

//:: (a -> b, b -> c) -> [a] -> c
export const mapReduce = curry((mapper, reducer, xs) => xs.map(mapper).reduce(reducer));

//:: [[a]] -> [a]
export const concat = (xss) => [].concat.apply([], xss);

//:: (a -> [b]) -> [a] -> [b]
export const concatMap = curry((fn, xs) => concat(map(fn, xs)));

//:: List -> List
export const flatten = concatMap((xs) => isType('Array', xs) ? flatten(xs) : xs);

//:: ([a], [a], ...) -> [a]
export const difference = (xs, ...yss) =>
  xs.filter((x) => !yss.some(find((y) => y === x)));

//:: ([a], [a], ...) -> [a]
export const intersection = (xs, ...yss) =>
  xs.filter((x) => yss.some(find((y) => y === x)));

//:: ([a], [a], ...) -> [a]
export const union = (xs, ...yss) => unique(xs.concat(flatten(yss)));

//:: (a -> b) -> [a] -> { b: Number }
export const countBy = curry((fn, xs) =>
  xs.reduce((memo, x) => {
    let key = fn(x);
    memo[key] = memo[key] ? memo[key] + 1 : 1;
    return memo;
  }, {}));

//:: (a -> b) -> [a] -> { b: [b] }
export const groupBy = curry((fn, xs) =>
  xs.reduce((memo, x) => {
    let key = fn(x);
    memo[key] = memo[key] ? memo[key].concat([x]) : [x];
    return memo;
  }, {}));

//:: [a] -> Boolean
export const and = reduce((memo, x) => memo && !!x, true);

//:: [a] -> Boolean
export const or = reduce((memo, x) => memo || !!x, false);

//:: (a -> Boolean) -> [a] -> Boolean
export const any = curry((fn, xs) => xs.some(fn));

//:: (a -> Boolean) -> [a] -> Boolean
export const all = deny(any);

// aliases

export const fold = foldl;

export const fold1 = foldl1;
