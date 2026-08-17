import React from 'react';
import { Element, ElementProps } from '../element/Element';
import { ViewStyleProps } from '../types/style';

// Common props pour éviter la répétition
interface CommonProps
  extends ElementProps, Omit<ViewStyleProps, keyof ElementProps> {}

// Props pour le composant Form
export interface FormProps
  extends
    CommonProps,
    Omit<Partial<HTMLFormElement>, keyof ElementProps>,
    ElementProps {}

// Props pour le composant Button
export interface ButtonProps
  extends CommonProps, Omit<Partial<HTMLButtonElement>, keyof CommonProps> {
  children?: React.ReactNode;
  onClick?: (..._args: any) => void;
}

// Props pour le composant Input
export interface InputProps
  extends
    ElementProps,
    CommonProps,
    Omit<Partial<HTMLInputElement>, keyof ElementProps> {
  /**
   * Visible label rendered alongside the input. Form-library wrappers (Switch,
   * TextField, Checkbox, …) consume this. Not a native HTML attribute on
   * <input>, but conventionally part of the form-control prop surface.
   */
  label?: React.ReactNode;
  /**
   * Helper text rendered below the input (hint / error / explanation).
   */
  helperText?: React.ReactNode;
  /**
   * Error state — usually a string for the error message, or a boolean toggle.
   */
  error?: boolean | string;

  // --- React Native <TextInput> props ---
  // On the native build, `Input` renders a RN <TextInput>, which accepts these
  // props (forwarded via splitNativeProps). They are declared here on the shared
  // type so cross-platform call sites typecheck against `import { Input } from
  // 'app-studio'`; on web they are simply inert.
  multiline?: boolean;
  numberOfLines?: number;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: (..._args: any[]) => void;
  keyboardType?: string;
  secureTextEntry?: boolean;
  editable?: boolean;
  caretHidden?: boolean;
  selectionColor?: string;
  placeholderTextColor?: string;
  returnKeyType?: string;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  textContentType?: string;
  blurOnSubmit?: boolean;
  scrollEnabled?: boolean;
  clearButtonMode?: string;
}

export const Form = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & FormProps
>((props, ref) => (
  <Element as="form" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    FormProps &
    React.RefAttributes<HTMLElement>
>;

export const Input = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & InputProps
>((props, ref) => (
  <Element as="input" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    InputProps &
    React.RefAttributes<HTMLElement>
>;

export const Button = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ButtonProps
>((props, ref) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!props.children && !props['aria-label']) {
      console.warn(
        'Accessibility Warning: Button is missing an accessible name. If it is an icon-only button, please provide an `aria-label`.'
      );
    }
  }
  return <Element as="button" {...props} ref={ref} />;
}) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ButtonProps &
    React.RefAttributes<HTMLElement>
>;
