const j = require('jscodeshift');
const {
  transformStyledToView,
  transformHTMLToView,
  transformStyleToProps,
  COMPONENT_MAPPING,
} = require('./to-app-studio.test'); // Assurez-vous d'exporter la fonction

describe('transformHTMLToComponent', () => {
  it('should transform html tag to component', () => {
    const sourceCode = `<button className="some-class"></button>`;
    const root = j(sourceCode);
    transformHTMLToView(root, j);

    expect(root.toSource()).toEqual(`
    import {${COMPONENT_MAPPING['button']}} from '@app-studio/components'

    <${COMPONENT_MAPPING['button']} className="some-class"></${COMPONENT_MAPPING['button']}>`);
  });
  // Ajoutez d'autres cas de test pour d'autres transformations si nécessaire
});

describe('transformHTMLToView', () => {
  it('should transform html tag to View with as attribute', () => {
    const sourceCode = `<button className="some-class"></button>`;
    const root = j(sourceCode);
    transformHTMLToView(root, j);

    expect(root.toSource()).toEqual(
      '<View as="button" className="some-class"></View>'
    );
  });

  it('should transform div to Div', () => {
    const sourceCode = `<div className="some-class"></div>`;
    const root = j(sourceCode);
    transformHTMLToView(root, j);

    expect(root.toSource()).toEqual('<Div className="some-class"></View>');
  });

  it('should transform div to Div', () => {
    const sourceCode = `<div className="some-class"></div>`;
    const root = j(sourceCode);
    transformHTMLToView(root, j);

    expect(root.toSource()).toEqual('<Div className="some-class"></View>');
  });

  it('should transform span to View with as attribute', () => {
    const sourceCode = `<span></span>`;
    const root = j(sourceCode);
    transformHTMLToView(root, j);

    expect(root.toSource()).toEqual('<View as="span"></View>');
  });

  // Ajoutez d'autres cas de test pour d'autres transformations si nécessaire
});

describe('transformStyledToView', () => {
  it('should transform css to props', () => {
    const input = `
    import styled from 'styled-component'

    const Container = styled.div\`
        background-color: blue;
        color: white:
    \`;

    const App = () => <Container />;
    `;

    const root = j(input);
    transformStyledToView(root, j);

    expect(root.toSource()).toEqual(`
    import {View} from 'app-studio'

    const Container = (props) => <View 
            backgroundColor='blue' 
            color="white" {...props} />;

    const App = () => <Container />;
    `);
  });

  it('should handle multiple events', () => {
    const input = `
    import styled from 'styled-component'
    
    const Container = styled.div\`
        :hover {
          color: red;
        }
        :active {
          color: blue;
        }
    \`;

    const App = () => <Container  />;
    `;

    const root = j(input);
    transformStyledToView(root, j);

    expect(root.toSource()).toEqual(`
    import {View} from 'app-studio'

    const Container = (props) => <View 
        on={{
            hover: {color: 'red'}, 
            active: {color: 'blue'}
            }} 
        {...props} />;


    const App = () => <Container  />;
    `);
  });

  it('should transform media query to props with breakpoints', () => {
    const breakpoints = {
      xs: 0,
      sm: 340,
      md: 560,
      lg: 1080,
      xl: 1300,
    };

    const input = `
    import styled from 'styled-component'

    const Container = styled.div\`
        background-color: blue;
        @media (min-width: ${breakpoints.md.toString()} px) {
            background-color: red;
        }
    \`;

    const App = () => <Container />;
    `;

    const root = j(input);
    transformStyledToView(root, j);

    expect(root.toSource()).toEqual(`
    import {View} from 'app-studio'

    const Container = (props) => <View 
            backgroundColor='blue'
            media={{
                md : 'red'
            }}
            {...props} />;

    const App = () => <Container />;
    `);
  });

  it('should transform media query to props with breakpoints', () => {
    const breakpoints = {
      xs: 0,
      sm: 340,
      md: 560,
      lg: 1080,
      xl: 1300,
    };

    const devices = {
      mobile: ['xs', 'sm'],
      tablet: ['md', 'lg'],
      desktop: ['lg', 'xl'],
    };

    const input = `
    import styled from 'styled-component'

    const Container = styled.div\`
        background-color: blue;
        @media (min-width: ${Math.min(
          devices.mobile.map((v) => breakpoints[v])
        ).toString()}px and ${Math.max(
      devices.mobile.map((v) => breakpoints[v])
    ).toString()}px) {
            background-color: red;
        }
    \`;

    const App = () => <Container />;
    `;

    const root = j(input);
    transformStyledToView(root, j);

    expect(root.toSource()).toEqual(`
    import {View} from 'app-studio'

    const Container = (props) => <View 
            backgroundColor='blue'
            media={{
                mobile : {
                  backgroundColor:'red'
                }
            }}
            {...props} />;

    const App = () => <Container />;
    `);
  });
});

describe('transformStyleToProps', () => {
  it('should transform style (text) to props', () => {
    const input = `
    const Container = (props) => <div 
        style="background-color: blue;color: white;"
        {...props} 
        />;

    const App = () => <Container />;
    `;

    const root = j(input);
    transformStyleToProps(root, j);

    expect(root.toSource()).toEqual(`
    import {View} from 'app-studio'

    const Container = (props) => <View 
            backgroundColor='blue' 
            color='white' 
            {...props} 
            />;

    const App = () => <Container />;
    `);
  });

  it('should transform  style (object) to props', () => {
    const input = `
    const Container = (props) => <div 
        style={{
            backgroundColor: 'blue',
            color: 'white'
        }} 
        {...props} 
        />;

    const App = () => <Container />;
    `;

    const root = j(input);
    transformStyleToProps(root, j);

    expect(root.toSource()).toEqual(`
    import {View} from 'app-studio'

    const Container = (props) => <View 
            backgroundColor='blue' 
            color="white" 
            {...props} 
            />;

    const App = () => <Container />;
    `);
  });
});
