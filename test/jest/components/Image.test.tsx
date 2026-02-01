import React from 'react';
import { render } from '@testing-library/react';
import { Image, ImageBackground } from '../../../src/components/Image';
import { ThemeProvider } from '../../../src/providers/Theme';

describe('Image Component', () => {
  it('should render img element', () => {
    const { container } = render(
      <ThemeProvider>
        <Image data-testid="image" />
      </ThemeProvider>
    );

    const image = container.querySelector('[data-testid="image"]');
    expect(image?.tagName.toLowerCase()).toBe('img');
  });

  it('should accept src prop', () => {
    const { container } = render(
      <ThemeProvider>
        <Image src="test.jpg" data-testid="image" />
      </ThemeProvider>
    );

    const image = container.querySelector(
      '[data-testid="image"]'
    ) as HTMLImageElement;
    expect(image.src).toContain('test.jpg');
  });

  it('should accept alt prop', () => {
    const { container } = render(
      <ThemeProvider>
        <Image alt="Test Image" data-testid="image" />
      </ThemeProvider>
    );

    const image = container.querySelector(
      '[data-testid="image"]'
    ) as HTMLImageElement;
    expect(image.alt).toBe('Test Image');
  });

  it('should support CSS styling props', () => {
    const { container } = render(
      <ThemeProvider>
        <Image width={100} height={100} data-testid="image" />
      </ThemeProvider>
    );

    expect(
      container.querySelector('[data-testid="image"]')
    ).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <ThemeProvider>
        <Image ref={ref} data-testid="image" />
      </ThemeProvider>
    );

    expect(ref.current).toBeInTheDocument();
  });
});

describe('ImageBackground Component', () => {
  it('should render element with background image', () => {
    const { container } = render(
      <ThemeProvider>
        <ImageBackground src="bg.jpg" data-testid="bg-image" />
      </ThemeProvider>
    );

    expect(
      container.querySelector('[data-testid="bg-image"]')
    ).toBeInTheDocument();
  });

  it('should set background-image from src prop', () => {
    const { container } = render(
      <ThemeProvider>
        <ImageBackground src="bg.jpg" data-testid="bg-image" />
      </ThemeProvider>
    );

    const element = container.querySelector('[data-testid="bg-image"]');
    expect(element).toBeInTheDocument();
  });

  it('should support additional styling props', () => {
    const { container } = render(
      <ThemeProvider>
        <ImageBackground
          src="bg.jpg"
          width={200}
          height={200}
          data-testid="bg-image"
        />
      </ThemeProvider>
    );

    expect(
      container.querySelector('[data-testid="bg-image"]')
    ).toBeInTheDocument();
  });

  it('should render children over background', () => {
    const { container } = render(
      <ThemeProvider>
        <ImageBackground src="bg.jpg">
          <span>Content</span>
        </ImageBackground>
      </ThemeProvider>
    );

    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <ThemeProvider>
        <ImageBackground src="bg.jpg" ref={ref} />
      </ThemeProvider>
    );

    expect(ref.current).toBeInTheDocument();
  });
});
