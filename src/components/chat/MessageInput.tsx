import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="bg-white backdrop-blur-xl px-4 py-3">
            <form
                onSubmit={handleSubmit}
                className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 space-x-2"
            >
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={disabled}
                    rows={1}
                    className="flex-1 bg-transparent resize-none outline-none px-2 py-1 text-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
                    style={{ lineHeight: "1.4", maxHeight: "200px" }}
                />
                <div className="flex items-center space-x-2">
                    {/* Add more buttons here and they'll sit inside the pill */}
                    <button
                        type="submit"
                        disabled={!message.trim() || disabled}
                        className="p-2 bg-blue-600 text-white rounded-full transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </div>
            </form>
        </div>
    );
};
