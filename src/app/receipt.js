import React from 'react';
import './receip.css';

const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="receipt-modal">
      <div className="receipt-content">
        <h2>Receipt</h2>
        <p>Date: {receipt.date}</p>
        <p>Customer Number: {receipt.customerNumber}</p>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Item Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Total: {receipt.total}</p>
        <p>Cash Tendered: {receipt.cashTendered}</p>
        <p>Change: {receipt.change}</p>
        <button onClick={onClose}>Close</button>
        <button onClick={printReceipt}>Print</button>
      </div>
    </div>
  );
};

export default ReceiptModal;