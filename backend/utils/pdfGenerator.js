import htmlPdf from "html-pdf-node";

export const generateInvoicePDF = async (order) => {
  try {
    // Format tanggal
    const formatDate = (date) => {
      try {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (error) {
        return "N/A";
      }
    };

    // Format currency
    const formatCurrency = (amount) => {
      try {
        const num = parseFloat(amount || 0);
        return `$${num.toFixed(2)}`;
      } catch (error) {
        return "$0.00";
      }
    };

    // Safely escape HTML
    const escapeHtml = (text) => {
      if (!text) return "";
      return text
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Generate items HTML safely
    const generateItemsHTML = () => {
      if (!order.orderItems || order.orderItems.length === 0) {
        return '<tr><td colspan="4" style="text-align: center;">No items found</td></tr>';
      }

      return order.orderItems
        .map((item) => {
          const qty = parseInt(item.qty || 0);
          const price = parseFloat(item.price || 0);
          const total = qty * price;

          return `
          <tr>
            <td>${escapeHtml(item.name || "Unknown Product")}</td>
            <td style="text-align: center;">${qty}</td>
            <td style="text-align: right;">${formatCurrency(price)}</td>
            <td style="text-align: right;">${formatCurrency(total)}</td>
          </tr>
        `;
        })
        .join("");
    };

    // HTML template for invoice
    const invoiceHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${escapeHtml(order._id || "N/A")}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            border-bottom: 3px solid #ec4899;
            padding-bottom: 20px;
            margin-bottom: 30px;
            overflow: hidden;
        }
        .company {
            float: left;
            width: 50%;
        }
        .company h1 {
            color: #ec4899;
            margin: 0 0 10px 0;
            font-size: 32px;
        }
        .company p {
            margin: 3px 0;
            color: #666;
            font-size: 14px;
        }
        .invoice-info {
            float: right;
            width: 45%;
            text-align: right;
        }
        .invoice-info h2 {
            color: #ec4899;
            margin: 0 0 15px 0;
            font-size: 28px;
        }
        .invoice-info p {
            margin: 8px 0;
            font-size: 14px;
        }
        .status {
            display: inline-block;
            padding: 6px 15px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 8px;
        }
        .paid {
            background-color: #10b981;
            color: white;
        }
        .pending {
            background-color: #f59e0b;
            color: white;
        }
        .clear {
            clear: both;
        }
        .billing {
            margin: 30px 0;
            overflow: hidden;
        }
        .billing-left {
            float: left;
            width: 48%;
        }
        .billing-right {
            float: right;
            width: 48%;
        }
        .billing h3 {
            color: #ec4899;
            margin: 0 0 15px 0;
            border-bottom: 2px solid #ec4899;
            padding-bottom: 8px;
            font-size: 16px;
        }
        .billing p {
            margin: 5px 0;
            font-size: 14px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        .items-table th {
            background-color: #ec4899;
            color: white;
            padding: 15px 10px;
            text-align: left;
            border: 1px solid #ddd;
            font-weight: bold;
            font-size: 14px;
        }
        .items-table td {
            padding: 12px 10px;
            border: 1px solid #ddd;
            font-size: 14px;
        }
        .items-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .totals {
            float: right;
            width: 320px;
            margin-top: 30px;
        }
        .totals table {
            width: 100%;
            border-collapse: collapse;
        }
        .totals td {
            padding: 10px 15px;
            border: 1px solid #ddd;
            font-size: 14px;
        }
        .total-row {
            background-color: #ec4899;
            color: white;
            font-weight: bold;
            font-size: 16px;
        }
        .payment-info {
            margin-top: 40px;
            padding: 20px;
            background-color: #f0fdf4;
            border: 2px solid #10b981;
            border-radius: 8px;
            clear: both;
        }
        .payment-info p {
            margin: 8px 0;
            color: #059669;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #ddd;
            color: #666;
            clear: both;
        }
        .footer p {
            margin: 8px 0;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company">
            <h1>MERN E-Commerce</h1>
            <p>123 Commerce Street</p>
            <p>Digital City, DC 12345</p>
            <p>Email: support@mernecommerce.com</p>
            <p>Phone: (555) 123-4567</p>
        </div>
        <div class="invoice-info">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${escapeHtml(order._id || "N/A")}</p>
            <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
            <p><strong>Status:</strong><br>
                <span class="status ${order.isPaid ? "paid" : "pending"}">
                    ${order.isPaid ? "PAID" : "PENDING"}
                </span>
            </p>
        </div>
        <div class="clear"></div>
    </div>

    <div class="billing">
        <div class="billing-left">
            <h3>Bill To:</h3>
            <p><strong>${escapeHtml(
              order.user?.username || "Unknown User"
            )}</strong></p>
            <p>${escapeHtml(order.user?.email || "No email")}</p>
        </div>
        <div class="billing-right">
            <h3>Ship To:</h3>
            <p>${escapeHtml(order.shippingAddress?.address || "No address")}</p>
            <p>${escapeHtml(order.shippingAddress?.city || "")}, ${escapeHtml(
      order.shippingAddress?.postalCode || ""
    )}</p>
            <p>${escapeHtml(order.shippingAddress?.country || "")}</p>
        </div>
        <div class="clear"></div>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            ${generateItemsHTML()}
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td><strong>Subtotal:</strong></td>
                <td style="text-align: right;"><strong>${formatCurrency(
                  order.itemsPrice
                )}</strong></td>
            </tr>
            <tr>
                <td><strong>Shipping:</strong></td>
                <td style="text-align: right;"><strong>${formatCurrency(
                  order.shippingPrice
                )}</strong></td>
            </tr>
            <tr>
                <td><strong>Tax:</strong></td>
                <td style="text-align: right;"><strong>${formatCurrency(
                  order.taxPrice
                )}</strong></td>
            </tr>
            <tr class="total-row">
                <td><strong>TOTAL:</strong></td>
                <td style="text-align: right;"><strong>${formatCurrency(
                  order.totalPrice
                )}</strong></td>
            </tr>
        </table>
    </div>
    <div class="clear"></div>

    ${
      order.isPaid
        ? `
    <div class="payment-info">
        <p><strong>✅ Payment Information:</strong></p>
        <p><strong>Paid on:</strong> ${formatDate(order.paidAt)}</p>
        <p><strong>Payment Method:</strong> ${escapeHtml(
          order.paymentMethod || "Unknown"
        )}</p>
        <p><strong>Transaction Status:</strong> Completed</p>
    </div>
    `
        : ""
    }

    <div class="footer">
        <p><strong>Thank you for your business!</strong></p>
        <p>For any questions regarding this invoice, please contact us at:</p>
        <p><strong>support@mernecommerce.com</strong> | <strong>(555) 123-4567</strong></p>
        <p style="margin-top: 20px; font-size: 11px; color: #999;">
            This invoice was generated electronically and is valid without signature.
        </p>
    </div>
</body>
</html>`;

    // PDF options
    const options = {
      format: "A4",
      border: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      type: "pdf",
      quality: "75",
      zoomFactor: "1",
      timeout: 30000,
    };

    // Generate PDF
    console.log("Generating PDF with html-pdf-node...");
    const file = { content: invoiceHTML };
    const pdfBuffer = await htmlPdf.generatePdf(file, options);

    console.log("PDF generated successfully, size:", pdfBuffer.length, "bytes");
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};
