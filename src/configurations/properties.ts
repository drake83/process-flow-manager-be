export interface ProcessEnv {
  [key: string]: string | undefined;
}

export const SERVER_PORT = process.env.SERVER_PORT || 5000;

export const MONGODB_REPO_CONNECTION =
  process.env.MONGODB_REPO_CONNECTION ||
  'mongodb://localhost:27017/process-flow-manager';

// MONGOOSE ENC/DEC KEYS
export const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'q32pgTRM/2BerELgc9nZz0LLOm18ruVtwAYhJsG+mWQ=';
export const SIGN_KEY =
  process.env.SIGN_KEY ||
  'ku4xi9qiQyF94KROFgVNR/Is7Wypcih6aPWys2mO9E+uIVhYIVY//Zd6a2mFk3fFwxeWoy4ZY2nwSgaEEjQGEw==';
export const IV_KEY = 'NdRgUkXp2s5v8y/B?E(H+MbPeShVmYq3';
