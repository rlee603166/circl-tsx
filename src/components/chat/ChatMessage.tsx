import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SingleMessage } from "@/types";
import rehypeHighlight from "rehype-highlight";

interface ChatMessageProps {
    message: SingleMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const formatTimestamp = (date: Date | null | undefined): string => {
        if (!date) return "";
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatUserContent = (content: string) => {
        return content.split("\n").map((line, index) => (
            <span key={index}>
                {line}
                {index < content.split("\n").length - 1 && <br />}
            </span>
        ));
    };

    const ThinkingIndicator = () => (
        <div className="flex items-center space-x-2 py-8">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                ></div>
            </div>
            <span className="text-sm text-gray-500">{message.thinkingText || "Thinking..."}</span>
        </div>
    );

    if (message.role === "user") {
        return (
            <div className="flex justify-end mb-6 animate-fade-in">
                <div className="flex flex-col items-end max-w-xs lg:max-w-md">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-2xl rounded-br-md shadow-lg">
                        <div className="text-sm leading-relaxed">
                            {formatUserContent(message.content)}
                        </div>
                    </div>
                    {message.createdAt && (
                        <div className="text-xs text-gray-500 mt-1 mr-2">
                            {formatTimestamp(message.createdAt)}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mb-8 animate-fade-in">
            {message.isThinking ? (
                <ThinkingIndicator />
            ) : (
                <div className="w-full">
                    <div className="prose prose-gray prose-lg max-w-none leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                // Custom styling for code blocks
                                code: ({ className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const isInline = !className?.includes("language-");
                                    return !isInline && match ? (
                                        <pre className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto my-4">
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    ) : (
                                        <code
                                            className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono"
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                },
                                // Custom styling for links
                                a: ({ children, href, ...props }) => (
                                    <a
                                        href={href}
                                        className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        {...props}
                                    >
                                        {children}
                                    </a>
                                ),
                                // Custom styling for headings
                                h1: ({ children, ...props }) => (
                                    <h1
                                        className="text-2xl font-bold text-gray-900 mt-8 mb-4 first:mt-0"
                                        {...props}
                                    >
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children, ...props }) => (
                                    <h2
                                        className="text-xl font-semibold text-gray-900 mt-6 mb-3 first:mt-0"
                                        {...props}
                                    >
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children, ...props }) => (
                                    <h3
                                        className="text-lg font-medium text-gray-900 mt-4 mb-2 first:mt-0"
                                        {...props}
                                    >
                                        {children}
                                    </h3>
                                ),
                                // Custom styling for paragraphs
                                p: ({ children, ...props }) => (
                                    <p className="text-gray-700 leading-7 mb-4" {...props}>
                                        {children}
                                    </p>
                                ),
                                // Custom styling for lists
                                ul: ({ children, ...props }) => (
                                    <ul
                                        className="list-disc list-inside text-gray-700 mb-4 space-y-1"
                                        {...props}
                                    >
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children, ...props }) => (
                                    <ol
                                        className="list-decimal list-inside text-gray-700 mb-4 space-y-1"
                                        {...props}
                                    >
                                        {children}
                                    </ol>
                                ),
                                // Custom styling for tables
                                table: ({ children, ...props }) => (
                                    <div className="w-full overflow-x-auto my-4">
                                        <table
                                            className="w-full border-collapse border border-gray-300"
                                            {...props}
                                        >
                                            {children}
                                        </table>
                                    </div>
                                ),
                                th: ({ children, ...props }) => (
                                    <th
                                        className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-900"
                                        {...props}
                                    >
                                        {children}
                                    </th>
                                ),
                                td: ({ children, ...props }) => (
                                    <td
                                        className="border border-gray-300 px-4 py-2 text-gray-700"
                                        {...props}
                                    >
                                        {children}
                                    </td>
                                ),
                                // Custom styling for blockquotes
                                blockquote: ({ children, ...props }) => (
                                    <blockquote
                                        className="border-l-4 border-gray-300 pl-4 py-2 my-4 text-gray-600 italic"
                                        {...props}
                                    >
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                    {message.createdAt && (
                        <div className="text-xs text-gray-400 mt-4 font-light">
                            {formatTimestamp(message.createdAt)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
