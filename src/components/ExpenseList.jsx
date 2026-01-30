import React, { useState } from 'react'

function ExpenseItem({ item, onDelete, onEdit, onRepeat, currency }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(item.name)
  const [newAmount, setNewAmount] = useState(item.amount)
  const [newDate, setNewDate] = useState(item.date)
  // ✅ Edit Lender Name
  const [newLender, setNewLender] = useState(item.lender || '') 

  const handleSave = () => {
    if (!newName || !newAmount || !newDate) return alert("Required")
    const newMonth = new Date(newDate).toLocaleString('default', { month: 'long' })
    
    onEdit(item.id, { 
      name: newName, 
      amount: Number(newAmount), 
      date: newDate, 
      month: newMonth,
      lender: newLender // ✅ Save updated lender
    })
    setIsEditing(false) 
  }

  return (
    <div className={`p-4 rounded-xl border mb-3 transition hover:shadow-md ${item.isCredit ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-100'}`}>
      
      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input value={newName} onChange={e=>setNewName(e.target.value)} className="border p-2 rounded bg-white text-sm" placeholder="Name" />
            <input type="text" value={newAmount} onChange={e=>setNewAmount(e.target.value)} className="border p-2 rounded bg-white text-sm" placeholder="Amount" />
            <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} className="border p-2 rounded bg-white text-sm" />
            {item.isCredit && (
               <input type="text" value={newLender} onChange={e=>setNewLender(e.target.value)} className="border p-2 rounded bg-white text-sm border-yellow-300" placeholder="Lender Name" />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="text-slate-500 text-xs font-bold">Cancel</button>
            <button onClick={handleSave} className="bg-emerald-500 text-white px-3 py-1 rounded text-xs font-bold">Save</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left: Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-800">{item.name}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
                {item.category || 'Other'}
              </span>
              {item.isCredit && (
                item.isSettled ? 
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Paid</span> : 
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">Unpaid</span>
              )}
            </div>
            
            <div className="flex flex-col gap-1 text-xs text-slate-500">
               <div className="flex items-center gap-2">
                  <span>📅 {item.date}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{item.month}</span>
               </div>
               
               {/* ✅ SHOW LENDER DETAILS */}
               {item.isCredit && item.lender && (
                 <div className="flex items-center gap-1 text-yellow-700 font-semibold mt-1">
                   <span>👤 Lender:</span>
                   <span className="bg-yellow-100 px-1.5 rounded text-yellow-900 border border-yellow-200">{item.lender}</span>
                 </div>
               )}
            </div>
          </div>
          
          {/* Right: Amount & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-slate-200">
            <span className={`font-bold text-lg ${item.isCredit && !item.isSettled ? 'text-red-600' : 'text-slate-700'}`}>
              {currency} {item.amount.toLocaleString()}
            </span>
            
            <div className="flex gap-1">
              <button onClick={() => onRepeat(item)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition">🔁</button>
              <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition">✏️</button>
              <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition">🗑️</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ExpenseList({ expenses, selectedMonth, onDelete, onEdit, onRepeat, currency }) {
  const visibleExpenses = selectedMonth ? expenses.filter(i => i.month === selectedMonth) : expenses
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex justify-between items-center">
        <span>History</span>
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{visibleExpenses.length} Records</span>
      </h3>
      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {visibleExpenses.length === 0 ? <p className="text-center text-slate-400 py-8">No records found</p> : 
         visibleExpenses.map(item => <ExpenseItem key={item.id} item={item} onDelete={onDelete} onEdit={onEdit} onRepeat={onRepeat} currency={currency} />)}
      </div>
    </div>
  )
}
export default ExpenseList