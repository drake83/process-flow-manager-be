export const V1_BASE_PATH = '/v1/api';
export const V1_SECURITY_PATH = `${V1_BASE_PATH}/secured`;
export const TOKEN_EXPIRATION = 3600 * 8;
export const passwordRegex: RegExp =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
