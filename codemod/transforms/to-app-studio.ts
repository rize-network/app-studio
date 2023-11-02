import fs from 'fs';
import path from 'path';
import postcss from 'postcss';

export const APP_MAPPING = {
  a: 'A',
  img: 'Image',
  div: 'View',
  span: 'Span',
};

export const COMPONENT_MAPPING = {
  textarea: 'Textarea',
  svg: 'Svg',
  select: 'Select',
  picture: 'Image',
  option: 'Option',
  map: 'Map',
  input: 'Input',
  iframe: 'Iframe',
  form: 'Form',
  button: 'Button',
  audio: 'Audio',
  video: 'Video',
  img: 'Image',
};

let IMPORT_APP = {};
let IMPORT_COMPONENT = {};

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

      quasis.forEach((quasi) => {
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
export function addImportStatement(root, j, importNames = [], fromModule) {
  const existingImport = root.find(j.ImportDeclaration, {
    source: { value: fromModule },
  });
  if (existingImport.size() === 0) {
    const importStatement = j.importDeclaration(
      importNames.map((importName) =>
        j.importSpecifier(j.identifier(importName))
      ),
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

        // Remove the 'className' attribute and replace with new attributes
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

export function removeCSSImport(root, j) {
  root.find(j.ImportDeclaration).forEach((path) => {
    if (/\.css$/.test(path.node.source.value)) {
      j(path).remove();
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

function addReactImportIfMissing(root, j) {
  const hasReactImport = root
    .find(j.ImportDeclaration, {
      source: { value: 'react' },
    })
    .size();

  if (!hasReactImport) {
    const importStatement = j.importDeclaration([], j.literal('react'));
    root.find(j.Program).get('body', 0).insertBefore(importStatement);
  }
}

function getTemplateLiteralValue(node) {
  if (node.type !== 'TemplateLiteral') {
    throw new Error('Node is not a TemplateLiteral');
  }

  let value = '';

  // Loop through each quasi and expression, and append them to the value string
  for (let i = 0; i < node.quasis.length; i++) {
    value += node.quasis[i].value.raw; // Get the raw value of the quasi

    // If there's an expression after this quasi, append its value too
    if (i < node.expressions.length) {
      value += node.expressions[i].name; // Assuming the expression is an Identifier for simplicity
    }
  }

  return value;
}

function transformCode(root, j, cssClassStyles) {
  // eslint-disable-next-line prefer-const
  let MapComponent = {};

  function processPropValue(prop, value, className) {
    const numericalMatch = value.match(/(\d+(\.\d+)?)(px|rem)?/);
    if (numericalMatch) {
      if (numericalMatch[1].indexOf('.') >= 0) {
        return parseFloat(numericalMatch[1]);
      } else {
        return parseInt(numericalMatch[1]);
      }
    } else if (prop === 'boxShadow') {
      const matches = /(\d+)px (\d+)px (\d+)px rgba\(([\d,]+),([\d.]+)\)/.exec(
        value
      );
      if (matches) {
        const [, height, width, radius, shadowColor, opacity] = matches;
        return {
          shadow: {
            shadowOffset: { height: parseInt(height), width: parseInt(width) },
            shadowRadius: parseInt(radius),
            shadowColor: shadowColor.split(',').map(Number),
            shadowOpacity: parseFloat(opacity),
          },
        };
      }
    } else {
      if (value.indexOf('url(') >= 0) {
        console.log({ value });
        const regex = /url\("data:image\/([a-zA-Z]+);base64,([^"]+)"\)/;
        const match = value.match(regex);
        if (match) {
          const imageType = match[1];
          const data = match[2];
          const filename = `${className}.${imageType}`;

          // Decoding the base64 content and writing as binary
          const buffer = Buffer.from(data, 'base64');
          fs.writeFileSync(filename, buffer);

          return `url("${filename}")`;
        }
      } else {
        return value;
      }
    }
  }

  root.find(j.JSXElement).forEach((path) => {
    const tagName = path.node.openingElement.name.name;
    // eslint-disable-next-line prefer-const
    let mappedComponent = COMPONENT_MAPPING[tagName] || APP_MAPPING[tagName];

    if (APP_MAPPING[tagName]) IMPORT_APP[mappedComponent] = true;
    else if (COMPONENT_MAPPING[tagName])
      IMPORT_COMPONENT[mappedComponent] = true;
    else IMPORT_APP['View'] = true;

    const attributes = path.node.openingElement.attributes;
    let classNames = [];

    for (const attribute of attributes) {
      if (
        attribute.type === 'JSXAttribute' &&
        attribute.name.name === 'className'
      ) {
        const classNameString = getTemplateLiteralValue(
          attribute.value.expression
        );
        classNames = classNameString.split(' '); // Assuming class names are separated by spaces
      }
    }

    const combinedProps = classNames.reduce((acc, className) => {
      const props = cssClassStyles[className];
      if (props) {
        const processedProps = {};
        console.log({ props, acc });

        for (const [key, value] of Object.entries(props)) {
          processedProps[key] = processPropValue(key, value, className);
        }
        console.log({ processedProps });
        return { ...acc, ...processedProps };
      }
      return acc;
    }, {});

    const combinedComponentName = classNames
      .map((className) =>
        className
          .match(/\w+/g)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('')
      )
      .join('');

    MapComponent[combinedComponentName] = mappedComponent || 'View';

    path.node.openingElement.attributes =
      path.node.openingElement.attributes.filter(
        (attribute) => attribute.name.name !== 'className'
      );

    if (combinedComponentName) {
      path.node.openingElement.name.name = combinedComponentName;
      if (path.node.closingElement)
        path.node.closingElement.name.name = combinedComponentName;
    } else if (tagName && isHtmlElement(tagName)) {
      const asAttribute = j.jsxAttribute(
        j.jsxIdentifier('as'),
        j.stringLiteral(tagName)
      );
      path.node.openingElement.name.name = 'View';
      if (path.node.closingElement) path.node.closingElement.name.name = 'View';
      path.node.openingElement.attributes.push(asAttribute);
    }

    const props = Object.entries(combinedProps).map(([key, value]) => {
      let valueLiteral;
      if (typeof value === 'object' && value !== null) {
        valueLiteral = j.objectExpression(
          Object.entries(value).map(([innerKey, innerValue]) =>
            j.objectProperty(j.identifier(innerKey), j.literal(innerValue))
          )
        );
      } else if (typeof value === 'string') {
        valueLiteral = j.literal(value);
      } else {
        valueLiteral = j.numericLiteral(value);
      }

      return j.jsxAttribute(
        j.jsxIdentifier(key),
        j.jsxExpressionContainer(valueLiteral)
      );
    });

    const newComponent = j.variableDeclaration('const', [
      j.variableDeclarator(
        j.identifier(combinedComponentName),
        j.arrowFunctionExpression(
          [j.identifier('props')],
          j.jsxElement(
            j.jsxOpeningElement(
              j.jsxIdentifier(MapComponent[combinedComponentName] || 'View'),
              [...props, j.jsxSpreadAttribute(j.identifier('props'))],
              true
            ),
            null
          )
        )
      ),
    ]);

    root.find(j.Program).forEach((path) => {
      path.node.body.push(newComponent);
    });
  });
}

export default function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // eslint-disable-next-line prefer-const
  let imports = {};

  const cssImportPath = getCSSImportPath(root, j);
  let cssContent = '';

  if (cssImportPath) {
    const cssFilePath = path.resolve(path.dirname(file.path), cssImportPath);
    try {
      cssContent = fs.readFileSync(cssFilePath, 'utf8');
    } catch (err) {
      console.error('Failed to read CSS file:', err);
    }
  }

  const cssClassStyles = {};

  // Parse CSS content using postcss
  const rootCss = postcss.parse(cssContent);

  rootCss.walkRules((rule) => {
    if (rule.selector.startsWith('.')) {
      const className = rule.selector.slice(1);
      const styles = {};

      rule.walkDecls((decl) => {
        const key = decl.prop;
        const value = decl.value;
        const propName = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styles[propName] = value;
      });

      cssClassStyles[className] = styles;
    }
  });

  console.log({ cssClassStyles });
  transformCode(root, j, cssClassStyles);
  addReactImportIfMissing(root, j);

  transformStyledComponentsToView(root, j, imports);
  transformStyleToProps(root, j, imports);

  removeCSSImport(root, j);

  const componentImport = Object.keys(IMPORT_COMPONENT);

  const appImport = Object.keys(IMPORT_APP);

  for (const componentName in imports) {
    if (
      APP_MAPPING[componentName] !== undefined &&
      !appImport.includes(componentName)
    ) {
      appImport.push(componentName);
    } else if (
      COMPONENT_MAPPING[componentName] !== undefined &&
      !componentImport.includes(componentName)
    ) {
      componentImport.push(componentName);
    }
  }

  if (componentImport.length > 0)
    addImportStatement(root, j, componentImport, '@app-studio/web');

  if (appImport.length > 0)
    addImportStatement(root, j, appImport, 'app-studio');

  return root.toSource();
}
