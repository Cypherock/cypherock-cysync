export const getEnvVariable = (key: string, defaultValue?: string): string => {
  let value: string | undefined;

  if (typeof process !== 'undefined' && process.env) {
    value = process.env[key];
  } else if (typeof window !== 'undefined' && (window as any).cysyncEnv) {
    value = (window as any).cysyncEnv[key];
  }

  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error(`ENVIRONMENT VARIABLE '${key}' NOT SPECIFIED.`);
};

export const config = {
  LOG_LEVEL: getEnvVariable('LOG_LEVEL', 'debug'),
};
