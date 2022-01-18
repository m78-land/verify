import { Meta, NamePath } from '@m78/verify';
import { stringifyNamePath } from '@lxjx/utils';
import { isVerifyEmpty } from './required';

export const equalityValidatorKey = 'verifyEquality';

/**
 * 必须与给定的name对应的值相等
 * */
export const equality = (name: NamePath, tpl?: string) => {
  function equalityValidator({ value, config, getValueByName }: Meta) {
    if (isVerifyEmpty(value)) return;
    if (getValueByName(name) !== value)
      return {
        errorTemplate: tpl || config.languagePack.equality,
        interpolateValues: {
          targetLabel: stringifyNamePath(name),
        },
      };
  }

  equalityValidator.key = equalityValidatorKey;

  return equalityValidator;
};
