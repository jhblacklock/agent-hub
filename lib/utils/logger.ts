type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  context?: string;
}

const formatLog = (
  level: LogLevel,
  message: string,
  data?: any,
  context?: string
): LogMessage => ({
  level,
  message,
  data,
  timestamp: new Date().toISOString(),
  context,
});

const logger = {
  info: (message: string, data?: any, context?: string) => {
    const log = formatLog('info', message, data, context);
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[${log.timestamp}] 📘 INFO${context ? ` (${context})` : ''}: ${message}`,
        data || ''
      );
    }
    return log;
  },

  warn: (message: string, data?: any, context?: string) => {
    const log = formatLog('warn', message, data, context);
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[${log.timestamp}] 📙 WARN${context ? ` (${context})` : ''}: ${message}`,
        data || ''
      );
    }
    return log;
  },

  error: (message: string, error?: any, context?: string) => {
    const log = formatLog('error', message, error, context);
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[${log.timestamp}] 📕 ERROR${context ? ` (${context})` : ''}: ${message}`,
        error || ''
      );
    }
    return log;
  },

  debug: (message: string, data?: any, context?: string) => {
    const log = formatLog('debug', message, data, context);
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `[${log.timestamp}] 📓 DEBUG${context ? ` (${context})` : ''}: ${message}`,
        data || ''
      );
    }
    return log;
  },
};

export default logger;
