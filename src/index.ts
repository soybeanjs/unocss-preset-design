import type { Preset, Preflight } from '@unocss/core';
import type { Theme as UnoTheme } from '@unocss/preset-mini';
import { createOptions } from './options';
import {
  transformTokensToUnoTheme,
  getCssVariablesByTokens,
  getCssVariableString,
  getCssVariablesByTheme
} from './css-variable';
import type { PluginOptions, Token } from './type';

function presetDesign<T extends Token = Token, S extends Token = Token>(
  userOptions?: PluginOptions<T, S>
): Preset<UnoTheme> {
  const options = createOptions<T, S>(userOptions);

  const { cssVariables, cssVariableConfigs } = getCssVariablesByTokens(options.tokens, options.prefix);
  const theme = options.tokenToUnoTheme ? transformTokensToUnoTheme(cssVariableConfigs) : undefined;

  const preflights: Preflight[] = [];

  const tokensCss = getCssVariableString(cssVariables);

  if (tokensCss) {
    preflights.push({
      layer: 'tokens',
      getCSS() {
        return options.onTokenGen(tokensCss, cssVariables);
      }
    });
  }

  let hasThemeCss = false;

  const themeKeys = Object.keys(options.themes!);

  const themesCss = themeKeys
    .map(themeKey => {
      const currentTheme = options.themes![themeKey]!;

      const themeCssVariables = getCssVariablesByTheme(currentTheme, options.prefix);
      const itemCssValue = getCssVariableString(themeCssVariables);

      if (itemCssValue) {
        hasThemeCss = true;
      }

      return options.onThemeGen(themeKey, itemCssValue, themeCssVariables, options.themes);
    })
    .join('\n');

  if (hasThemeCss) {
    preflights.push({
      layer: 'themes',
      getCSS() {
        return themesCss;
      }
    });
  }

  const preset: Preset<UnoTheme> = {
    name: 'preset-design',
    theme,
    preflights
  };

  return preset;
}

export default presetDesign;
