import { Meta } from '@m78/verify';

/**
 * 值必须不在给定列表中, 建议仅用于基础类型
 * */
export const without = (list: any[]) => ({ value, config }: Meta) => {
  if (list.includes(value))
    return {
      errorTemplate: config.languagePack.without,
      interpolateValues: {
        without: list.join(', '),
      },
    };
};
