import { Injectable } from '@nestjs/common';
import { PdfContext } from './contexts/pdf.context';
import { SimplePdfStrategy } from './strategies/simple-pdf.strategy';
import { IPdfOptions } from './interfaces/pdf-strategy.interface';

type PdfType = 'simple' | 'custom';

@Injectable()
export class PdfService {
  private context: PdfContext;

  constructor() {
    // Configuración por defecto
    const defaultStrategy = new SimplePdfStrategy({
      title: 'Reporte PDF',
      orientation: 'landscape',
    });
    this.context = new PdfContext(defaultStrategy);
  }

  /**
   * Genera un PDF con la estrategia especificada
   * @param type Tipo de PDF a generar
   * @param options Opciones de configuración del PDF
   * @param content Contenido personalizado (opcional)
   * @returns Buffer del PDF generado y nombre del archivo
   */
  async generatePdf(
    type: PdfType = 'simple',
    options?: IPdfOptions,
    content?: any[],
  ): Promise<{ buffer: Buffer; fileName: string }> {
    try {
      switch (type) {
        case 'simple':
          this.context.setStrategy(new SimplePdfStrategy(options || {}, content));
          break;
        case 'custom':
          // Aquí puedes agregar más estrategias personalizadas
          throw new Error('Estrategia personalizada no implementada');
        default:
          throw new Error(`Tipo de PDF no soportado: ${type}`);
      }

      return await this.context.generatePdf();
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw error;
    }
  }

  /**
   * Método de conveniencia para generar un PDF simple
   */
  async generateSimplePdf(): Promise<{ buffer: Buffer; fileName: string }> {
    return this.generatePdf('simple', {
      title: 'Reporte Simple',
      orientation: 'landscape',
    });
  }
}
