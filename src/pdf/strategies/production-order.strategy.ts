import { IPdfOptions } from '../interfaces/pdf-strategy.interface';
import { BasePdfStrategy } from './base-pdf.strategy';
import { TDocumentDefinitions, Alignment } from 'pdfmake/interfaces';

export interface ProductionOrderData {
  orderNumber: string;
  startDate: string;
  deliveryDate: string;
  client: string;
  company: string;
  sizes: { size: string; quantity: number }[];
  totalQuantity: number;
  imagePath?: string;
}

export class ProductionOrderStrategy extends BasePdfStrategy {
  private orderData: ProductionOrderData;

  constructor(orderData: ProductionOrderData, options?: IPdfOptions) {
    super({
      orientation: 'landscape',
      pageSize: 'A4',
      ...options,
    });
    this.orderData = orderData;
  }

  generateDefinition(): TDocumentDefinitions {
    return {
      ...this.getBaseDefinition(),
      content: [
        // Cabecera principal
        {
          text: 'ORDEN DE PRODUCCIÓN',
          style: 'mainHeader',
          margin: [0, 0, 0, 5] as [number, number, number, number]
        },
        {
          text: `OP: ${this.orderData.orderNumber}`,
          style: 'orderNumber',
          margin: [0, 0, 0, 20] as [number, number, number, number]
        },
        
        // Subcabecera con datos
        {
          table: {
            body: [
              [
                { text: 'Fecha de Inicio:', style: 'label' },
                { text: this.orderData.startDate, style: 'value' },
                { text: 'Fecha de Entrega:', style: 'label' },
                { text: this.orderData.deliveryDate, style: 'value' }
              ],
              [
                { text: 'Cliente:', style: 'label' },
                { text: this.orderData.client, style: 'value' },
                { text: 'Empresa:', style: 'label' },
                { text: this.orderData.company, style: 'value' }
              ]
            ],
            widths: ['auto', '*', 'auto', '*']
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 20] as [number, number, number, number]
        },
        
        // Sección dividida en dos columnas
        {
          columns: [
            // Columna izquierda: Tabla de tallas
            {
              width: '30%',
              stack: [
                {
                  text: 'CANTIDADES POR TALLA',
                  style: 'tableHeader',
                  margin: [0, 0, 0, 10] as [number, number, number, number]
                },
                {
                  table: {
                    body: [
                      // Encabezado de la tabla
                      [
                        { text: 'Talla', style: 'tableHeaderCell' },
                        { text: 'Cantidad', style: 'tableHeaderCell' }
                      ],
                      // Filas de datos
                      ...this.orderData.sizes.map(size => [
                        { text: size.size, style: 'tableCell' },
                        { text: size.quantity.toString(), style: 'tableCell' }
                      ]),
                      // Fila de total
                      [
                        { text: 'TOTAL', style: 'tableTotalLabel' },
                        { text: this.orderData.totalQuantity.toString(), style: 'tableTotalValue' }
                      ]
                    ],
                    widths: ['*', '*']
                  },
                  layout: {
                    hLineWidth: (i: number) => i === 0 || i === 1 ? 1 : 0.5,
                    vLineWidth: () => 1,
                    hLineColor: () => '#000000',
                    vLineColor: () => '#000000',
                    fillColor: () => '#ffffff'
                  }
                }
              ]
            },
            // Columna derecha: Espacio para imagen (temporalmente vacío)
            {
              width: '70%',
              stack: [
                {
                  text: '[Espacio reservado para imagen]',
                  style: 'imagePlaceholder',
                  alignment: 'center',
                  margin: [20, 50, 0, 50] as [number, number, number, number]
                }
              ]
            }
          ],
          margin: [0, 0, 0, 20] as [number, number, number, number]
        },
        
        // Pie de página
        {
          text: 'WorkWear Industries',
          style: 'footer',
          alignment: 'center',
          margin: [0, 30, 0, 0] as [number, number, number, number]
        },
        {
          text: new Date().getFullYear().toString(),
          style: 'footerYear',
          alignment: 'center'
        }
      ],
      styles: this.getCustomStyles()
    };
  }

  protected getCustomStyles() {
    return {
      ...this.getDefaultStyles(),
      mainHeader: {
        fontSize: 20,
        bold: true,
        alignment: 'center' as const,
        margin: [0, 0, 0, 5] as [number, number, number, number]
      },
      orderNumber: {
        fontSize: 16,
        bold: true,
        alignment: 'center' as const,
        margin: [0, 0, 0, 20] as [number, number, number, number]
      },
      label: {
        fontSize: 11,
        bold: true,
        margin: [0, 2, 0, 2] as [number, number, number, number]
      },
      value: {
        fontSize: 11,
        margin: [0, 2, 0, 2] as [number, number, number, number]
      },
      tableHeader: {
        fontSize: 12,
        bold: true,
        alignment: 'center' as const
      },
      tableHeaderCell: {
        fontSize: 10,
        bold: true,
        alignment: 'center' as const,
        fillColor: '#f0f0f0'
      },
      tableCell: {
        fontSize: 10,
        alignment: 'center' as const
      },
      tableTotalLabel: {
        fontSize: 10,
        bold: true,
        alignment: 'center' as const,
        fillColor: '#e0e0e0'
      },
      tableTotalValue: {
        fontSize: 10,
        bold: true,
        alignment: 'center' as const,
        fillColor: '#e0e0e0'
      },
      footer: {
        fontSize: 12,
        bold: true,
        margin: [0, 30, 0, 5] as [number, number, number, number]
      },
      footerYear: {
        fontSize: 11,
        alignment: 'center' as const,
        margin: [0, 0, 0, 0] as [number, number, number, number]
      },
      imagePlaceholder: {
        fontSize: 14,
        italics: true,
        color: '#888888',
        alignment: 'center' as const
      }
    };
  }

  getFileName(): string {
    return `orden-produccion-${this.orderData.orderNumber}.pdf`;
  }
}
