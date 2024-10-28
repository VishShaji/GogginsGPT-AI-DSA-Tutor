import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ClipboardCopy } from 'lucide-react'

const Message = ({ role, content = '' }) => {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  const renderMessage = (content) => {
    // Ensure content is a string and handle empty/null values
    const messageStr = typeof content === 'object' && content?.response 
    ? content.response 
    : String(content || '')
  
  if (!messageStr) return null

  const sections = messageStr.split('\n\n')
  return sections.map((section, index) => (
    <div key={index} className="mb-4">
      {renderContent(section, index)}
    </div>
  ))
}
  const renderContent = (text, sectionIndex) => {
    // Ensure text is a string
    const textStr = String(text || '')
    if (!textStr) return null

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match
    let codeBlockIndex = 0

    while ((match = codeBlockRegex.exec(textStr)) !== null) {
      if (lastIndex < match.index) {
        parts.push(renderMarkdown(textStr.slice(lastIndex, match.index), `${sectionIndex}-text-${codeBlockIndex}`))
      }

      const language = match[1] || 'plaintext'
      const code = match[2].trim()
      const codeId = `${sectionIndex}-code-${codeBlockIndex}`
      parts.push(
        <div key={codeId} className="my-2 rounded-md overflow-hidden relative group">
          <SyntaxHighlighter language={language} style={atomOneDark}>
            {code}
          </SyntaxHighlighter>
          <button
            onClick={() => copyToClipboard(code, codeId)}
            className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ClipboardCopy size={16} className={copiedIndex === codeId ? "text-green-500" : "text-gray-300"} />
          </button>
        </div>
      )
      lastIndex = match.index + match[0].length
      codeBlockIndex++
    }

    if (lastIndex < textStr.length) {
      parts.push(renderMarkdown(textStr.slice(lastIndex), `${sectionIndex}-text-${codeBlockIndex}`))
    }

    return parts
  }

  const renderMarkdown = (text, key) => {
    // Ensure text is a string
    const textStr = String(text || '')
    if (!textStr) return null

    const lines = textStr.split('\n')
    return lines.map((line, index) => {
      // Handle headers
      if (line.startsWith('# ')) {
        return <h1 key={`${key}-${index}`} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>
      }
      if (line.startsWith('## ')) {
        return <h2 key={`${key}-${index}`} className="text-xl font-bold mt-3 mb-2">{line.slice(3)}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={`${key}-${index}`} className="text-lg font-bold mt-2 mb-1">{line.slice(4)}</h3>
      }

      // Handle bold, italic, and inline code
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>')
      line = line.replace(/`([^`]+)`/g, '<code class="bg-gray-800 rounded px-1">$1</code>')

      return (
        <p key={`${key}-${index}`} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />
      )
    })
  }

  // Convert content to string if it exists, otherwise use empty string
  const contentStr = content ? String(content) : ''

  return (
    <div className={`mb-6 flex ${role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] p-4 rounded-2xl shadow-lg relative group ${
        role === 'assistant'
          ? 'bg-gradient-to-br from-blue-600 to-blue-700'
          : 'bg-gradient-to-br from-purple-600 to-purple-700'
      }`}>
        <p className="font-bold mb-2 text-lg">{role === 'assistant' ? 'Goggins' : 'You'}</p>
        <div className="text-sm leading-relaxed">{renderMessage(contentStr)}</div>
        <button
          onClick={() => copyToClipboard(contentStr, 'full-message')}
          className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ClipboardCopy size={16} className={copiedIndex === 'full-message' ? "text-green-500" : "text-gray-300"} />
        </button>
      </div>
    </div>
  )
}

Message.propTypes = {
  role: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]), // Allow different types that can be converted to string
}

export default Message