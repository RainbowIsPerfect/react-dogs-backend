class Logger {
  private resetColor: string;
  constructor(
    public infoColor: string = '\x1b[34m',
    public errorColor: string = '\x1b[31m',
    public successColor: string = '\x1b[32m',
    public processingColor: string = '\x1b[33m'
  ) {
    this.infoColor = infoColor;
    this.errorColor = errorColor;
    this.successColor = successColor;
    this.processingColor = processingColor;
    this.resetColor = '\x1b[0m';
  }

  info(message: string) {
    console.log(`${this.infoColor}[INFO]${this.resetColor}`, message);
  }

  processing(message: string) {
    console.log(`${this.processingColor}[PROCESSING]${this.resetColor}`, message);
  }

  error(message: string) {
    console.log(`${this.errorColor}[ERROR]${this.resetColor}`, message);
  }

  success(message: string) {
    console.log(`${this.successColor}[SUCCESS]${this.resetColor}`, message);
  }
}

export const logger = new Logger();
