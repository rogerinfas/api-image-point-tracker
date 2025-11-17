import { IPdfStrategy } from '../interfaces/pdf-strategy.interface';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

export class PdfContext {
  private strategy: IPdfStrategy;

  constructor(strategy: IPdfStrategy) {
    this.strategy = strategy;
    this.initializePdfMake();
  }

  private initializePdfMake() {
    (pdfMake as any).vfs = pdfFonts.vfs;
  }

  public setStrategy(strategy: IPdfStrategy) {
    this.strategy = strategy;
  }

  public async generatePdf(): Promise<{ buffer: Buffer; fileName: string }> {
    const docDefinition = this.strategy.generateDefinition();
    const fileName = this.strategy.getFileName();
    
    const pdfDoc = pdfMake.createPdf(docDefinition);
    
    return new Promise((resolve, reject) => {
      pdfDoc.getBuffer((buffer: Buffer) => {
        resolve({ buffer, fileName });
      });
    });
  }
}
