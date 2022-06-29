import { datetime, parseDate } from '@lxjx/utils';
import { Meta, Validator } from '@m78/verify';
import { isVerifyEmpty } from './required';

interface Opt {
  /** 不大于此时间, 传入值为任何能被解析的时间(Date对象、时间戳、日期字符串等) */
  max?: any;
  /** 不小于此时间, 传入值为任何能被解析的时间(Date对象、时间戳、日期字符串等) */
  min?: any;
  /** 必须为指定时间, 传入值为任何能被解析的时间(Date对象、时间戳、日期字符串等) */
  at?: any;
}

export const dateValidatorKey = 'verifyDate';

/**
 * 必须是有效的日期对象或能被解析的日期值(时间戳、日期字符串等)
 * */
export const date = (option?: Opt) => {
  const dateValidator: Validator = ({ value, config }: Meta) => {
    if (isVerifyEmpty(value)) return;

    const pack = config.languagePack.date;
    const d = parseDate(value);

    if (d === null)
      return {
        errorTemplate: pack.notExpected,
        interpolateValues: option || {},
      };

    if (!option) return;

    const at = parseDate(option.at);
    const max = parseDate(option.max);
    const min = parseDate(option.min);

    const interpolateValues = {
      at: datetime(at) || at,
      max: datetime(max) || max,
      min: datetime(min) || min,
    };

    if (at !== null && d.getTime() !== at.getTime())
      return {
        errorTemplate: pack.at,
        interpolateValues,
      };

    if (
      max !== null &&
      min !== null &&
      (d.getTime() > max.getTime() || d.getTime() < min.getTime())
    ) {
      return {
        errorTemplate: pack.between,
        interpolateValues,
      };
    }

    if (max !== null && d.getTime() > max.getTime())
      return {
        errorTemplate: pack.max,
        interpolateValues,
      };

    if (min !== null && d.getTime() < min.getTime())
      return {
        errorTemplate: pack.min,
        interpolateValues,
      };
  };

  dateValidator.key = dateValidatorKey;

  return dateValidator;
};
