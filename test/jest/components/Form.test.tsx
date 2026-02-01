import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Form, Input, Button } from '../../../src/components/Form';
import { ThemeProvider } from '../../../src/providers/Theme';

describe('Form Component', () => {
  it('should render form element', () => {
    const { container } = render(
      <ThemeProvider>
        <Form data-testid="test-form" />
      </ThemeProvider>
    );

    const form = container.querySelector('[data-testid="test-form"]');
    expect(form?.tagName.toLowerCase()).toBe('form');
  });

  it('should accept data-testid prop', () => {
    const { container } = render(
      <ThemeProvider>
        <Form data-testid="my-form" />
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="my-form"]')).toBeInTheDocument();
  });

  it('should handle form submission', () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());

    const { container } = render(
      <ThemeProvider>
        <Form onSubmit={handleSubmit} data-testid="submit-form" />
      </ThemeProvider>
    );

    const form = container.querySelector('[data-testid="submit-form"]') as HTMLFormElement;
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should support CSS styling props', () => {
    const { container } = render(
      <ThemeProvider>
        <Form width={500} padding={20} data-testid="styled-form" />
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="styled-form"]')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <ThemeProvider>
        <Form ref={ref} data-testid="form-ref" />
      </ThemeProvider>
    );

    expect(ref.current).toBeInTheDocument();
  });

  it('should render children', () => {
    const { container } = render(
      <ThemeProvider>
        <Form data-testid="form-with-children">
          <Input data-testid="child-input" />
        </Form>
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="form-with-children"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child-input"]')).toBeInTheDocument();
  });
});

describe('Input Component', () => {
  it('should render input element', () => {
    const { container } = render(
      <ThemeProvider>
        <Input data-testid="test-input" />
      </ThemeProvider>
    );

    const input = container.querySelector('[data-testid="test-input"]');
    expect(input?.tagName.toLowerCase()).toBe('input');
  });

  it('should accept data-testid prop', () => {
    const { container } = render(
      <ThemeProvider>
        <Input data-testid="my-input" />
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="my-input"]')).toBeInTheDocument();
  });

  it('should accept value prop', () => {
    const { container } = render(
      <ThemeProvider>
        <Input value="test value" readOnly data-testid="value-input" />
      </ThemeProvider>
    );

    const input = container.querySelector('[data-testid="value-input"]') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('should accept type prop', () => {
    const { container } = render(
      <ThemeProvider>
        <Input type="email" data-testid="email-input" />
      </ThemeProvider>
    );

    const input = container.querySelector('[data-testid="email-input"]') as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('should accept placeholder prop', () => {
    const { container } = render(
      <ThemeProvider>
        <Input placeholder="Enter text" data-testid="placeholder-input" />
      </ThemeProvider>
    );

    const input = container.querySelector('[data-testid="placeholder-input"]') as HTMLInputElement;
    expect(input.placeholder).toBe('Enter text');
  });

  it('should handle onChange event', () => {
    const handleChange = jest.fn();

    const { container } = render(
      <ThemeProvider>
        <Input onChange={handleChange} data-testid="change-input" />
      </ThemeProvider>
    );

    const input = container.querySelector('[data-testid="change-input"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should support CSS styling props', () => {
    const { container } = render(
      <ThemeProvider>
        <Input width={300} padding={10} data-testid="styled-input" />
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="styled-input"]')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <ThemeProvider>
        <Input ref={ref} data-testid="input-ref" />
      </ThemeProvider>
    );

    expect(ref.current).toBeInTheDocument();
  });

  it('should support disabled state', () => {
    const { container } = render(
      <ThemeProvider>
        <Input disabled data-testid="disabled-input" />
      </ThemeProvider>
    );

    const input = container.querySelector('[data-testid="disabled-input"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});

describe('Button Component', () => {
  it('should render button element', () => {
    const { container } = render(
      <ThemeProvider>
        <Button data-testid="test-button">Click me</Button>
      </ThemeProvider>
    );

    const button = container.querySelector('[data-testid="test-button"]');
    expect(button?.tagName.toLowerCase()).toBe('button');
  });

  it('should accept data-testid prop', () => {
    const { container } = render(
      <ThemeProvider>
        <Button data-testid="my-button">Button</Button>
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="my-button"]')).toBeInTheDocument();
  });

  it('should render children', () => {
    const { container } = render(
      <ThemeProvider>
        <Button data-testid="text-button">Click me</Button>
      </ThemeProvider>
    );

    const button = container.querySelector('[data-testid="text-button"]');
    expect(button?.textContent).toBe('Click me');
  });

  it('should handle onClick event', () => {
    const handleClick = jest.fn();

    const { container } = render(
      <ThemeProvider>
        <Button onClick={handleClick} data-testid="click-button">
          Click
        </Button>
      </ThemeProvider>
    );

    const button = container.querySelector('[data-testid="click-button"]') as HTMLButtonElement;
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

  it('should accept type prop', () => {
    const { container } = render(
      <ThemeProvider>
        <Button type="submit" data-testid="submit-button">
          Submit
        </Button>
      </ThemeProvider>
    );

    const button = container.querySelector('[data-testid="submit-button"]') as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });

  it('should support CSS styling props', () => {
    const { container } = render(
      <ThemeProvider>
        <Button padding={15} backgroundColor="blue" data-testid="styled-button">
          Styled
        </Button>
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="styled-button"]')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <ThemeProvider>
        <Button ref={ref} data-testid="button-ref">
          Ref Button
        </Button>
      </ThemeProvider>
    );

    expect(ref.current).toBeInTheDocument();
  });

  it('should support disabled state', () => {
    const { container } = render(
      <ThemeProvider>
        <Button disabled data-testid="disabled-button">
          Disabled
        </Button>
      </ThemeProvider>
    );

    const button = container.querySelector('[data-testid="disabled-button"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should work with onClick when disabled', () => {
    const handleClick = jest.fn();

    const { container } = render(
      <ThemeProvider>
        <Button disabled onClick={handleClick} data-testid="disabled-click-button">
          Disabled
        </Button>
      </ThemeProvider>
    );

    const button = container.querySelector('[data-testid="disabled-click-button"]') as HTMLButtonElement;
    fireEvent.click(button);

    // Click should not be called when disabled
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('Form Integration Tests', () => {
  it('should work together in a form', () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());

    const { container } = render(
      <ThemeProvider>
        <Form onSubmit={handleSubmit} data-testid="integration-form">
          <Input type="text" placeholder="Username" data-testid="username-input" />
          <Input type="password" placeholder="Password" data-testid="password-input" />
          <Button type="submit" data-testid="submit-button">
            Login
          </Button>
        </Form>
      </ThemeProvider>
    );

    const form = container.querySelector('[data-testid="integration-form"]');
    const usernameInput = container.querySelector('[data-testid="username-input"]');
    const passwordInput = container.querySelector('[data-testid="password-input"]');
    const submitButton = container.querySelector('[data-testid="submit-button"]');

    expect(form).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.submit(form as HTMLFormElement);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should support nested data-testid selection', () => {
    const { container } = render(
      <ThemeProvider>
        <Form data-testid="outer-form">
          <Input data-testid="nested-input" />
        </Form>
      </ThemeProvider>
    );

    const form = container.querySelector('[data-testid="outer-form"]');
    const input = form?.querySelector('[data-testid="nested-input"]');

    expect(form).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });
});
