import * as Path from 'path';
import * as Util from 'util';

import * as Chalk from 'chalk';
import * as dayjs from 'dayjs';
import * as Log4js from 'log4js';
import * as StackTrace from 'stacktrace-js';

import config from '../../../log4js-config';

// 日志级别
enum LoggerLevel {
    ALL = 'ALL',
    MARK = 'MARK',
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL',
    OFF = 'OFF',
}

// 内容跟踪类
class ContextTrace {
    constructor(
        public readonly context: string,
        public readonly path?: string,
        public readonly lineNumber?: number,
        public readonly columnNumber?: number,
    ) {}
}

// 添加名为Nest的布局 -- log4js-config.ts ->console(appender) 中使用
Log4js.addLayout('Nest', (logConfig: any) => {
    return (logEvent: Log4js.LoggingEvent): string => {
        let moduleName = '';
        let position = '';

        // 日志组装
        const messageList: string[] = [];
        logEvent.data.forEach((value: any) => {
            if (value instanceof ContextTrace) {
                moduleName = value.context;
                // 显示触发日志的坐标（行，列）
                if (value.lineNumber && value.columnNumber) {
                    position = `${value.lineNumber}, ${value.columnNumber}`;
                }
                return;
            }

            if (typeof value !== 'string') {
                // eslint-disable-next-line no-param-reassign
                value = Util.inspect(value, false, 3, true);
            }

            messageList.push(value);
        });

        // 日志组成部分
        const messageOutput: string = messageList.join(' ');
        const positionOutput: string = position ? ` [${position}]` : '';
        const typeOutput = `[${logConfig.type}] ${logEvent.pid.toString()}  - `;
        const dateOutput = `${dayjs(logEvent.startTime).format('YYYY/MM/DD HH:mm:ss')}`;
        const moduleOutput: string = moduleName ? `[${moduleName}] ` : '[LoggerService] ';
        let levelOutput = `[${logEvent.level}] ${messageOutput}`;

        // 根据日志级别，用不同颜色区分
        switch (logEvent.level.toString()) {
            case LoggerLevel.DEBUG:
                levelOutput = Chalk.green(levelOutput);
                break;
            case LoggerLevel.INFO:
                levelOutput = Chalk.cyan(levelOutput);
                break;
            case LoggerLevel.WARN:
                levelOutput = Chalk.yellow(levelOutput);
                break;
            case LoggerLevel.ERROR:
                levelOutput = Chalk.red(levelOutput);
                break;
            case LoggerLevel.FATAL:
                levelOutput = Chalk.hex('#DD4C35')(levelOutput);
                break;
            default:
                levelOutput = Chalk.grey(levelOutput);
                break;
        }

        return `${Chalk.green(typeOutput)}${dateOutput}  ${Chalk.yellow(
            moduleOutput,
        )}${levelOutput}${positionOutput}`;
    };
});

// 注入配置
Log4js.configure(config);

// 实例化-category: default
const defaultLogger = Log4js.getLogger();
defaultLogger.level = LoggerLevel.TRACE;

export default class Logger {
    static trace(...args) {
        defaultLogger.trace(Logger.getStackTrace(), ...args);
    }

    static debug(...args) {
        defaultLogger.debug(Logger.getStackTrace(), ...args);
    }

    static log(...args) {
        defaultLogger.info(Logger.getStackTrace(), ...args);
    }

    static info(...args) {
        defaultLogger.info(Logger.getStackTrace(), ...args);
    }

    static warn(...args) {
        defaultLogger.warn(Logger.getStackTrace(), ...args);
    }

    static warning(...args) {
        defaultLogger.warn(Logger.getStackTrace(), ...args);
    }

    static error(...args) {
        defaultLogger.error(Logger.getStackTrace(), ...args);
    }

    static fatal(...args) {
        defaultLogger.fatal(Logger.getStackTrace(), ...args);
    }

    static access(...args) {
        // category: access
        const accessLogger = Log4js.getLogger('access');
        accessLogger.info(Logger.getStackTrace(), ...args);
    }

    static msg(msg) {
        defaultLogger.info(msg);
    }

    // 日志追踪，可以追溯到哪个文件、第几行第几列
    static getStackTrace(deep = 2): string {
        const stackList: StackTrace.StackFrame[] = StackTrace.getSync();
        const stackInfo: StackTrace.StackFrame = stackList[deep];

        const { lineNumber } = stackInfo;
        const { columnNumber } = stackInfo;
        const { fileName } = stackInfo;
        const basename: string = Path.basename(fileName);
        return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`;
    }
}
