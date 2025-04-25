import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import countryData from '../utils/countryData';

const InvoiceGenerator = ({ defaultCountry = 'usa' }) => {
  // State for invoice data
  const [invoiceData, setInvoiceData] = useState({
    // Sender details
    senderName: '',
    senderAddress: '',
    senderEmail: '',
    senderPhone: '',

    // Client details
    clientName: '',
    clientAddress: '',
    clientEmail: '',

    // Invoice details
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

    // Items
    items: [
      { description: '', quantity: 1, price: 0, amount: 0 }
    ],

    // Totals
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,

    // Notes
    notes: '',

    // Currency
    currency: 'USD',
    currencySymbol: '$'
  });

  // Reference to the invoice element for PDF generation
  const invoiceRef = useRef(null);

  // Initialize country-specific data
  useEffect(() => {
    if (defaultCountry && countryData[defaultCountry]) {
      const country = countryData[defaultCountry];
      setInvoiceData(prevState => ({
        ...prevState,
        currency: country.currency,
        currencySymbol: country.currencySymbol,
        taxRate: country.defaultTaxRate
      }));
    }
    
    // Load saved data from localStorage if available
    const savedSenderData = localStorage.getItem('invoiceGeneratorSenderData');
    if (savedSenderData) {
      const parsedData = JSON.parse(savedSenderData);
      setInvoiceData(prevState => ({
        ...prevState,
        senderName: parsedData.senderName || '',
        senderAddress: parsedData.senderAddress || '',
        senderEmail: parsedData.senderEmail || '',
        senderPhone: parsedData.senderPhone || ''
      }));
    }
  }, [defaultCountry]);

  // Save sender data to localStorage when it changes
  useEffect(() => {
    const senderData = {
      senderName: invoiceData.senderName,
      senderAddress: invoiceData.senderAddress,
      senderEmail: invoiceData.senderEmail,
      senderPhone: invoiceData.senderPhone
    };
    localStorage.setItem('invoiceGeneratorSenderData', JSON.stringify(senderData));
  }, [
    invoiceData.senderName,
    invoiceData.senderAddress,
    invoiceData.senderEmail,
    invoiceData.senderPhone
  ]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value
    });
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index][field] = value;

    // Calculate amount
    if (field === 'quantity' || field === 'price') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].price;
    }

    // Update items and recalculate totals
    setInvoiceData(prevState => {
      const newState = {
        ...prevState,
        items: updatedItems
      };

      // Calculate subtotal
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);

      // Calculate tax amount
      const taxAmount = subtotal * (prevState.taxRate / 100);

      // Calculate total
      const total = subtotal + taxAmount;

      return {
        ...newState,
        subtotal,
        taxAmount,
        total
      };
    });
  };

  // Add new item
  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { description: '', quantity: 1, price: 0, amount: 0 }
      ]
    });
  };

  // Remove item
  const removeItem = (index) => {
    if (invoiceData.items.length === 1) return;

    const updatedItems = invoiceData.items.filter((_, i) => i !== index);

    // Update items and recalculate totals
    setInvoiceData(prevState => {
      // Calculate subtotal
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);

      // Calculate tax amount
      const taxAmount = subtotal * (prevState.taxRate / 100);

      // Calculate total
      const total = subtotal + taxAmount;

      return {
        ...prevState,
        items: updatedItems,
        subtotal,
        taxAmount,
        total
      };
    });
  };

  // Handle tax rate change
  const handleTaxRateChange = (e) => {
    const taxRate = parseFloat(e.target.value) || 0;

    setInvoiceData(prevState => {
      // Calculate tax amount
      const taxAmount = prevState.subtotal * (taxRate / 100);

      // Calculate total
      const total = prevState.subtotal + taxAmount;

      return {
        ...prevState,
        taxRate,
        taxAmount,
        total
      };
    });
  };

  // Generate PDF
  const generatePDF = () => {
    if (!invoiceRef.current) return;

    html2canvas(invoiceRef.current, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `${invoiceData.currencySymbol}${amount.toFixed(2)}`;
  };

  // Handle country change
  const handleCountryChange = (e) => {
    const country = e.target.value;
    if (countryData[country]) {
      setInvoiceData(prevState => ({
        ...prevState,
        currency: countryData[country].currency,
        currencySymbol: countryData[country].currencySymbol,
        taxRate: countryData[country].defaultTaxRate
      }));
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Invoice Generator</h1>
        <p className="text-center text-gray-600 mb-6">Create and download professional invoices in seconds</p>

        {/* Country Selector */}
        <div className="max-w-xs mx-auto mb-6">
          <label htmlFor="country-select" className="form-label">Select Country</label>
          <select
            id="country-select"
            onChange={handleCountryChange}
            defaultValue={defaultCountry}
            className="form-input"
          >
            <option value="usa">United States</option>
            <option value="canada">Canada</option>
            <option value="australia">Australia</option>
            <option value="uk">United Kingdom</option>
            <option value="germany">Germany</option>
            <option value="singapore">Singapore</option>
          </select>
        </div>

        {/* Form and Preview Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Invoice Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Name/Business Name</label>
                    <input
                      type="text"
                      name="senderName"
                      value={invoiceData.senderName}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Address</label>
                    <textarea
                      name="senderAddress"
                      value={invoiceData.senderAddress}
                      onChange={handleInputChange}
                      rows="3"
                      className="form-input"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="senderEmail"
                        value={invoiceData.senderEmail}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        name="senderPhone"
                        value={invoiceData.senderPhone}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Client Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Client Name</label>
                    <input
                      type="text"
                      name="clientName"
                      value={invoiceData.clientName}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Client Address</label>
                    <textarea
                      name="clientAddress"
                      value={invoiceData.clientAddress}
                      onChange={handleInputChange}
                      rows="3"
                      className="form-input"
                    ></textarea>
                  </div>
                  <div>
                    <label className="form-label">Client Email</label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={invoiceData.clientEmail}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Invoice Number</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Invoice Date</label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={invoiceData.invoiceDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={invoiceData.dueDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Invoice Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
                          />
                        </td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700"
                            disabled={invoiceData.items.length === 1}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={addItem}
                  className="btn-secondary"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="mt-8 flex justify-end">
              <div className="w-full md:w-1/3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>{formatCurrency(invoiceData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tax Rate (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={invoiceData.taxRate}
                      onChange={handleTaxRateChange}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tax Amount:</span>
                    <span>{formatCurrency(invoiceData.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">{formatCurrency(invoiceData.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Notes</h2>
              <textarea
                name="notes"
                value={invoiceData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Payment terms, thank you notes, etc."
                className="form-input"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={generatePDF}
                className="btn-primary"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Preview (Hidden, used for PDF generation) */}
      <div className="hidden">
        <div ref={invoiceRef} className="bg-white p-8 max-w-4xl mx-auto">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">INVOICE</h1>
              <div className="mt-4">
                <p className="font-bold">{invoiceData.senderName}</p>
                <p className="whitespace-pre-line">{invoiceData.senderAddress}</p>
                <p>{invoiceData.senderEmail}</p>
                <p>{invoiceData.senderPhone}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-600">
                <p><span className="font-semibold">Invoice Number:</span> {invoiceData.invoiceNumber}</p>
                <p><span className="font-semibold">Date:</span> {invoiceData.invoiceDate}</p>
                <p><span className="font-semibold">Due Date:</span> {invoiceData.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Bill To:</h2>
            <div className="mt-2">
              <p className="font-bold">{invoiceData.clientName}</p>
              <p className="whitespace-pre-line">{invoiceData.clientAddress}</p>
              <p>{invoiceData.clientEmail}</p>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mt-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-1/3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>{formatCurrency(invoiceData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tax ({invoiceData.taxRate}%):</span>
                  <span>{formatCurrency(invoiceData.taxAmount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">{formatCurrency(invoiceData.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoiceData.notes && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Notes:</h2>
              <p className="whitespace-pre-line">{invoiceData.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
