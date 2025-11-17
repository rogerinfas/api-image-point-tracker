import { IPdfStrategy, IPdfOptions } from '../interfaces/pdf-strategy.interface';
import { TDocumentDefinitions, PageSize, Alignment } from 'pdfmake/interfaces';

export abstract class BasePdfStrategy implements IPdfStrategy {
  protected options: IPdfOptions;

  constructor(options: IPdfOptions) {
    this.options = {
      orientation: 'portrait',
      pageSize: 'A4',
      ...options,
    };
  }

  protected getBaseDefinition(): Partial<TDocumentDefinitions> {
    return {
      pageOrientation: this.options.orientation,
      pageSize: this.options.pageSize as PageSize,
      styles: this.getDefaultStyles(),
      defaultStyle: {
        fontSize: 12,
        ...this.options.defaultStyle,
      },
    };
  }

  protected getDefaultStyles() {
    const baseStyles = {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10] as [number, number, number, number],
        alignment: 'center' as const,
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5] as [number, number, number, number],
      },
    };

    // Apply any custom styles, ensuring margins are properly typed
    if (this.options.styles) {
      Object.entries(this.options.styles).forEach(([key, style]) => {
        if (style && typeof style === 'object' && 'margin' in style) {
          const margin = style.margin;
          if (Array.isArray(margin) && margin.length === 4) {
            style.margin = margin as [number, number, number, number];
          } else if (Array.isArray(margin) && margin.length === 2) {
            style.margin = margin as [number, number];
          }
        }
      });
    }

    return {
      ...baseStyles,
      ...(this.options.styles || {}),
    };
  }

  abstract generateDefinition(): TDocumentDefinitions;
  abstract getFileName(): string;
}
