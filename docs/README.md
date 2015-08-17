# Preλude-js - Docs

## Func

### Func.curry

```haskell
curry :: (a → b → c) → a → b → c
```

```javascript
const add = curry((a, b) => a + b);
const inc = add(1);

inc(2); //=> 3

```