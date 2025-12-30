import { CartItem } from "@/types";

interface ReceiptData {
  items: CartItem[];
  total: number;
  paymentMethod: string;
  date: Date;
  saleId?: string;
}

export const printReceipt = (data: ReceiptData) => {
  const { items, total, paymentMethod, date, saleId } = data;

  // Create a new window for printing
  const printWindow = window.open("", "_blank", "width=300,height=600");
  if (!printWindow) {
    alert("Por favor permite las ventanas emergentes para imprimir");
    return;
  }

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ticket de Venta</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 80mm;
          max-width: 80mm;
          padding: 5mm;
          background: white;
          color: black;
        }
        .header {
          text-align: center;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #000;
        }
        .header h1 {
          font-size: 16px;
          margin-bottom: 5px;
        }
        .header p {
          font-size: 10px;
        }
        .info {
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #000;
        }
        .info p {
          margin: 2px 0;
        }
        .items {
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #000;
        }
        .item {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
        }
        .item-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item-qty {
          width: 30px;
          text-align: center;
        }
        .item-price {
          width: 60px;
          text-align: right;
        }
        .total {
          font-size: 14px;
          font-weight: bold;
          text-align: right;
          margin: 10px 0;
          padding: 10px 0;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
        }
        .footer {
          text-align: center;
          margin-top: 15px;
          font-size: 10px;
        }
        .footer p {
          margin: 3px 0;
        }
        @media print {
          body {
            width: 80mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>MI TIENDA</h1>
        <p>Punto de Venta</p>
      </div>
      
      <div class="info">
        <p><strong>Fecha:</strong> ${date.toLocaleDateString('es-MX')}</p>
        <p><strong>Hora:</strong> ${date.toLocaleTimeString('es-MX')}</p>
        ${saleId ? `<p><strong>Ticket:</strong> #${saleId.slice(-8).toUpperCase()}</p>` : ''}
        <p><strong>Pago:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
      </div>
      
      <div class="items">
        <div class="item" style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px;">
          <span class="item-name">Producto</span>
          <span class="item-qty">Qty</span>
          <span class="item-price">Precio</span>
        </div>
        ${items.map(item => `
          <div class="item">
            <span class="item-name">${item.name}</span>
            <span class="item-qty">${item.quantity}</span>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="total">
        TOTAL: $${total.toFixed(2)}
      </div>
      
      <div class="footer">
        <p>¡Gracias por su compra!</p>
        <p>Vuelva pronto</p>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() {
            window.close();
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(receiptHTML);
  printWindow.document.close();
};
