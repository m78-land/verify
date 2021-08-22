import { Meta } from '@m78/verify';

function isUrl(url: string) {
  return /^((https?|ftp|git|ws):\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(
    url,
  );
}

/**
 * 是否为有效url
 * */
export const url = () => ({ value, config }: Meta) => {
  if (!isUrl(value)) return config.languagePack.url;
};
