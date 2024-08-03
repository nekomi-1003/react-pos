import React, { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import axios from 'axios';
import ReceiptModal from './receipt';
import './pos.css';

const POS = ({ user, transactions, setTransactions }) => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cashTendered, setCashTendered] = useState(0);
  const [change, setChange] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerNumber, setCustomerNumber] = useState(1);
  const [receipt, setReceipt] = useState(null); // Receipt state
  const [heldTransaction, setHeldTransaction] = useState(null); // State to hold transaction

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost/mini/data.php');
        const data = await response.data; // Assuming `response.data` is already in JSON format
        setProducts(
          Object.entries(data.products).map(([barcode, { name, price }]) => ({
            barcode,
            name,
            price,
            amount: price
          }))
        );
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addItem = (item) => {
    const existingItemIndex = items.findIndex(i => i.barcode === item.barcode);
    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].qty += quantity;
      newItems[existingItemIndex].amount = newItems[existingItemIndex].price * newItems[existingItemIndex].qty;
      setItems(newItems);
    } else {
      setItems([...items, { ...item, qty: quantity, amount: item.price * quantity }]);
    }
    setBarcode('');
    setQuantity(1);
  };

  const handleBarcodeInput = () => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      console.log('Product found:', product); // Debugging line
      addItem(product);
    } else {
      alert('Invalid barcode');
    }
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const cancelTransaction = () => {
    if (items.length > 0) {
      const total = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
      const receiptData = {
        date: new Date().toLocaleString(),
        customerNumber,
        items,
        total,
        cashTendered,
        change
      };
      setReceipt(receiptData); // Set receipt data
      setTransactions([...transactions, receiptData]);
      setCustomerNumber(prev => prev + 1); // Increment customer number
    }
    setItems([]);
    setCashTendered(0);
    setChange(0);
  };

  const handleCashChange = (amount) => {
    setCashTendered(amount);
    const total = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    setChange(amount - total);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const holdTransaction = () => {
    if (items.length > 0) {
      setHeldTransaction({ items, cashTendered, change }); // Save the current transaction
      setItems([]); // Clear current transaction items
      setCashTendered(0); // Reset cash tendered
      setChange(0); // Reset change
    }
  };

  const resumeHeldTransaction = () => {
    if (heldTransaction) {
      setItems(heldTransaction.items); // Restore held transaction items
      setCashTendered(heldTransaction.cashTendered); // Restore cash tendered
      setChange(heldTransaction.change); // Restore change
      setHeldTransaction(null); // Clear held transaction
    }
  };

  useHotkeys('b', handleBarcodeInput);
  useHotkeys('d', () => removeItem(items.length - 1)); // Example shortcut for removing last item
  useHotkeys('shift', cancelTransaction); // Complete transaction with Shift key
  useHotkeys('s', () => setShowReport(prev => !prev)); // Toggle sales report visibility with 's' key
  useHotkeys('h', holdTransaction); // Hold transaction with 'h' key
  useHotkeys('j', resumeHeldTransaction); // Resume held transaction with 'j' key
  useHotkeys('p', () => receipt && setReceipt(receipt)); // Print receipt with Ctrl + P (Windows) or Cmd + P (Mac)

  return (
    <div className="pos-system">
      <div className="header">
        <div className="header-left">Welcome, {user.fullname}</div>
        <div className="header-right">Customer No: {customerNumber}</div>
      </div>
      <div className="main">
        <div className="sales-table">
          <div className="card">
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
                {items.map((item, index) => (
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
          </div>
        </div>
        <div className="barcode-input">
          <label>
            Barcode:
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleBarcodeInput();
                }
              }}
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>
          <label>
            Cash Tendered:
            <input
              type="number"
              value={cashTendered}
              onChange={(e) => handleCashChange(Number(e.target.value))}
            />
          </label>
          <div>Change: {change}</div>
        </div>
      </div>
      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </div>
  );
};

export default POS;