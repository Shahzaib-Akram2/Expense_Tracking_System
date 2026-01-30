import React, { useState } from 'react'

function DebtHistory({ expenses, onClose }) {
  // ✅ 1. NEW STATE: Filter ke liye
  const [showPendingOnly, setShowPendingOnly] = useState(false)

  // ✅ 2. UPDATED FILTER LOGIC
  const historyItems = expenses.filter(item => {
    // Sirf Credit hone chahiye
    if (!item.isCredit) return false
    
    // Agar "Show Pending Only" ON hai, to jo Paid hain unhe mat dikhao
    if (showPendingOnly && item.isSettled) return false
    
    return true
  })

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown"
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-down flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl bg-white/20 w-10 h-10 flex items-center justify-center rounded-lg">📜</span>
            <div>
              <h2 className="text-xl font-bold text-white">Debt Register</h2>
              <p className="text-indigo-100 text-sm">Track loans and lender details</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* ✅ 3. NEW PENDING ONLY BUTTON / CHECKBOX */}
            <label className="flex items-center gap-2 bg-indigo-700 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-indigo-800 transition border border-indigo-500 shadow-sm select-none">
              <input 
                type="checkbox" 
                checked={showPendingOnly} 
                onChange={(e) => setShowPendingOnly(e.target.checked)}
                className="w-4 h-4 accent-white cursor-pointer"
              />
              <span className="text-white text-sm font-bold">Show Pending Only</span>
            </label>

            <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition">✕</button>
          </div>
        </div>

        {/* Table List */}
        <div className="p-0 overflow-auto custom-scrollbar flex-1">
          {historyItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">
                {showPendingOnly ? "No pending debts! 🎉" : "No debt history found."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                  <th className="py-4 px-6">Expense / Item</th>
                  <th className="py-4 px-6 text-indigo-600">👤 Lender</th>
                  <th className="py-4 px-6">Date Taken</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition duration-150">
                    <td className="py-4 px-6 font-semibold text-slate-700">{item.name.replace('(Credit Part)', '')}</td>
                    
                    {/* Lender Data */}
                    <td className="py-4 px-6">
                      {item.lender ? (
                        <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-100 text-sm font-semibold">
                          {item.lender}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Self/Unknown</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-sm text-slate-500">{formatDate(item.date || item.originalDate)}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">${item.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      {item.isSettled ? (
                        <div className="flex flex-col">
                          <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">✅ Paid</span>
                          <span className="text-[10px] text-slate-400">on {formatDate(item.paidDate)}</span>
                        </div>
                      ) : (
                        <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-100">⏳ Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Footer Summary */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center shrink-0">
           <span className="text-xs text-slate-500">
             {showPendingOnly ? "Showing: Pending Debts Only" : "Showing: All History"}
           </span>
           <div className="text-right">
             <span className="text-xs text-slate-500 mr-2">Total Pending:</span>
             <span className="text-xl font-bold text-red-600">
               ${expenses.filter(i => i.isCredit && !i.isSettled).reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
             </span>
           </div>
        </div>
      </div>
    </div>
  )
}

export default DebtHistory