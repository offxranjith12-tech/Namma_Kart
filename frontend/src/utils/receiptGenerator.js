/**
 * Generates and opens a printable Tax Invoice & Receipt for DELIVERED orders.
 * Only allowed when order.status === 'DELIVERED'.
 */
export const downloadReceipt = (order) => {
  if (!order) return;

  if (order.status !== 'DELIVERED') {
    alert('Receipt download is only available after the order is delivered.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up blocked! Please allow pop-ups to download the receipt.');
    return;
  }

  const itemsHtml = order.items
    ? order.items
        .map(
          (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: 500;">${item.productName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.price}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">₹${item.subtotal}</td>
        </tr>
      `
        )
        .join('')
    : '';

  const orderDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Receipt_NK${order.id}</title>
        <style>
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 30px; 
            color: #1e293b; 
            background-color: #f8fafc; 
          }
          .receipt-box { 
            max-width: 680px; 
            margin: 0 auto; 
            padding: 36px; 
            background: #ffffff;
            border: 1px solid #e2e8f0; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            border-bottom: 2px solid #16a34a; 
            padding-bottom: 18px; 
            margin-bottom: 24px; 
          }
          .brand { 
            font-size: 26px; 
            font-weight: 800; 
            color: #16a34a; 
            letter-spacing: -0.5px;
          }
          .tagline {
            font-size: 12px;
            color: #64748b;
            margin-top: 2px;
          }
          .invoice-title { 
            font-size: 18px; 
            font-weight: 800; 
            color: #0f172a; 
            text-align: right;
          }
          .order-id {
            font-size: 14px;
            font-weight: 700;
            color: #16a34a;
            margin-top: 2px;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 24px; 
            margin-bottom: 24px; 
            font-size: 13.5px; 
            line-height: 1.5;
            background: #f8fafc;
            padding: 16px;
            border-radius: 8px;
          }
          .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 24px; 
            font-size: 14px; 
          }
          .table th { 
            background: #f1f5f9; 
            padding: 10px; 
            text-align: left; 
            border-bottom: 2px solid #cbd5e1; 
            font-weight: 700;
            color: #334155;
          }
          .totals { 
            margin-left: auto; 
            width: 280px; 
            font-size: 14px; 
          }
          .totals div { 
            display: flex; 
            justify-content: space-between; 
            padding: 6px 0; 
            color: #475569;
          }
          .totals .grand-total { 
            font-size: 18px; 
            font-weight: 800; 
            color: #16a34a; 
            border-top: 2px solid #16a34a; 
            padding-top: 10px; 
            margin-top: 6px; 
          }
          .stamp { 
            text-align: center; 
            margin-top: 32px; 
            color: #15803d; 
            font-weight: 700; 
            border: 2px dashed #86efac; 
            background: #f0fdf4;
            padding: 12px; 
            border-radius: 8px; 
            font-size: 13.5px; 
          }
          .no-print {
            text-align: right;
            margin-bottom: 20px;
          }
          .btn-print {
            background: #16a34a;
            color: #ffffff;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 700;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .btn-print:hover {
            background: #15803d;
          }
          @media print {
            .no-print { display: none; }
            body { padding: 0; background: #fff; }
            .receipt-box { border: none; box-shadow: none; max-width: 100%; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="max-width: 680px; margin: 0 auto 16px auto;">
          <button class="btn-print" onclick="window.print()">🖨️ Download / Print Receipt PDF</button>
        </div>

        <div class="receipt-box">
          <div class="header">
            <div>
              <div class="brand">🛒 Namma Kart</div>
              <div class="tagline">Official Tax Invoice & Delivery Receipt</div>
            </div>
            <div style="text-align: right;">
              <div class="invoice-title">DELIVERY RECEIPT</div>
              <div class="order-id">#NK${order.id}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Placed: ${orderDate}</div>
            </div>
          </div>

          <div class="info-grid">
            <div>
              <strong style="color: #0f172a;">Customer Info:</strong><br/>
              ${order.customerName || 'Valued Customer'}<br/>
              ${order.customerPhone ? 'Phone: ' + order.customerPhone + '<br/>' : ''}
              ${order.customerEmail ? 'Email: ' + order.customerEmail : ''}
            </div>
            <div>
              <strong style="color: #0f172a;">Delivery Address & Slot:</strong><br/>
              ${order.addressLine ? order.addressLine + ', ' : ''}${order.city || ''}<br/>
              ${order.state ? order.state + ' - ' : ''}${order.pincode || ''}<br/>
              Slot: ${order.slotName || 'Standard Delivery'} (${order.slotTime || 'Delivered'})
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div><span>Subtotal:</span> <span>₹${order.subtotal || order.totalAmount}</span></div>
            <div><span>Delivery Fee:</span> <span>${Number(order.deliveryCharge) === 0 ? 'FREE' : '₹' + order.deliveryCharge}</span></div>
            ${order.couponDiscount > 0 ? `<div><span>Coupon (${order.couponCode || ''}):</span> <span>-₹${order.couponDiscount}</span></div>` : ''}
            <div class="grand-total"><span>Total Paid:</span> <span>₹${order.totalAmount}</span></div>
          </div>

          <div class="stamp">
            ✅ ORDER DELIVERED &bull; Paid via ${order.paymentMethod || 'Online'} (${order.paymentStatus || 'PAID'})
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
