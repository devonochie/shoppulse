enum LOGLEVEL {
    INFO= 'INFO',
    WARN= 'WARN',
    ERROR= 'ERROR',
    DEBUG= 'DEBUG'
}

const logLevels: Record<LOGLEVEL, string> = {
    [LOGLEVEL.INFO]: 'info',
    [LOGLEVEL.WARN]: 'warn',
    [LOGLEVEL.ERROR]: 'error',
    [LOGLEVEL.DEBUG]: 'debug'
}

type LogLevel = typeof logLevels[LOGLEVEL];

const log = (level: LogLevel, message: string, ...optionalParams: unknown[] ) => {
    if (process.env.NODE_ENV === "test" && level !== logLevels.ERROR ) return;

    const timestamp: string = new Date().toISOString()
    const formattedMessage: string = typeof message === 'object'
        ?  JSON.stringify(message, null, 2)
        : message

    const logEntry = `[${timestamp}] [${level.toUpperCase()}]: ${formattedMessage}`;

    switch (level) {
        case logLevels.INFO:
        console.log(logEntry, ...optionalParams);
        break;
        case logLevels.WARN:
        console.warn(logEntry, ...optionalParams);
        break;
        case logLevels.ERROR:
        console.error(logEntry, ...optionalParams);
        break;
        case logLevels.DEBUG:
        if (process.env.NODE_ENV !== 'production') {
            console.debug(logEntry, ...optionalParams);
        }
        break;
        default:
            console.log(logEntry, ...optionalParams);
    }

}

const logger = {
    info: (message: string, ...params: unknown[]) => log(logLevels.INFO, message, ...params),
    warn: (message: string, ...params: unknown[]) => log(logLevels.WARN, message, ...params),
    error: (message: string, ...params: unknown[]) => log(logLevels.ERROR, message, ...params),
    debug: (message: string, ...params: unknown[]) => log(logLevels.DEBUG, message, ...params),

    line: () => console.log('-'.repeat(50)),
    header: (title: string) => {
        console.log('\n' + '='.repeat(50));
        console.log(`\t${title}`);
        console.log('='.repeat(50) + '\n');
    }
};

export default logger;