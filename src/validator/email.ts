import { Meta } from '@m78/verify';

function isEmial(email: string) {
  return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
    email,
  );
}

/**
 * 是否为有效email
 * */
export const email = () => ({ value, config }: Meta) => {
  if (!isEmial(value)) return config.languagePack.email;
};
