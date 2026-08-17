const cheerio = require('cheerio');
const postcss = require('postcss');
const fs = require('fs');

function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, function (match, letter) {
    return letter.toUpperCase();
  });
}

const convertHtmlCssToAppStudio = (html, css) => {
  const $ = cheerio.load(html);
  const root = postcss.parse(css);

  const mapCssToAppStudioProps = (rules, className) => {
    let props = {};

    rules.forEach((rule) => {
      let { prop, value } = rule;
      if (prop.indexOf('-') >= 0) {
        prop = kebabToCamel(prop);
      }

      const numericalMatch = value.match(/(\d+(\.\d+)?)(px|rem)?/);
      if (numericalMatch) {
        if (numericalMatch[1].indexOf('.') >= 0) {
          props[prop] = parseFloat(numericalMatch[1]);
        } else {
          props[prop] = parseInt(numericalMatch[1]);
        }
      } else if (prop === 'boxShadow') {
        const matches =
          /(\d+)px (\d+)px (\d+)px rgba\(([\d,]+),([\d.]+)\)/.exec(value);
        if (matches) {
          const [, height, width, radius, shadowColor, opacity] = matches;
          props.shadow = {
            shadowOffset: { height: parseInt(height), width: parseInt(width) },
            shadowRadius: parseInt(radius),
            shadowColor: shadowColor.split(',').map(Number),
            shadowOpacity: parseFloat(opacity),
          };
        }
      } else {
        if (value.indexOf('url(') >= 0) {
          const regex = /url\("data:image\/(\S+);charset=utf8,([^"]+)"\)/;
          let match = css.match(regex);
          if (match) {
            const imageType = match[1].split('+')[0];
            const data = decodeURIComponent(match[2]);
            const filename = `${className}.${imageType}`;
            fs.writeFileSync(filename, data, 'utf8');
            props[prop] = `url("${filename}")`;
          }
        } else {
          props[content] = value;
          props[prop] = value;
        }
        props[prop] = value;
      }
    });

    return props;
  };

  const applyPropsToElement = (element, props) => {
    for (const [key, value] of Object.entries(props)) {
      element.setAttribute(`data-${key}`, value);
    }
  };

  root.walkRules((rule) => {
    const selector = rule.selector;
    const $elements = $(selector);
    $elements.each((index, element) => {
      const props = mapCssToAppStudioProps(rule.nodes, rule.selector);
      applyPropsToElement(element, props);
    });
  });

  return $.html().toString();
};

const source = fs.readFileSync('./input/html/index.html', 'utf8');
const $ = cheerio.load(source);
const html = $('body').html().trim();
const css = $('style').text().trim();
const jsx = convertHtmlCssToAppStudio(html, css);

// Create a new React component
const componentContent = `
import React from 'react';
import { View } from 'app-studio';

const AppStudioComponent = () => (
  <View>
    ${jsx}
  </View>
);

export default AppStudioComponent;
`;

fs.writeFileSync('./output/AppStudioComponent.ts', componentContent);
