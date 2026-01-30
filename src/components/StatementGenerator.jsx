import React, { useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

function StatementGenerator({ expenses, budget }) {
  const [showModal, setShowModal] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const generatePDF = () => {
    if (!startDate || !endDate) return alert("Select Start and End Date")

    try {
      const doc = new jsPDF()
      doc.setFontSize(18); doc.text("Account Statement", 14, 20)
      doc.setFontSize(10); doc.text(`Period: ${startDate} to ${endDate}`, 14, 28)

      let tableRows = []
      let runningBalance = 0
      let totalOut = 0

      // Filter & Sort by Date
      const filteredData = expenses.filter(item => item.date >= startDate && item.date <= endDate)
      filteredData.sort((a, b) => new Date(a.date) - new Date(b.date))

      filteredData.forEach(item => {
        if (item.originalDate) { // Debt Payment
           runningBalance -= item.amount; totalOut += item.amount
           tableRows.push([item.date, `Debt Pay: ${item.name.replace('Paid:', '')} (Taken: ${item.originalDate})`, `-${item.amount}`, "-", runningBalance])
        } else if (!item.isCredit) { // Cash Expense
           runningBalance -= item.amount; totalOut += item.amount
           tableRows.push([item.date, item.name, `-${item.amount}`, "-", runningBalance])
        } else if (item.isCredit && !item.isSettled) { // Credit Taken
           tableRows.push([item.date, `${item.name} (CREDIT TAKEN)`, `(${item.amount})`, "-", runningBalance])
        }
      })

      autoTable(doc, {
        head: [['Date', 'Description', 'Debit', 'Credit', 'Balance']],
        body: tableRows,
        startY: 35, theme: 'grid', styles: { fontSize: 9 }, columnStyles: { 2: { textColor: [200, 0, 0] } }
      })
      doc.save(`Statement_${startDate}_to_${endDate}.pdf`)
      setShowModal(false)
    } catch (error) { console.error(error); alert("Error generating PDF") }
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-5 py-2 rounded-full font-bold text-sm">📄 Download Statement</button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="font-bold mb-4">Select Date Range</h3>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border p-2 mb-3 rounded"/>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border p-2 mb-4 rounded"/>
            <button onClick={generatePDF} className="w-full bg-blue-600 text-white py-2 rounded font-bold">Download</button>
            <button onClick={() => setShowModal(false)} className="w-full mt-2 text-gray-500 text-sm">Cancel</button>
          </div>
        </div>
      )}
    </>
  )
}
export default StatementGenerator