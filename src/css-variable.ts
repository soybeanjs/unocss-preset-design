import { getColorPalette } from '@soybeanjs/color-palette';
import type { Theme as UnoTheme } from '@unocss/preset-mini';
import { transformCamelToKebab, getColorValue } from './shared';
import type { Token, Theme, RgbOrHsl } from './type';

type CssVariableConfig = {
  tokenKey: string;
  variable: string;
  value: string;
  colorType?: 'rgb' | 'hsl';
};

type CssVariableConfigs = {
  [K in keyof Token]: CssVariableConfig[];
};

/**
 * get css variables by tokens
 * @param tokens the tokens
 * @param prefix the prefix of css variable
 */
export function getCssVariablesByTokens(tokens: Token, prefix: string, colorPaletteList: string[] = []) {
  const cssVariables: Record<string, string> = {};

  const cssVariableConfigs: CssVariableConfigs = {};

  const tokenKeys = Object.keys(tokens) as (keyof Token)[];

  for (const tokenKey of tokenKeys) {
    cssVariableConfigs[tokenKey] = [];

    const token = tokens[tokenKey]!;

    const tokenItemKeys = Object.keys(token);

    for (const tokenItemKey of tokenItemKeys) {
      const cssVariableKey = getCssVariableKeyByTokenKey(tokenKey, tokenItemKey, prefix);
      let cssValue = token[tokenItemKey];

      let colorType: RgbOrHsl | undefined;

      if (tokenKey === 'colors') {
        const colorValue = getColorValue(cssValue as string);
        cssValue = colorValue.value;
        colorType = colorValue.type;

        if (colorPaletteList.includes(tokenItemKey)) {
          const colorPalette = getColorPalette(cssValue, tokenItemKey);

          colorPalette.palettes.forEach(palette => {
            const { number, hexcode } = palette;
            const colorVal = getColorValue(hexcode);

            const currentTokenKey = `${tokenItemKey}-${number}`;

            const configItem: CssVariableConfig = {
              tokenKey: currentTokenKey,
              variable: getCssVariableKeyByTokenKey(tokenKey, currentTokenKey, prefix),
              value: colorVal.value,
              colorType: colorVal.type
            };

            cssVariableConfigs[tokenKey]?.push(configItem);
          });
        }
      }

      cssVariables[cssVariableKey] = cssValue as string;

      cssVariableConfigs[tokenKey]?.push({
        tokenKey: tokenItemKey,
        variable: cssVariableKey,
        value: cssValue as string,
        colorType
      });
    }
  }

  return {
    cssVariables,
    cssVariableConfigs
  };
}

/**
 * get css variables by theme
 * @param theme
 * @param prefix
 */
export function getCssVariablesByTheme(theme: Theme<Token>, prefix: string) {
  const cssVariables: Record<string, string> = {};

  const themeKeys = Object.keys(theme) as (keyof Theme<Token>)[];

  for (const themeKey of themeKeys) {
    const themeItem = theme[themeKey]!;

    const themeItemKeys = Object.keys(themeItem);

    for (const themeItemKey of themeItemKeys) {
      const cssVariableKey = getCssVariableKeyByTokenKey(themeKey, themeItemKey, prefix);

      const { value, token } = themeItem[themeItemKey]!;

      const cssValue = token || value || '';

      if (cssValue) {
        cssVariables[cssVariableKey] = cssValue;

        if (!token && themeKey === 'colors') {
          const colorValue = getColorValue(cssValue);
          cssVariables[cssVariableKey] = colorValue.value;
        }

        if (token) {
          const tokenCssVariableKey = `--${transformCamelToKebab(`${prefix}-${token}`)}`;
          cssVariables[cssVariableKey] = `var(${tokenCssVariableKey})`;
        }
      }
    }
  }

  return cssVariables;
}

/**
 * get css variable string
 * @param cssVariables
 */
export function getCssVariableString(cssVariables: Record<string, string>) {
  return Object.entries(cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
}

/**
 * transform cssVariableConfigs to uno theme
 * @param cssVariableConfigs the css variable configs, which is transformed from tokens
 */
export function transformTokensToUnoTheme(cssVariableConfigs: CssVariableConfigs) {
  const unoTheme: UnoTheme = {};

  const tokenKeys = Object.keys(cssVariableConfigs) as (keyof Token)[];

  for (const tokenKey of tokenKeys) {
    const cssVariables = cssVariableConfigs[tokenKey]!;

    const token: Record<string, string> = {};

    for (const cssVariable of cssVariables) {
      let cssValue = `var(${cssVariable.variable})`;

      if (tokenKey === 'colors') {
        cssValue = `${cssVariable.colorType}(${cssValue})`;
      }

      token[cssVariable.tokenKey] = cssValue;
    }

    unoTheme[tokenKey] = token;
  }

  return unoTheme;
}

/**
 * get css variable key by token key
 * @param tokenKey the token key
 * @param propertyKey the property key
 * @param prefix the prefix of css variable
 */
function getCssVariableKeyByTokenKey(tokenKey: keyof Token, propertyKey: string, prefix: string) {
  return `--${transformCamelToKebab(`${prefix}-${tokenKey}-${propertyKey}`)}`;
}
