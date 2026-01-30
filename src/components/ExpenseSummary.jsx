import React from 'react'

function ExpenseSummary({ expenses, selectedMonth, onMonthChange, budget, setBudget, onPayDebt }) {
  
  const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const filteredExpenses = selectedMonth ? expenses.filter(i => i.month === selectedMonth) : expenses
  const monthlyIncome = selectedMonth ? (budget[selectedMonth] || 0) : 0

  const cashSpent = filteredExpenses.filter(i => !i.isCredit).reduce((sum, i) => sum + i.amount, 0)
  const totalCreditTaken = filteredExpenses.filter(i => i.isCredit).reduce((sum, i) => sum + i.amount, 0)
  const settledCredit = filteredExpenses.filter(i => i.isCredit && i.isSettled).reduce((sum, i) => sum + i.amount, 0)
  const currentAvailableCash = monthlyIncome - cashSpent

  // Previous Debt Logic
  let totalPastDebt = 0; let pastDebtItems = [] 
  if (selectedMonth) {
    const idx = allMonths.indexOf(selectedMonth)
    for (let i = 0; i < idx; i++) {
      const m = allMonths[i]
      expenses.filter(item => item.month === m && item.isCredit && !item.isSettled).forEach(item => {
         totalPastDebt += item.amount; pastDebtItems.push({ ...item, month: m })
      })
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      
      {/* Month Selector & Income */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Select Month</label>
          <select value={selectedMonth} onChange={e => onMonthChange(e.target.value)} 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            <option value="">-- All Year --</option>
            {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        
        {selectedMonth && (
          <div className="flex-1">
             <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Total Salary/Income</label>
             <input type="text" value={monthlyIncome || ''} onChange={e => setBudget(selectedMonth, Number(e.target.value))} 
               placeholder="0.00" 
               className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-800"
             />
          </div>
        )}
      </div>

      {selectedMonth && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <p className="text-xs uppercase font-bold text-indigo-400">Cash Spent</p>
              <p className="text-2xl font-bold text-indigo-900">PKR {cashSpent.toLocaleString()}</p>
            </div>
            
            <div className={`p-4 rounded-xl border ${currentAvailableCash < 0 ? 'bg-red-50 border-red-100 text-red-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
              <p className={`text-xs uppercase font-bold ${currentAvailableCash < 0 ? 'text-red-400' : 'text-emerald-400'}`}>Remaining Cash</p>
              <p className="text-2xl font-bold">PKR {currentAvailableCash.toLocaleString()}</p>
            </div>
          </div>

          {/* Pending Debt Alert */}
          {totalPastDebt > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
               <div className="flex justify-between items-center mb-3">
                 <h4 className="font-bold text-amber-800 text-sm flex items-center gap-2">⚠️ Previous Debt: ${totalPastDebt}</h4>
               </div>
               <div className="space-y-2">
                 {pastDebtItems.map((item, index) => (
                   <div key={index} className="flex justify-between items-center bg-white p-2 rounded-lg border border-amber-100 shadow-sm">
                     <div>
                       <span className="font-bold text-slate-700 text-sm block">{item.name}</span>
                       <span className="text-xs text-slate-400">{item.month}</span>
                     </div>
                     <button onClick={() => onPayDebt(item, selectedMonth)} className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition">Pay</button>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default ExpenseSummary