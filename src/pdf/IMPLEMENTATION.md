# PDF Generation Implementation

## Overview
This implementation provides a scalable PDF generation system using the Strategy pattern with pdfmake library.

## Architecture

### Strategy Pattern Implementation
- **IPdfStrategy**: Interface defining the contract for PDF generation strategies
- **BasePdfStrategy**: Abstract base class providing common functionality and default styles
- **SimplePdfStrategy**: Concrete strategy for basic PDF generation
- **ProductionOrderStrategy**: Specialized strategy for production order PDFs with complex layout

### Core Components

#### 1. PdfContext
- Manages pdfmake initialization
- Executes strategies to generate PDF buffers
- Handles strategy switching dynamically

#### 2. PdfService
- Service layer providing high-level API
- Supports multiple PDF types through strategy pattern
- Methods:
  - `generatePdf(type, options)`: Generic PDF generation
  - `generateSimplePdf()`: Convenience method for simple PDFs
  - `generateProductionOrder(orderData)`: Specialized method for production orders

#### 3. PdfController
- REST API endpoints:
  - `GET /pdf/simple`: Generate simple PDF
  - `GET /pdf/generate?type=simple`: Generic PDF generation with type selection
  - `POST /pdf/production-order`: Generate production order PDF

## Production Order PDF Features

### Layout Structure
1. **Header Section**
   - Main title: "ORDEN DE PRODUCCIÓN"
   - Order number: "OP: {orderNumber}"

2. **Subheader Section**
   - Start date: "Fecha de Inicio: {startDate}"
   - Delivery date: "Fecha de Entrega: {deliveryDate}"
   - Client: "Cliente: {client}"
   - Company: "Empresa: {company}"

3. **Two-Column Layout**
   - **Left Column (30% width)**: Size/quantity table
     - Header: "CANTIDADES POR TALLA"
     - Size rows with quantities
     - Total row with sum
   - **Right Column (70% width)**: Reserved space for image
     - Currently shows placeholder text "[Espacio reservado para imagen]"

4. **Footer Section**
   - Company name: "WorkWear Industries"
   - Current year

### Technical Specifications
- **Orientation**: Landscape
- **Page Size**: A4
- **Styling**: Custom styles for headers, tables, and placeholders
- **Margins**: Proper spacing for professional appearance

## API Usage

### Production Order Endpoint
```http
POST /pdf/production-order
Content-Type: application/json

{
  "orderNumber": "WWI-001-2025",
  "startDate": "2025-01-15",
  "deliveryDate": "2025-02-15",
  "client": "Cliente Ejemplo S.A.",
  "company": "WorkWear Industries",
  "sizes": [
    {"size": "XS", "quantity": 50},
    {"size": "S", "quantity": 100},
    {"size": "M", "quantity": 150},
    {"size": "L", "quantity": 120},
    {"size": "XL", "quantity": 80},
    {"size": "XXL", "quantity": 30}
  ],
  "totalQuantity": 530,
  "imagePath": "/path/to/image.png" // Optional
}
```

### Response
- **Content-Type**: application/pdf
- **Content-Disposition**: attachment; filename="orden-produccion-{orderNumber}.pdf"
- **Body**: PDF binary data

## File Structure
```
src/pdf/
├── interfaces/
│   └── pdf-strategy.interface.ts    # Strategy interface and options
├── strategies/
│   ├── base-pdf.strategy.ts          # Abstract base strategy
│   ├── simple-pdf.strategy.ts        # Simple PDF strategy
│   └── production-order.strategy.ts  # Production order strategy
├── contexts/
│   └── pdf.context.ts               # Strategy context manager
├── pdf.service.ts                   # Service layer
├── pdf.controller.ts                # REST API controller
├── pdf.module.ts                    # NestJS module
└── README.md                        # Module documentation
```

## Extensibility

### Adding New PDF Types
1. Create new strategy class extending `BasePdfStrategy`
2. Implement required methods:
   - `generateDefinition()`: Define PDF structure
   - `getFileName()`: Return filename
   - `getCustomStyles()`: Define custom styles (optional)
3. Update `PdfService.generatePdf()` method to handle new type
4. Add controller endpoint if needed

### Customization Points
- **Styles**: Override `getCustomStyles()` in strategy
- **Layout**: Modify `generateDefinition()` content structure
- **Options**: Extend `IPdfOptions` interface for new parameters

## Dependencies
- **pdfmake**: PDF generation library
- **@types/pdfmake**: TypeScript definitions
- **NestJS**: Framework for service and controller structure

## Build Status
✅ Build successful with no TypeScript errors
✅ All linting issues resolved
✅ Production order endpoint implemented and functional
