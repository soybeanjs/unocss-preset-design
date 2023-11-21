import { mergeObjectWithData } from './shared';
import type { Token, PluginOptions, RequiredOption } from './type';

export function createOptions<T extends Token = Token, S extends Token = Token>(userOptions?: PluginOptions<T, S>) {
  const defaultOptions: RequiredOption = {
    prefix: 'soy',
    tokens: {},
    onTokenGen: (css: string) => `:root {\n${css}\n}`,
    themes: {},
    onThemeGen: (theme, css) => `html[data-theme="${theme}"] {\n${css}\n}`,
    components: {},
    tokenToUnoTheme: true,
    colorPaletteList: []
  };

  const options = mergeObjectWithData(defaultOptions, userOptions as PluginOptions);

  return options;
}
