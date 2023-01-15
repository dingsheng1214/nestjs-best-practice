import * as path from 'path';

// 日志要写入哪个目录 dist/logs
const baseLogPath = path.resolve(__dirname, './logs');

// log4js配置文件
const log4jsConfig = {
    // 分类
    categories: {
        default: {
            appenders: ['console', 'app', 'errors'],
            // 设置权重
            level: 'DEBUG',
        },
        access: { appenders: ['access'], level: 'DEBUG' },
    },
    // 输出位置
    appenders: {
        // 输出到控制台
        console: {
            type: 'console', // 会打印到控制台
            layout: {
                type: 'Nest', // 日志格式
            },
        },
        access: {
            type: 'dateFile', // 会写入文件，并按照日期分类
            filename: `${baseLogPath}/access/access.log`, // 日志文件名，会命名为：access.20200320.log
            alwaysIncludePattern: true,
            pattern: 'yyyyMMdd',
            daysToKeep: 60,
            numBackups: 3,
            category: 'http',
            keepFileExt: true, // 是否保留文件后缀
        },
        app: {
            type: 'dateFile',
            filename: `${baseLogPath}/app-out/app.log`,
            alwaysIncludePattern: true,
            layout: {
                type: 'pattern',
                pattern:
                    '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
            },
            // 日志文件按日期（天）切割
            pattern: 'yyyyMMdd',
            daysToKeep: 60,
            // maxLogSize: 10485760,
            numBackups: 3,
            keepFileExt: true,
        },
        errorFile: {
            type: 'dateFile',
            filename: `${baseLogPath}/errors/error.log`,
            alwaysIncludePattern: true,
            layout: {
                type: 'pattern',
                pattern:
                    '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
            },
            // 日志文件按日期（天）切割
            pattern: 'yyyyMMdd',
            daysToKeep: 60,
            // maxLogSize: 10485760,
            numBackups: 3,
            keepFileExt: true,
        },
        errors: {
            type: 'logLevelFilter',
            level: 'ERROR',
            appender: 'errorFile',
        },
    },
    pm2: true, // 使用 pm2 来管理项目时，打开
    pm2InstanceVar: 'INSTANCE_ID', // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
};

export default log4jsConfig;
