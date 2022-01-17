import { Meta } from '@m78/verify';

export const withinValidatorKey = 'verifyWithin';

/**
 * 值必须在给定列表中, 建议仅用于基础类型
 * */
export const within = (list: any[]) => {
  function withinValidator({ value, config }: Meta) {
    if (!list.includes(value))
      return {
        errorTemplate: config.languagePack.within,
        interpolateValues: {
          within: list.join(', '),
        },
      };
  }

  withinValidator.key = withinValidatorKey;

  return withinValidator;
};
