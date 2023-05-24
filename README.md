# Note for developers

All credits to <https://github.com/nirsky/react-native-size-matters>

1/ To install:

```bash
yarn add @gocodingnow/rn-size-matters
```

or

```bash
npm i @gocodingnow/rn-size-matters
```

or

```bash
pnpm i @gocodingnow/rn-size-matters
```

2/ Configuration

In App.tsx, set default resolution at the root,

```jsx

const SIZE_MATTERS_BASE_WIDTH = 375;
const SIZE_MATTERS_BASE_WIDTH = 812;

setSizeMattersBaseWidth(SIZE_MATTERS_BASE_WIDTH);
setSizeMattersBaseHeight(SIZE_MATTERS_BASE_WIDTH);
```