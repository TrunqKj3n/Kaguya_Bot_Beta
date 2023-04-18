import chalk from 'chalk';
type LogMessage = {
    message: string;
    color: keyof typeof colors;
};

const colors = {
    red: '#ff0000',
    green: '#00ff00',
    yellow: '#ffff00',
    blue: '#0000ff',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    white: '#ffffff',
    gray: '#808080',
    ocean: '#00bfff',
};

export const log = async (messages: LogMessage[]) => {
    const logMessage = messages
        .map(({ message, color }) => chalk.hex(colors[color])(message))
        .join('');

    console.log(logMessage, '');
};