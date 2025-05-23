
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownProps {
  content: string;
  className?: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={cn("prose prose-invert max-w-none break-words", className)}
      components={{
        // Override component rendering
        p: ({ node, ...props }) => (
          <p className="my-1" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a 
            className="text-primary underline hover:text-primary/80 transition-colors" 
            target="_blank" 
            rel="noopener noreferrer" 
            {...props} 
          />
        ),
        h1: ({ node, ...props }) => (
          <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-lg font-bold mt-3 mb-1" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-base font-bold mt-2 mb-1" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc ml-4 my-1" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal ml-4 my-1" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="my-0.5" {...props} />
        ),
        code: ({ node, inline, ...props }) => (
          inline ? 
            <code className="bg-muted/30 px-1 py-0.5 rounded text-sm" {...props} /> :
            <code className="block bg-muted/30 p-2 rounded-md text-sm my-2 overflow-x-auto" {...props} />
        ),
        pre: ({ node, ...props }) => (
          <pre className="bg-muted/30 p-3 rounded-md text-sm my-2 overflow-x-auto" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-primary/30 pl-3 my-2 italic" {...props} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full divide-y divide-gray-700" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="px-3 py-2 text-left text-sm font-semibold text-gray-200 bg-gray-800" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="px-3 py-2 text-sm" {...props} />
        ),
        hr: ({ node, ...props }) => (
          <hr className="my-4 border-t border-gray-700" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
