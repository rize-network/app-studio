const j = require('jscodeshift');
// Ensure the correct import path and function names according to your project structure
const {
  transformCode,
  transformStyledComponentsToView,
  transformStyleToProps,
  transformHTMLToView,
} = require('../to-app-studio');

describe('transformHTMLToView', () => {
  it('should transform div tag to View component', () => {
    const sourceCode = `<div className="some-class">ok</div>`;
    const root = j(sourceCode);
    transformHTMLToView(root, j);
    expect(root.toSource()).toContain(`<View className="some-class">ok</View>`);
  });

  it('should transform span tag to Span component', () => {
    const sourceCode = `<span className="some-class">ok</span>`;
    const root = j(sourceCode);
    transformHTMLToView(root, j);
    expect(root.toSource()).toContain(
      `<Span className="some-class">ok<\/Span>`
    );
  });

  it('should transform button tag to Button component', () => {
    const sourceCode = `<button className="some-class">click</button>`;
    const root = j(sourceCode);
    transformHTMLToView(root, j);
    expect(root.toSource()).toContain(
      `<Button className="some-class">click</Button>`
    );
  });
});

describe('transformStyledComponentsToView', () => {
  it('should transform styled-components to View with props', () => {
    const input = `import styled from 'styled-components';
    const Container = styled.div\`
        background-color: blue;
        color: white;
    \`;
    `;

    const root = j(input);
    transformStyledComponentsToView(root, j);
    expect(root.toSource()).toContain(
      `const Container = props => <View backgroundColor="blue" color="white" {...props} />;`
    );
  });
});

describe('transformStyleToProps', () => {
  it('should transform style attribute to props', () => {
    const input = `
    const Container = (props) => <div className="some-class" style="background-color: blue; color: white;" {...props} />;
    `;

    const root = j(input);
    transformStyleToProps(root, j);
    expect(root.toSource()).toContain(
      `const Container = (props) => <div backgroundColor="blue" color="white" className="some-class" {...props} />;`
    );
  });
});

describe('transformCode', () => {
  it('should transform button tag to Button component', () => {
    const sourceCode = `<button className="some-class">ok</button>`;
    const root = j(sourceCode);
    transformCode(root, j);

    expect(root.toSource()).toContain(
      `<Button className="some-class">ok</Button>`
    );
  });

  it('should transform div tag to View component', () => {
    const sourceCode = `<div className="some-class">ok</div>`;
    const root = j(sourceCode);
    transformCode(root, j);

    expect(root.toSource()).toContain(`<View className="some-class">ok</View>`);
  });
});
