import { IPdfOptions } from '../interfaces/pdf-strategy.interface';
import { BasePdfStrategy } from './base-pdf.strategy';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

export class SimplePdfStrategy extends BasePdfStrategy {
  private content: any[];

  constructor(options: IPdfOptions, content: any[] = []) {
    super(options);
    this.content = content.length ? content : [
      { text: 'Reporte PDF', style: 'header' },
      'Este es un ejemplo de generación de PDF con pdfmake.',
      {
        text: 'Características:',
        style: 'subheader',
        margin: [0, 15, 0, 5] as [number, number, number, number]
      },
      {
        ul: [
          'Fácil de usar',
          'Personalizable',
          'Soporte para estilos',
          'Tablas y listas'
        ]
      },
      {
        text: `Fecha de generación: ${new Date().toLocaleString()}`,
        margin: [0, 15, 0, 0] as [number, number, number, number],
        fontSize: 10,
        alignment: 'right' as const
      }
    ];
  }

  generateDefinition(): TDocumentDefinitions {
    return {
      ...this.getBaseDefinition(),
      content: this.content,
    };
  }

  getFileName(): string {
    return `reporte-${new Date().toISOString().split('T')[0]}.pdf`;
  }
}
