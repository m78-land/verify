import { Meta, NamePath } from '@m78/verify';
import { stringifyNamePath } from '../common';

/**
 * 必须与给定的name对应的值相等
 * */
export const equality = (name: NamePath, tpl?: string) => ({
  value,
  config,
  getValueByName,
}: Meta) => {
  if (getValueByName(name) !== value)
    return {
      errorTemplate: tpl || config.languagePack.equality,
      interpolateValues: {
        targetLabel: stringifyNamePath(name),
      },
    };
};
