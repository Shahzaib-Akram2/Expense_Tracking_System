import React, { useEffect, useState } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseSummary from './components/ExpenseSummary'
import DebtHistory from './components/DebtHistory'
import StatementGenerator from './components/StatementGenerator'
import Dashboard from './components/Dashboard'
import Security from './components/Security'

function App() {
  // --- 1. STATES ---
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('expenses')) || [])
  const [budget, setBudget] = useState(() => JSON.parse(localStorage.getItem('budget')) || {})
  const [pin, setPin] = useState(() => localStorage.getItem('appPin') || '')
  const [isAppUnlocked, setIsAppUnlocked] = useState(false)
  const [currency, setCurrency] = useState('PKR')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  // --- 2. EFFECTS ---
  useEffect(() => { localStorage.setItem('expenses', JSON.stringify(expenses)) }, [expenses])
  useEffect(() => { localStorage.setItem('budget', JSON.stringify(budget)) }, [budget])
  useEffect(() => { if(!pin) setIsAppUnlocked(true) }, [pin])

  // --- 3. FUNCTIONS ---
  const handleSetPin = (newPin) => {
    localStorage.setItem('appPin', newPin)
    setPin(newPin)
    setIsAppUnlocked(true)
    alert("✅ PIN Set Successfully!")
  }

  const handleUnlock = (inputPin) => {
    if (inputPin === pin) { setIsAppUnlocked(true); return true }
    return false
  }

  const exportData = () => {
    const dataStr = JSON.stringify({ expenses, budget })
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Backup_${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if(data.expenses && data.budget) {
          if(window.confirm("Overwrite current data?")) {
            setExpenses(data.expenses); setBudget(data.budget); alert("✅ Restored!")
          }
        } else { alert("❌ Invalid File") }
      } catch (err) { alert("❌ Error") }
    }
    reader.readAsText(file)
  }

  const repeatExpense = (item) => {
    if(window.confirm(`🔁 Repeat "${item.name}"?`)) {
      const today = new Date().toISOString().split('T')[0]
      const monthName = new Date().toLocaleString('default', { month: 'long' })
      const newItem = { ...item, id: Date.now(), date: today, month: monthName, isSettled: false }
      setExpenses(prev => [...prev, newItem])
    }
  }

  const addExpense = (exp) => setExpenses(prev => [...prev, exp])
  const deleteExpense = (id) => { if(window.confirm("Delete?")) setExpenses(prev => prev.filter(e => e.id !== id)) }
  const editExpense = (id, updatedData) => setExpenses(expenses.map(e => e.id === id ? { ...e, ...updatedData } : e))

  const payDebt = (oldExpense, currentMonth) => {
    if (!currentMonth) return alert("Select Month first!")
    const today = new Date().toISOString().split('T')[0]
    const repaymentExpense = {
      id: Date.now(), name: `Paid: ${oldExpense.name}`, amount: oldExpense.amount,
      month: currentMonth, date: today, category: 'Debt Repayment', isCredit: false,
      originalDate: oldExpense.date, paidDate: today
    }
    const updatedExpenses = expenses.map(item => item.id === oldExpense.id ? { ...item, isSettled: true, settledDate: today, paidDate: today } : item)
    setExpenses([...updatedExpenses, repaymentExpense])
    alert("Payment Recorded!")
  }

  const handleReset = () => {
    if (window.confirm("⚠️ DELETE ALL DATA?")) {
      localStorage.removeItem('expenses'); localStorage.removeItem('budget')
      setExpenses([]); setBudget({}); setSelectedMonth('')
      alert("App Reset.")
    }
  }

  const setMonthlyBudget = (month, amount) => { if (!month) return; setBudget({ ...budget, [month]: amount }) }

  // --- RENDER ---
  if (!isAppUnlocked && pin) return <Security isLocked={true} onUnlock={handleUnlock} />
  if (!pin) return <Security isLocked={false} onSetPin={handleSetPin} />

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-12">
      
      {/* --- TOP NAVIGATION BAR (Responsive) --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-3 md:py-0 gap-3">
            
            {/* Logo Area */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">E</div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Expense Tracker System
              </h1>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full md:w-auto">
              
              <button onClick={handleReset} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md text-xs font-bold border border-red-100 transition">
                Clear Chache
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* <button onClick={() => setCurrency(currency === 'PKR' ? '$' : 'PKR')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold transition">
                {currency}
              </button> */}

              <button onClick={exportData} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold transition">
                Backup
              </button>

              <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer transition">
                Restore
                <input type="file" onChange={importData} className="hidden" accept=".json"/>
              </label>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* DASHBOARD SECTION */}
        <Dashboard expenses={expenses} selectedMonth={selectedMonth} />

        {/* CONTROLS (History & PDF) */}
        <div className="flex flex-wrap justify-end gap-3">
           <button 
             onClick={() => setShowHistory(true)} 
             className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition flex items-center gap-2"
           >
             <span>📜</span> Debt History
           </button>
           <StatementGenerator expenses={expenses} budget={budget} />
        </div>

        {/* MAIN FORM & SUMMARY GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Form (Takes 1 part on XL) */}
          <div className="xl:col-span-1">
             <ExpenseForm onAddExpense={addExpense} expenses={expenses} budget={budget} currency={currency} />
          </div>

          {/* Right Column: Reports & List (Takes 2 parts on XL) */}
          <div className="xl:col-span-2 space-y-8">
            <ExpenseSummary 
              expenses={expenses} 
              selectedMonth={selectedMonth} 
              onMonthChange={setSelectedMonth} 
              budget={budget} 
              setBudget={setMonthlyBudget} 
              onPayDebt={payDebt} 
            />
            <ExpenseList 
              expenses={expenses} 
              selectedMonth={selectedMonth} 
              onDelete={deleteExpense} 
              onEdit={editExpense}
              onRepeat={repeatExpense} 
              currency={currency} 
            />
          </div>

        </div>
      </main>

      {/* MODALS */}
      {showHistory && <DebtHistory expenses={expenses} onClose={() => setShowHistory(false)} />}
    </div>
  )
}

export default App