import type { Theme as UnoTheme } from '@unocss/preset-mini';

type RgbColor = `rgb(${number}, ${number}, ${number})`;

type HslColor = `hsl(${number}, ${number}%, ${number}%)`;

export type TokenColor = RgbColor | HslColor;

export type RgbOrHsl = 'rgb' | 'hsl';

/**
 * Token
 */
export type Token = Omit<
  UnoTheme,
  | 'colors'
  | 'fontSize'
  | 'boxShadow'
  | 'textShadow'
  | 'dropShadow'
  | 'animation'
  | 'container'
  | 'preflightRoot'
  | 'preflightBase'
> & {
  /**
   * colors
   * @description there are three types of color: rgba, rgb, hsl
   * @example
   * rgba: 'rgba(100, 108, 255, 0.5)'
   * rgb: 'rgb(100, 108, 255)'
   * hsl: 'hsl(223, 86%, 89%)'
   */
  colors?: Record<string, TokenColor>;
};

/**
 * Convert token to css variable
 */
type TokenToCssVariable<T extends Token> = {
  [K in keyof T]: K extends string ? (keyof T[K] extends string ? `${K}-${keyof T[K]}` : never) : never;
};

/**
 * Theme
 */
export type Theme<T extends Token, S extends Token = Token> = {
  [K in keyof S]?: Record<
    string,
    K extends keyof T ? { value?: K extends 'colors' ? TokenColor : string; token?: TokenToCssVariable<T>[K] } : never
  >;
};

/**
 * Multi Theme
 */
export type MultiTheme<T extends Token, S extends Token = Token> = Record<string, Theme<T, S>>;

/**
 * Component Token
 */
export type ComponentToken<T extends Token, K extends keyof T = keyof T> = K extends string
  ? keyof T[K] extends string
    ? Record<string, `${K}-${keyof T[K]}`>
    : never
  : never;

/**
 * components
 */
export type MultiComponent<T extends Token> = Record<string, ComponentToken<T>>;

/**
 * Plugin Options
 */
export type PluginOptions<T extends Token = Token, S extends Token = Token> = {
  /**
   * the prefix of css variables
   * @default 'soy'
   * @example `--soy-colors-primary`
   */
  prefix?: string;
  /**
   * tokens
   * @description the tokens will be used to generate css variables.
   * - only the value of token colors in the css variable
   * @example `--soy-colors-primary: 100, 108, 255;`
   */
  tokens?: T;
  /**
   * generate css variable by the tokens
   * @param css the css variable string
   * @param cssVariables the css variables
   * @default
   * ```ts
   * onTokenGen: (css) => `:root {
   *   ${css}
   * }
   * `
   * ```
   */
  onTokenGen?: (css: string, cssVariables: Record<string, string>) => string;
  /**
   * the themes contain different sets of tokens
   * @description the themes will be used to generate css variables
   */
  themes?: MultiTheme<T, S>;
  /**
   * generate css variable by the themes
   * @param theme the theme name
   * @param css the css variable string
   * @param cssVariables the css variables
   * @param themes the total themes after merged
   * @default
   * ```ts
   * (theme, css) => `html[data-theme="${theme}"] {\n${css}\n}`
   * ```
   */
  onThemeGen?: (theme: string, css: string, cssVariables: Record<string, string>, themes: MultiTheme<T, S>) => string;
  /**
   * components, which is combined by the tokens, and will transformed to the rules of UnoCSS
   * @example
   * ```
   * components: {
   *   'button-primary': {
   *     'button-text-color': 'colors-primary',
   *     'button-bg-color': 'colors-bg',
   *   }
   * }
   * ```
   * ** it will be transformed to the rules of UnoCSS**
   * ```
   *  ['button-primary', {
   *     '--soy-button-text-color': 'var(--soy-colors-primary)';
   *     '--soy-button-bg-color': 'var(--soy-colors-bg)';
   *  }],
   * ```
   * the css is like this:
   * ```css
   * .button-primary {
   *   --soy-button-text-color: var(--soy-colors-primary);
   *   --soy-button-bg-color: var(--soy-colors-bg);
   * }
   * ```
   */
  components?: MultiComponent<T>;
  /**
   * whether transform the tokens to UnoCSS theme
   * @default true
   * @example
   * ```
   * tokens: {
   *   colors: {
   *     primary: 'rgb(100, 108, 255)',
   *     secondary: 'hsl(223, 86%, 89%)'
   *   }
   * }
   * ** the tokens will be transformed to **
   * theme: {
   *   colors: {
   *     primary: 'rgb(var(--soy-colors-primary))',
   *     secondary: 'hsl(var(--soy-colors-secondary))'
   *   }
   * }
   * ```
   */
  tokenToUnoTheme?: boolean;
  /**
   * generate color palette of the provided color list for theme colors
   * @description when tokenToUnoTheme is true, it will has effect
   * @default true
   * @example
   * provided color list: ['primary']
   * ```
   * tokens: {
   *   colors: {
   *     primary: 'rgb(100, 108, 255)',
   *   }
   * }
   * ** the tokens will be transformed to **
   * theme: {
   *  colors: {
   *    primary: 'rgb(var(--soy-colors-primary))',
   *    'primary-50': 'rgb(var(--soy-colors-primary-100))',
   *    'primary-100': 'rgb(var(--soy-colors-primary-100))',
   *    'primary-200': 'rgb(var(--soy-colors-primary-200))',
   *    'primary-300': 'rgb(var(--soy-colors-primary-300))',
   *    'primary-400': 'rgb(var(--soy-colors-primary-400))',
   *    'primary-500': 'rgb(var(--soy-colors-primary-500))',
   *    'primary-600': 'rgb(var(--soy-colors-primary-600))',
   *    'primary-700': 'rgb(var(--soy-colors-primary-700))',
   *    'primary-800': 'rgb(var(--soy-colors-primary-800))',
   *    'primary-900': 'rgb(var(--soy-colors-primary-900))',
   *    'primary-950': 'rgb(var(--soy-colors-primary-900))',
   *   }
   * }
   * ```
   */
  colorPaletteList?: string[];
};

export type RequiredOption<T extends Token = Token, S extends Token = Token> = Required<PluginOptions<T, S>>;
