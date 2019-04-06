module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: 'cjs',
        // loose: true,
      },
    ],
    // 'es2015',
    // '@babel/preset-stage-2',
    // '@babel/preset-typescript',
  ],
  plugins: [
    // [
    //   'module-resolver',
    //   {
    //     root: ['./src'],
    //     alias: {},
    //   },
    // ],
    // '@babel/runtime',
    '@babel/plugin-syntax-dynamic-import',
    // [
    //   '@babel/plugin-transform-runtime',
    //   {
    //     corejs: 2,
    //   },
    // ],
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-transform-classes',
    // https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-syntax-export-namespace-from',
    '@babel/plugin-transform-modules-commonjs',
    // https://babeljs.io/docs/en/babel-helper-module-imports
    // '@babel/helper-module-imports',
    // https://www.npmjs.com/package/babel-plugin-add-module-exports
    'add-module-exports',
  ],
  env: {
    // production: {
    //   plugins: ['transform-es2015-modules-commonjs'],
    // },
  },
};
