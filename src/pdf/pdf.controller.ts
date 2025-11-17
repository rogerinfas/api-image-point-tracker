import { Controller, Get, Res, Query, Header } from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('generate')
  @Header('Content-Type', 'application/pdf')
  async generatePdf(
    @Res() res: Response,
    @Query('type') type?: string,
  ) {
    try {
      const { buffer, fileName } = await this.pdfService.generatePdf(
        type as any || 'simple'
      );
      
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      res.status(500).json({
        statusCode: 500,
        message: 'Error al generar el PDF',
        error: error.message,
      });
    }
  }

  @Get('simple')
  @Header('Content-Type', 'application/pdf')
  async generateSimplePdf(@Res() res: Response) {
    try {
      const { buffer, fileName } = await this.pdfService.generateSimplePdf();
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error al generar el PDF simple:', error);
      res.status(500).json({
        statusCode: 500,
        message: 'Error al generar el PDF simple',
        error: error.message,
      });
    }
  }
}
