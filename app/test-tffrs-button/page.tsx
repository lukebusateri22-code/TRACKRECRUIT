'use client'

export default function TestTFFRSButton() {
  const handleClick = () => {
    console.log('🔥 Test button clicked!')
    alert('Button is working!')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">TFFRS Button Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="mb-4">Click this button to test if click handlers work:</p>
          
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Test Click Handler
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <p className="mb-4">Direct inline test:</p>
          
          <button
            onClick={() => {
              console.log('🎯 Inline click worked!')
              alert('Inline click works!')
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Inline Test
          </button>
        </div>
      </div>
    </div>
  )
}
