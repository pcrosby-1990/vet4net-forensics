// src/components/ScrollViewer.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ScrollViewer({ scroll }) {
  return (
    <div className="scroll-viewer">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {scroll}
      </ReactMarkdown>
    </div>
  );
}
