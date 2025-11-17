import { TDocumentDefinitions } from 'pdfmake/interfaces';

export interface IPdfStrategy {
  generateDefinition(): TDocumentDefinitions;
  getFileName(): string;
}

export interface IPdfOptions {
  title?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: string;
  styles?: Record<string, any>;
  defaultStyle?: Record<string, any>;
}
