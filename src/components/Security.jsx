import React, { useState } from 'react'

function Security({ isLocked, onUnlock, onSetPin }) {
  const [inputPin, setInputPin] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputPin.length < 4) {
      setError("PIN must be 4 digits")
      return
    }

    if (isLocked) {
      const success = onUnlock(inputPin)
      if (!success) {
        setError("❌ Wrong PIN! Try again.")
        setInputPin('')
      }
    } else {
      onSetPin(inputPin)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-80 animate-bounce-in">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isLocked ? "App Locked" : "Set Security PIN"}
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          {isLocked ? "Enter your 4-digit PIN to access data." : "Create a PIN to protect your expenses."}
        </p>

        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            value={inputPin}
            onChange={(e) => {
              if (!isNaN(e.target.value)) setInputPin(e.target.value)
              setError('')
            }}
            maxLength={4}
            placeholder="****"
            className="w-full text-center text-3xl tracking-widest border-b-2 border-blue-500 outline-none mb-4 py-2 font-bold text-gray-700"
            autoFocus
          />
          
          {error && <p className="text-red-500 text-xs mb-4 font-bold">{error}</p>}

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg transform active:scale-95">
            {isLocked ? "🔓 Unlock App" : "🛡️ Set PIN"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Security