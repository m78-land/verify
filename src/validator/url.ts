import { Meta } from '@m78/verify';

function isUrl(url: string) {
  return /^((https?|ftp|git|ws):\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(
    url,
  );
}

export const urlValidatorKey = 'verifyUrl';

/**
 * 是否为有效url
 * */
export const url = () => {
  function urlValidator({ value, config }: Meta) {
    if (!isUrl(value)) return config.languagePack.url;
  }

  urlValidator.key = urlValidatorKey;

  return urlValidator;
};
