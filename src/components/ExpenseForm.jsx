import React, { useState } from 'react'

function ExpenseForm({ onAddExpense, expenses, budget, currency }) { 
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('') 
  const [category, setCategory] = useState('Other')
  const [lender, setLender] = useState('') // ✅ NEW: Lender State
  const [isCredit, setIsCredit] = useState(false)

  const categories = ["Food", "Transport", "Rent", "Utilities", "Health", "Shopping", "Entertainment", "Education", "Other"]

  const submitHandler = (e) => {
    e.preventDefault()
    if(!name || !amount || !date) return alert("Fill all fields")

    // Validation: Agar Udhaar hai, toh Lender Name zaroori hai
    if (isCredit && !lender.trim()) {
      return alert("Please enter the Lender's Name (Who did you borrow from?)")
    }

    const newAmount = Number(amount)
    const dateObj = new Date(date)
    const monthName = dateObj.toLocaleString('default', { month: 'long' })
    const monthlyIncome = budget[monthName] || 0

    // --- BUDGET & SPLIT LOGIC ---
    if (monthlyIncome > 0) {
      const currentExpenses = expenses.filter(item => item.month === monthName)
      const cashSpent = currentExpenses.filter(item => !item.isCredit).reduce((sum, item) => sum + item.amount, 0)
      const availableCash = monthlyIncome - cashSpent

      if (newAmount > availableCash) {
        if (!isCredit) return alert(`⛔ BUDGET EXCEEDED!`)
        
        // CASE 1: Totally Out of Budget (Full Credit)
        if (availableCash <= 0) {
           onAddExpense({ 
             id: Date.now(), name, amount: newAmount, date, month: monthName, category, 
             isCredit: true, lender: lender // ✅ Save Lender
           })
           resetForm(); return
        }

        // CASE 2: Split Transaction (Partial Cash, Partial Credit)
        const extraAmount = newAmount - availableCash
        
        // Cash Part (No Lender needed)
        onAddExpense({ 
          id: Date.now(), name: `${name} (Cash)`, amount: availableCash, date, month: monthName, category, 
          isCredit: false, lender: '' 
        })

        // Credit Part (Attach Lender Name)
        setTimeout(() => {
          onAddExpense({ 
            id: Date.now() + 1, name: `${name} (Credit)`, amount: extraAmount, date, month: monthName, category, 
            isCredit: true, lender: lender // ✅ Save Lender only on credit part
          })
        }, 100)
        resetForm(); return
      }
    }

    // Normal Transaction
    onAddExpense({ 
      id: Date.now(), name, amount: newAmount, date, month: monthName, category, 
      isCredit, lender: isCredit ? lender : '' // Save Lender if credit
    })
    resetForm()
  }

  const resetForm = () => { setName(''); setAmount(''); setDate(''); setCategory('Other'); setIsCredit(false); setLender('') }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
      <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
        <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg">➕</span> Add Transaction
      </h2>
      
      <form onSubmit={submitHandler} className="space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Title</label>
            <input type="text" placeholder="e.g. Pizza" value={name} onChange={e=>setName(e.target.value)} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-sm" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Amount ({currency})</label>
            <input type="text" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-sm" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-sm text-slate-600" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-sm cursor-pointer">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Credit Checkbox & Lender Input */}
        <div className={`p-3 border rounded-lg transition-all duration-300 ${isCredit ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100'}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isCredit} onChange={e=>setIsCredit(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
            <span className={`text-sm font-bold ${isCredit ? 'text-yellow-800' : 'text-slate-500'}`}>Mark as Debt / Udhaar</span>
          </label>

          {/* ✅ LENDER INPUT (Only shows if Credit is true) */}
          {isCredit && (
            <div className="mt-3 animate-fade-in-down">
              <label className="text-xs font-bold text-yellow-700 uppercase mb-1 block">Lender Name (From whom?)</label>
              <input 
                type="text" 
                placeholder="e.g. Ali, Bank, Shopkeeper" 
                value={lender} 
                onChange={e=>setLender(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-yellow-300 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              />
            </div>
          )}
        </div>

        <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-95 text-sm">
          Save Transaction
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm