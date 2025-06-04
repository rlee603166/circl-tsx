import React, { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./MessageInput.module.css";

interface MessageInputProps {
    onSendMessage: (message: string) => (void | Promise<void>);
    disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
    const [deep, setDeep] = useState(false);
    const [network, setNetwork] = useState(false);
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const MAX_HEIGHT = 200;

    const adjustTextareaHeight = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        if (ta.scrollHeight > MAX_HEIGHT) {
            ta.style.height = `${MAX_HEIGHT}px`;
            ta.style.overflowY = "auto";
        } else {
            ta.style.height = `${ta.scrollHeight}px`;
            ta.style.overflowY = "hidden";
        }
    };

    useEffect(adjustTextareaHeight, [message]);

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
        <div className="bg-transparent w-full -mt-[25px] pb-2 relative z-10">
            <form
                onSubmit={handleSubmit}
                className="
                    flex flex-col w-full
                    bg-white
                    rounded-3xl px-3 pb-1 pt-2
                    gap-y-2 shadow-md
                    border border-solid border-gray-200 rounded-3xl
                "
            >
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={disabled}
                    rows={1}
                    className={`
                        w-full bg-transparent resize-none outline-none
                        px-2 py-1 text-gray-800 placeholder-gray-500
                        dark:placeholder-gray-400 ${styles.textarea}
                    `}
                    style={{ lineHeight: "1.4" }}
                />

                <div className="flex items-center justify-between mt-2">
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={() => setDeep(p => !p)}
                            className={`
                                px-4 py-1 rounded-full text-sm transition-colors
                                ${
                                    deep
                                        ? "bg-blue-50 border border-blue-200/50"
                                        : "bg-gray-100 text-black hover:bg-blue-50"
                                }
                            `}
                        >
                            Deep Search
                        </button>
                        <button
                            type="button"
                            onClick={() => setNetwork(p => !p)}
                            className={`
                                px-4 py-1 rounded-full text-sm transition-colors
                                ${
                                    network
                                        ? "bg-blue-50 border border-blue-200/50"
                                        : "bg-gray-100 text-black hover:bg-blue-50"
                                }
                            `}
                        >
                            Network Search
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!message.trim() || disabled}
                        className="p-2 bg-blue-600 text-white rounded-full transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowUp className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </div>
            </form>
        </div>
    );
};
