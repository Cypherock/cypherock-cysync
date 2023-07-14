module.exports = {
  typescript: true,
  template: (variables, { tpl, options }) => {
    // use SvgProps and SvgStyle from the import
    const componentNameWithType = `${variables.componentName}: React.FC<SvgProps>`;
    variables.jsx.openingElement.name.name =
      variables.jsx.closingElement.name.name = 'Svg';

    return tpl`
import React from 'react'
import { SvgStyle as Svg, SvgProps } from '../Svg';
${'\n'}
const ${componentNameWithType} = ({stroke, fill, ...props}) => (
    ${variables.jsx}
);

${variables.exports};
`;
  },
  jsx: {
    babelConfig: {
      plugins: [
        [
          '@svgr/babel-plugin-add-jsx-attribute',
          {
            elements: ['path', 'rect', 'circle', 'line'],
            attributes: [
              {
                name: 'fill',
                value: 'fill',
                literal: true,
              },
              {
                name: 'stroke',
                value: 'stroke',
                literal: true,
              },
            ],
          },
        ],
      ],
    },
  },
};
