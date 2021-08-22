import { Meta } from '@m78/verify';

/**
 * 值必须在给定列表中, 建议仅用于基础类型
 * */
export const within = (list: any[]) => ({ value, config }: Meta) => {
  if (!list.includes(value))
    return {
      errorTemplate: config.languagePack.within,
      interpolateValues: {
        within: list.join(', '),
      },
    };
};
