import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import Message from './Message';

const TutorApp = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { id: Date.now(), role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage = { id: Date.now(), role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = { id: Date.now(), role: 'assistant', content: 'Sorry, I encountered an error while processing your request.' }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto h-[90vh] flex flex-col bg-gray-900 text-gray-100 shadow-2xl rounded-xl overflow-hidden">
        <header className="border-b border-gray-700 p-6 bg-gray-800">
          <h1 className="text-3xl font-bold flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            <span className="mr-3 text-4xl">💪</span> GogginsGPT
          </h1>
        </header>

        <main className="flex-grow p-6 overflow-y-auto custom-scrollbar" ref={scrollAreaRef}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Message role={message.role} content={message.content} />
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mb-6"
              >
                <div className="p-4 rounded-full bg-gray-800 flex items-center shadow-lg">
                  <span className="animate-spin mr-3 text-blue-400 text-2xl">⟳</span>
                  <p className="text-blue-300 font-semibold">Generating response...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="border-t border-gray-700 p-6 bg-gray-800">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about coding, algorithms, or any DSA question..."
              className="flex-grow bg-gray-700 text-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              rows={3}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? <span className="animate-spin text-2xl">⟳</span> : 'Send'}
            </button>
          </form>
        </footer>
      </div>
    </div>
  )
}

export default TutorApp