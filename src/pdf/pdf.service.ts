import { Injectable } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable()
export class PdfService {
  constructor() {
    // Configurar las fuentes para pdfmake
    (pdfMake as any).vfs = pdfFonts.vfs;
  }
  async generateSimplePdf(): Promise<Buffer> {
    // Definir el documento
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Reporte PDF', style: 'header' },
        'Este es un ejemplo de generación de PDF con pdfmake.',
        {
          text: 'Características:',
          style: 'subheader',
          margin: [0, 15, 0, 5]
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
          text: 'Fecha de generación: ' + new Date().toLocaleString(),
          margin: [0, 15, 0, 0],
          fontSize: 10,
          alignment: 'right'
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center'
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        }
      },
      defaultStyle: {
        fontSize: 12
      }
    };

    // Crear el PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    
    // Convertir a buffer
    return new Promise((resolve, reject) => {
      pdfDoc.getBuffer((buffer: Buffer) => {
        resolve(buffer);
      });
    });
  }
}
