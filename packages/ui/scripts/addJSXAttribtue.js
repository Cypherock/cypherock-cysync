/* Modified from
   https://github.com/gregberge/svgr/tree/main/packages/babel-plugin-add-jsx-attribute 
*/
const addJSXAttribute = ({ types: t, template }, opts) => {
  const getAttributeValue = ({ literal, value, old }) => {
    if (typeof value === 'boolean')
      return t.jsxExpressionContainer(t.booleanLiteral(value));

    if (typeof value === 'number')
      return t.jsxExpressionContainer(t.numericLiteral(value));

    if (typeof value === 'string' && typeof literal === 'boolean' && literal) {
      if (old)
        return t.jsxExpressionContainer(
          t.logicalExpression('??', template.ast(value).expression, old),
        );
      return t.jsxExpressionContainer(template.ast(value).expression);
    }

    if (typeof value === 'string') {
      return t.stringLiteral(value);
    }

    return null;
  };

  const getAttribute = ({ spread, name, value, literal, old }) => {
    if (spread) {
      return t.jsxSpreadAttribute(t.identifier(name));
    }

    return t.jsxAttribute(
      t.jsxIdentifier(name),
      getAttributeValue({ value, literal, old }),
    );
  };

  return {
    visitor: {
      JSXOpeningElement(path) {
        if (!t.isJSXIdentifier(path.node.name)) return;
        if (!opts.elements.includes(path.node.name.name)) return;

        opts.attributes.forEach(
          ({ name, value = null, spread = false, literal = false }) => {
            const attributes = path.get('attributes');

            const isEqualAttribute = attribute => {
              if (spread)
                return (
                  attribute.isJSXSpreadAttribute() &&
                  attribute.get('argument').isIdentifier({ name })
                );
              return (
                attribute.isJSXAttribute() &&
                attribute.get('name').isJSXIdentifier({ name })
              );
            };

            const replaced = attributes.some(attribute => {
              if (!isEqualAttribute(attribute)) return false;
              const newAttribute = getAttribute({
                spread,
                name,
                value,
                literal,
                old: attribute.node.value,
              });
              attribute.replaceWith(newAttribute);
              return true;
            });

            if (!replaced) {
              const newAttribute = getAttribute({
                spread,
                name,
                value,
                literal,
                old: undefined,
              });
              path.pushContainer('attributes', newAttribute);
            }
          },
        );
      },
    },
  };
};

module.exports = addJSXAttribute;
