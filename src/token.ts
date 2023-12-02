import type { Theme as UnoTheme } from '@unocss/preset-mini';

type Token = Pick<
  UnoTheme,
  | 'colors'
  | 'accentColor'
  | 'borderColor'
  | 'textColor'
  | 'shadowColor'
  | 'backgroundColor'
  | 'borderRadius'
  | 'breakpoints'
  | 'fontFamily'
  | 'fontSize'
  | 'ringWidth'
  | 'duration'
  | 'easing'
  | 'lineHeight'
  | 'spacing'
>;

type KebabCase<Str extends string> = Str extends `${infer First}${infer Other}`
  ? Other extends Uncapitalize<Other>
    ? `${Lowercase<First>}${KebabCase<Other>}`
    : `${Lowercase<First>}-${KebabCase<Other>}`
  : Str;

type GetTokenKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? `${KebabCase<K>}.${GetTokenKey<T[K]>}`
    : `${KebabCase<K>}`
  : never;

interface UserOption<T extends Token, TokenOfTheme extends object> {
  tokens: T;
  themes: Record<string, Record<keyof TokenOfTheme, `token.${GetTokenKey<T>}`>>;
  components: keyof TokenOfTheme extends string ? Record<string, Record<string, `theme.${keyof TokenOfTheme}`>> : never;
}

function createOptions<TokenOfTheme extends object, T extends Token>(options: UserOption<T, TokenOfTheme>) {
  return options;
}

createOptions({
  tokens: {
    colors: {
      primary: {
        '50': '#f0f5ff',
        '100': '#e5f0ff',
        '200': '#c9e2ff',
        '300': '#a9ceff',
        '400': '#83b9ff',
        '500': '#57a3ff',
        '600': '#3892ff',
        '700': '#1f82ff',
        '800': '#106dff',
        '900': '#0057ff',
        '950': '#0049e6'
      }
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    }
  },
  themes: {
    element: {
      demo: 'token.border-radius.lg',
      demo2: 'token.colors.primary.500',
      demo3: 'token.colors.primary.500'
    },
    antd: {
      demo: 'token.border-radius.md',
      demo2: 'token.colors.primary.200',
      demo3: 'token.colors.primary.200'
    }
  },
  components: {
    button: {
      borderColor: 'theme.demo',
      bgColor: 'theme.demo3',
      color: 'theme.demo2'
    }
  }
});
