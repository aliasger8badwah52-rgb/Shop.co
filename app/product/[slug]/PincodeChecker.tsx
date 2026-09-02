'use client'
import { useState } from 'react'

export default function PincodeChecker() {
  const [pin, setPin] = useState('')
  const [service, setService] = useState<boolean | null>(null)

  const checkServiceability = async () => {
    const res = await fetch('/api/pincode')
    const pins: string[] = await res.json()
    setService(pins.includes(pin))
  }

  return (
    <div className="pin flex mt-6 gap-4 items-center flex-wrap">
      <input
        type="text"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter Pincode"
        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
      <button
        onClick={checkServiceability}
        className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
      >
        Check
      </button>
      {service === true && (
        <span className="text-green-600 font-semibold text-sm">✓ Delivery available to this pincode!</span>
      )}
      {service === false && (
        <span className="text-red-500 font-semibold text-sm">✗ Sorry, we do not deliver to this pincode.</span>
      )}
    </div>
  )
}