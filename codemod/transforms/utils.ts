export const APP_MAPPING = {
  A: 'a',
  Image: 'img',
  Div: 'div',
  Span: 'span',
  View: 'div',
};

export const COMPONENT_MAPPING = {
  Textarea: 'textarea',
  Svg: 'svg',
  Select: 'select',
  Image: 'picture',
  Option: 'option',
  Map: 'map',
  Input: 'input',
  Iframe: 'iframe',
  Form: 'form',
  Button: 'button',
  Audio: 'audio',
  Video: 'video',
};

export function transformHTMLToView(root, j, imports) {
  root.find(j.JSXElement).forEach((path) => {
    const tagName = path.node.openingElement.name.name;
    const mappedComponent = COMPONENT_MAPPING[tagName];

    if (mappedComponent) {
      path.node.openingElement.name.name = mappedComponent;
      if (path.node.closingElement)
        path.node.closingElement.name.name = mappedComponent;
    } else {
      console.log({ tagName });
      if (tagName && isHtmlElement(tagName)) {
        const asAttribute = j.jsxAttribute(
          j.jsxIdentifier('as'),
          j.stringLiteral(tagName)
        );
        console.log({ name: path.node.openingElement.name.name });

        path.node.openingElement.name.name = 'View';
        if (path.node.closingElement)
          path.node.closingElement.name.name = 'View';
        path.node.openingElement.attributes.push(asAttribute);
      }
    }
  });
}

function isHtmlElement(elementName) {
  return elementName[0] === elementName[0].toLowerCase();
}

export function transformStyledComponentsToView(root, j, imports) {
  root
    .find(j.TaggedTemplateExpression)
    .filter((path) => {
      return (
        path.node.tag.type === 'Identifier' && path.node.tag.name === 'styled'
      );
    })
    .forEach((path) => {
      const quasis = path.node.quasi.quasis;

      // eslint-disable-next-line prefer-const
      let mediaQueries = {};
      let rootStyles = {};

      quasis.forEach((quasi, index) => {
        const cssString = quasi.value.raw;

        // Extrait les media queries
        const mediaRegex =
          /@media \(?(min-width:\s*(\d+)px)?\s*(and)?\s*(max-width:\s*(\d+)px)?\)?\s*\{([\s\S]*?)\}/g;
        let match;

        while ((match = mediaRegex.exec(cssString)) !== null) {
          const minWidth = match[2] ? parseInt(match[2], 10) : null;
          const maxWidth = match[5] ? parseInt(match[5], 10) : null;
          const stylesString = match[6].trim();

          let breakpointName = 'xs';

          if (minWidth) {
            breakpointName += `min[${minWidth}]`;
          }
          if (maxWidth) {
            breakpointName += `max[${maxWidth}]`;
          }

          const styles = stylesString
            .split(';')
            .filter(Boolean)
            .reduce((acc, style) => {
              const [key, value] = style.split(':').map((str) => str.trim());
              if (key && value) {
                acc[key] = value;
              }
              return acc;
            }, {});

          mediaQueries[breakpointName] = styles;
        }

        // Extrait les styles root
        const rootRegex = /([^@{}]+)\{([\s\S]*?)\}/g;
        while ((match = rootRegex.exec(cssString)) !== null) {
          const stylesString = match[2].trim();
          const styles = stylesString
            .split(';')
            .filter(Boolean)
            .reduce((acc, style) => {
              const [key, value] = style.split(':').map((str) => str.trim());
              if (key && value) {
                acc[key] = value;
              }
              return acc;
            }, {});
          rootStyles = { ...rootStyles, ...styles };
        }
      });

      let attributes = [j.jsxSpreadAttribute(j.identifier('props'))];

      if (Object.keys(mediaQueries).length > 0) {
        const mediaProp = j.jsxAttribute(
          j.jsxIdentifier('media')
          // ... (le même code pour créer la prop 'media') ...
        );
        attributes.push(mediaProp);
      }

      if (Object.keys(rootStyles).length > 0) {
        const rootStyleProps = Object.keys(rootStyles).map((key) =>
          j.jsxAttribute(j.jsxIdentifier(key), j.literal(rootStyles[key]))
        );
        attributes = [...attributes, ...rootStyleProps];
      }

      path.node.init = j.arrowFunctionExpression(
        [j.identifier('props')],
        j.jsxElement(
          j.jsxOpeningElement(j.jsxIdentifier('View'), attributes),
          j.jsxClosingElement(j.jsxIdentifier('View')),
          []
        )
      );
      imports['View'] = true;
    });
}

export function transformStyleToProps(root, j, imports) {
  root.find(j.JSXAttribute, { name: { name: 'style' } }).forEach((path) => {
    const attrValue = path.node.value;
    // eslint-disable-next-line prefer-const
    let newAttributes = [];

    if (attrValue.type === 'Literal') {
      const inlineStyles = attrValue.value.split(';').filter(Boolean);
      inlineStyles.forEach((inlineStyle) => {
        const [key, value] = inlineStyle.split(':').map((s) => s.trim());
        const propName = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        newAttributes.push(
          j.jsxAttribute(j.jsxIdentifier(propName), j.stringLiteral(value))
        );
      });
    } else if (
      attrValue.type === 'JSXExpressionContainer' &&
      attrValue.expression.type === 'ObjectExpression'
    ) {
      attrValue.expression.properties.forEach((prop) => {
        const propName = prop.key.name;
        const propValue = prop.value;
        newAttributes.push(
          j.jsxAttribute(j.jsxIdentifier(propName), propValue)
        );
      });
    }

    const openingElement = path.parentPath.node;
    openingElement.attributes = openingElement.attributes.filter(
      (attr) => attr.name.name !== 'style'
    );
    openingElement.attributes.push(...newAttributes);
    imports['View'] = true;
  });
}

// Fonction pour ajouter une déclaration d'importation si elle n'est pas déjà présente
export function addImportStatement(root, j, importName, fromModule) {
  const existingImport = root.find(j.ImportDeclaration, {
    source: { value: fromModule },
  });
  if (existingImport.size() === 0) {
    const importStatement = j.importDeclaration(
      [j.importSpecifier(j.identifier(importName))],
      j.literal(fromModule)
    );
    root.find(j.Program).get('body', 0).insertBefore(importStatement);
  }
}

export function mapCSSClassToProps(root, j, cssContent) {
  // Use a simple regex to extract class names and their styles
  const cssClassRegex = /\.([a-zA-Z0-9-_]+)\s*\{([\s\S]*?)\}/g;
  let cssClassMatch;

  const cssClassStyles = {};

  while ((cssClassMatch = cssClassRegex.exec(cssContent)) !== null) {
    const className = cssClassMatch[1];
    const styles = cssClassMatch[2]
      .split(';')
      .filter(Boolean)
      .reduce((acc, style) => {
        const [key, value] = style.split(':').map((str) => str.trim());
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {});

    cssClassStyles[className] = styles;
  }

  // Iterate over JSXElements and check for className attributes
  root.find(j.JSXElement).forEach((path) => {
    const classNameAttribute = path.node.openingElement.attributes.find(
      (attr) => attr.name && attr.name.name === 'className'
    );

    if (classNameAttribute) {
      const classNameValue = classNameAttribute.value.value;
      const mappedStyles = cssClassStyles[classNameValue];
      if (mappedStyles) {
        const newAttributes = Object.keys(mappedStyles).map((key) => {
          const propName = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          return j.jsxAttribute(
            j.jsxIdentifier(propName),
            j.stringLiteral(mappedStyles[key])
          );
        });

        path.node.openingElement.attributes = [
          ...path.node.openingElement.attributes.filter(
            (attr) => attr.name.name !== 'className'
          ),
          ...newAttributes,
        ];
      }
    }
  });
}

export function getCSSImportPath(root, j) {
  let cssPath = null;

  root.find(j.ImportDeclaration).forEach((path) => {
    const isCSSImport = /\.css$/.test(path.node.source.value);
    if (isCSSImport) {
      cssPath = path.node.source.value;
    }
  });

  return cssPath;
}
