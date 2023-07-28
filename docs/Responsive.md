## Media Prop for Responsive Design

```jsx
import React from 'react';
import { ResponsiveProvider } from 'app-studio';

const Example = () => {
  const { screen, on } = useResponsive();
  // "screen" provide you the screen size corresponding to you breakpoints
  // "on" tell you is screen size is included corresponding to you devices
  const responsive = {
    xs: {
      backgroundColor: 'red',
    },
    sm: {
      backgroundColor: 'green',
    },
    md: {
      backgroundColor: 'blue',
    },
    lg: {
      backgroundColor: 'yellow',
    },
    xl: {
      backgroundColor: 'red',
    },
  };

  return (
    <View size={100} 
    {...responsive[screen]}       
>
      {screen} -  mobile : {on('mobile') ? 'yes' : 'no'}
    </View>
  );
}

const App = () => (<ResponsiveProvider 
    breakpoints={{
        xs: 0,
        sm: 340,
        md: 560,
        lg: 1080,
        xl: 1300,
    }} 

    devices={{  
        mobile: ['xs', 'sm'],
        tablet: ['md', 'lg'],
        desktop: ['lg', 'xl']
    }}
    >
    <Exemple />
<ResponsiveProvider>);



```


The 'media' prop is used to manage responsive design in CSS. It takes an object as a value, where the keys are the names of the devices or screen sizes and the values are objects that define the styles to apply for the corresponding device or screen size. 

Here is an example:


```jsx
import React from 'react';
import { ResponsiveProvider } from 'app-studio';

const Example = () => {
  // "media" will apply  css to the devices or screen  configuration without rerendering the component

  return (
    <View size={100} 
     media={{
        mobile: {
          backgroundColor: 'green',
        },
        tablet: {
          backgroundColor: 'yellow',
        },
        xl: {
          backgroundColor: 'blue',
        },
      }}  
      />
  );
}

const App = () => (<ResponsiveProvider 
    breakpoints={{
        xs: 0,
        sm: 340,
        md: 560,
        lg: 1080,
        xl: 1300,
    }} 

    devices={{  
        mobile: ['xs', 'sm'],
        tablet: ['md', 'lg'],
        desktop: ['lg', 'xl']
    }}
    >
    <Exemple />
<ResponsiveProvider>);



```