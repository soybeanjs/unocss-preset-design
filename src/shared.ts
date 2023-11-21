import { colord } from 'colord';
import { consola } from 'consola';
import type { RgbOrHsl } from './type';

export function isValidColor(color: string, throwError = false) {
  const isValid = colord(color).isValid();

  if (isValid) return true;

  const errorMsg = `Invalid color : ${color}`;

  if (throwError) {
    throw Error(errorMsg);
  } else {
    consola.error(errorMsg);
  }

  return false;
}

function getRgb(color: string) {
  return colord(color).toRgb();
}

function getHsl(color: string) {
  return colord(color).toHsl();
}

export function getColorValue(color: string) {
  isValidColor(color);

  const isHsl = color.startsWith('hsl');

  const result = {
    value: '',
    type: 'rgb' as RgbOrHsl
  };

  if (isHsl) {
    const { h, s, l } = getHsl(color);

    result.value = `${h}, ${s}%, ${l}%`;
    result.type = 'hsl';
  } else {
    const { r, g, b } = getRgb(color);

    result.value = `${r}, ${g}, ${b}`;
  }

  return result;
}

export function transformCamelToKebab(str: string) {
  const result = str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

  if (result.startsWith('-')) {
    return result.slice(1);
  }

  return result;
}

export function mergeObjectWithData<T extends object>(target: T, source?: Partial<T>) {
  if (!source) return target;

  const options: T = { ...target };

  const sourceKeys = Object.keys(source) as (keyof T)[];

  sourceKeys.forEach(key => {
    if (source[key] !== undefined && source[key] !== null) {
      options[key] = source[key]!;
    }
  });

  return options;
}
