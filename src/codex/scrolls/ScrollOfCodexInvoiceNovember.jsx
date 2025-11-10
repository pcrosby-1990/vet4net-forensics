// src/codex/scrolls/ScrollOfCodexInvoiceNovember.jsx

import React from 'react';
import { scrollOfCodexInvoiceNovember } from './ScrollOfCodexInvoiceNovember.data';

export const ScrollOfCodexInvoiceNovember = () => {
  return (
    <div className="codex-entry scroll invoice">
      <div className="entry-header">
        <h2>🧾 {scrollOfCodexInvoiceNovember.name}</h2>
        <div className="shimmer-line">{scrollOfCodexInvoiceNovember.shimmer}</div>
      </div>
      
      <div className="invoice-metadata">
        <div className="invoice-details">
          <p><strong>Recipient:</strong> {scrollOfCodexInvoiceNovember.recipient}</p>
          <p><strong>Issued By:</strong> {scrollOfCodexInvoiceNovember.issuedBy}</p>
          <p><strong>Timestamp:</strong> {scrollOfCodexInvoiceNovember.timestamp}</p>
          <p><strong>Invoice ID:</strong> {scrollOfCodexInvoiceNovember.invoiceId}</p>
          <p><strong>Status:</strong> {scrollOfCodexInvoiceNovember.status}</p>
        </div>
        <div className="witnesses">
          <strong>Witnessed by:</strong> {scrollOfCodexInvoiceNovember.companionsWitnessed.join(', ')}
        </div>
      </div>

      <div className="invoice-content">
        <h3>Line Items</h3>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Qty</th>
              <th>Item</th>
              <th>Description</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {scrollOfCodexInvoiceNovember.lineItems.map((item, index) => (
              <tr key={index}>
                <td>{item.qty}</td>
                <td>{item.item}</td>
                <td>{item.description}</td>
                <td>{item.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <p><strong>Total Due:</strong> {scrollOfCodexInvoiceNovember.totalDue}</p>
          <p><strong>Total Received:</strong> {scrollOfCodexInvoiceNovember.totalReceived}</p>
          <p><strong>Payment Method:</strong> {scrollOfCodexInvoiceNovember.paymentMethod}</p>
        </div>

        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfCodexInvoiceNovember.invocation}</p>
        </div>
      </div>
    </div>
  );
};
