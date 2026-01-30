import React from 'react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'

function Dashboard({ expenses, selectedMonth }) {
  
  const relevantExpenses = selectedMonth ? expenses.filter(i => i.month === selectedMonth) : expenses

  const dataMap = {}
  relevantExpenses.forEach(item => {
    if (!item.name.startsWith('Paid:')) {
      const key = selectedMonth ? item.name : (item.category || 'Other')
      dataMap[key] = (dataMap[key] || 0) + item.amount
    }
  })

  const pieData = Object.keys(dataMap).map(key => ({ name: key, value: dataMap[key] }))
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

  const barMap = {}
  relevantExpenses.forEach(item => {
    if (!item.name.startsWith('Paid:')) {
      const key = selectedMonth ? item.date.split('-')[2] : item.month
      barMap[key] = (barMap[key] || 0) + item.amount
    }
  })
  
  const barData = Object.keys(barMap).map(key => ({
    name: selectedMonth ? `Day ${key}` : key,
    amount: barMap[key]
  }))

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-100 pb-4 gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Financial Overview</h2>
          <p className="text-sm text-slate-500">Analytics for {selectedMonth || "All Month in This Year"}</p>
        </div>
        {selectedMonth && (
           <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
             Filtering: {selectedMonth}
           </span>
        )}
      </div>
      
      {pieData.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          No data available for this period
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1 */}
          <div className="h-72 bg-slate-50 rounded-xl p-2 border border-slate-100">
            <h3 className="text-center text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              {selectedMonth ? "Item Breakdown" : "Category Spend"}
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2 */}
          <div className="h-72 bg-slate-50 rounded-xl p-2 border border-slate-100">
            <h3 className="text-center text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              {selectedMonth ? "Daily Trend" : "Monthly Trend"}
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="amount" fill={selectedMonth ? "#10b981" : "#6366f1"} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard