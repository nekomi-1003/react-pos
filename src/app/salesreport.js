import React from 'react';

const SalesReport = ({ transactions }) => {
  return (
    <div className="sales-report">
      <h2>Sales Report</h2>
      {transactions.length === 0 ? (
        <p>No transactions to show.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Cash Tendered</th>
              <th>Change</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date}</td>
                <td>${transaction.total.toFixed(2)}</td>
                <td>${transaction.cashTendered.toFixed(2)}</td>
                <td>${transaction.change.toFixed(2)}</td>
                <td>
                  <ul>
                    {transaction.items.map((item, i) => (
                      <li key={i}>{item.name} - {item.qty} @ ${item.price.toFixed(2)}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesReport;