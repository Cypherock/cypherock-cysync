module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              require('postcss-import'),
              require('postcss-preset-env')({
                browsers: 'last 2 versions',
              }),
            ],
          },
        },
      },
    ],
  });

  return config;
};
