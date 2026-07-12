export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogMeta { [k: string]: unknown }

export const logger = {
  debug: (m: string, meta?: LogMeta) => meta ? console.debug(m, meta) : console.debug(m),
  info: (m: string, meta?: LogMeta) => meta ? console.info(m, meta) : console.info(m),
  warn: (m: string, meta?: LogMeta) => meta ? console.warn(m, meta) : console.warn(m),
  error: (m: string, meta?: LogMeta) => meta ? console.error(m, meta) : console.error(m),
};
