import { Controller, Get, Res, Header } from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('generate')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=reporte.pdf')
  async generatePdf(@Res() res: Response) {
    try {
      const pdfBuffer = await this.pdfService.generateSimplePdf();
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      res.status(500).json({
        statusCode: 500,
        message: 'Error al generar el PDF',
        error: error.message,
      });
    }
  }
}
