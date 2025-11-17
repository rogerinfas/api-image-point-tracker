# Módulo de Generación de PDF

Este módulo proporciona una solución escalable para la generación de PDFs utilizando el patrón Strategy. Está construido con TypeScript y utiliza la biblioteca `pdfmake` para la generación de documentos.

## Características

- Generación de PDFs con diferentes diseños y formatos
- Arquitectura basada en estrategias para fácil extensión
- Soporte para personalización de estilos y contenido
- Tipado fuerte con TypeScript
- Manejo de errores integrado

## Estructura del Módulo

```
src/pdf/
├── contexts/               # Contextos para manejar las estrategias
│   └── pdf.context.ts      # Contexto principal de PDF
├── interfaces/             # Interfaces y tipos
│   └── pdf-strategy.interface.ts
├── strategies/             # Estrategias de generación de PDF
│   ├── base-pdf.strategy.ts  # Clase base para estrategias
│   └── simple-pdf.strategy.ts # Estrategia de ejemplo
├── pdf.controller.ts       # Controlador de la API
├── pdf.module.ts           # Módulo de NestJS
└── pdf.service.ts          # Servicio principal
```

## Uso Básico

### Generar un PDF Simple

```typescript
// En un controlador o servicio
const { buffer, fileName } = await this.pdfService.generateSimplePdf();
```

### Generar un PDF con Opciones Personalizadas

```typescript
const options = {
  title: 'Mi Reporte',
  orientation: 'landscape',
  pageSize: 'A4',
  styles: {
    header: {
      fontSize: 22,
      bold: true,
      color: '#2c3e50'
    }
  }
};

const content = [
  { text: 'Título Personalizado', style: 'header' },
  'Contenido personalizado aquí...',
  {
    table: {
      headerRows: 1,
      body: [
        ['Nombre', 'Edad', 'Ciudad'],
        ['Juan', '30', 'Madrid'],
        ['Ana', '25', 'Barcelona']
      ]
    }
  }
];

const { buffer, fileName } = await this.pdfService.generatePdf(
  'simple',
  options,
  content
);
```

## Endpoints de la API

### Generar PDF Simple
```
GET /pdf/simple
```

### Generar PDF con Opciones
```
GET /pdf/generate?type=simple
```

## Crear una Nueva Estrategia

1. Crea una nueva clase que extienda `BasePdfStrategy`:

```typescript
// invoice-pdf.strategy.ts
import { BasePdfStrategy } from './base-pdf.strategy';

export class InvoicePdfStrategy extends BasePdfStrategy {
  constructor(
    private readonly invoiceData: any,
    options?: IPdfOptions
  ) {
    super(options);
  }

  generateDefinition(): TDocumentDefinitions {
    return {
      ...this.getBaseDefinition(),
      content: [
        { text: `Factura #${this.invoiceData.id}`, style: 'header' },
        // Más contenido de la factura...
      ]
    };
  }

  getFileName(): string {
    return `factura-${this.invoiceData.id}.pdf`;
  }
}
```

2. Registra la nueva estrategia en el `PdfService`:

```typescript
// En pdf.service.ts
import { InvoicePdfStrategy } from './strategies/invoice-pdf.strategy';

// Dentro de la clase PdfService
async generateInvoicePdf(invoiceData: any): Promise<{ buffer: Buffer; fileName: string }> {
  const strategy = new InvoicePdfStrategy(invoiceData, {
    title: `Factura ${invoiceData.id}`,
    orientation: 'portrait'
  });
  
  this.context.setStrategy(strategy);
  return this.context.generatePdf();
}
```

## Personalización

### Estilos Personalizados
Puedes personalizar los estilos sobrescribiendo el método `getDefaultStyles()` en tu estrategia:

```typescript
protected getDefaultStyles() {
  const baseStyles = super.getDefaultStyles();
  
  return {
    ...baseStyles,
    invoiceHeader: {
      fontSize: 24,
      bold: true,
      color: '#2c3e50',
      margin: [0, 0, 0, 20] as [number, number, number, number]
    },
    // Más estilos personalizados...
  };
}
```

### Manejo de Errores
El servicio incluye manejo de errores básico. Puedes capturar y manejar errores específicos:

```typescript
try {
  const { buffer, fileName } = await this.pdfService.generatePdf('simple');
  // Procesar el PDF generado
} catch (error) {
  if (error.message.includes('no implementada')) {
    // Manejar error de estrategia no implementada
  } else if (error.message.includes('no soportado')) {
    // Manejar tipo de PDF no soportado
  } else {
    // Otros errores
  }
}
```

## Consideraciones de Rendimiento

- Para documentos grandes, considera implementar streaming
- Los estilos complejos pueden afectar el rendimiento
- El caché de estrategias puede mejorar el rendimiento en casos de uso intensivo
