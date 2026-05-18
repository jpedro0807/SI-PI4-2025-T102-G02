import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: "ia", text: "Olá! Sou a IA da HealthMoney. Como posso ajudar?" }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pergunta: userMsg,
                    historico: messages.map(m => `${m.sender}: ${m.text}`).join("\n")
                })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { sender: "ia", text: data.resposta }]);
        } catch (err) {
            setMessages(prev => [...prev, { sender: "ia", text: "Erro na conexão com o servidor." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-emerald-500 text-white p-4 flex justify-between items-center">
                        <span className="font-bold">Secretária Virtual</span>
                        <button onClick={() => setIsOpen(false)}><X size={20}/></button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`p-3 rounded-lg max-w-[85%] text-sm ${msg.sender === "user" ? "bg-emerald-100 self-end text-emerald-900" : "bg-white border self-start text-gray-700"}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="text-xs text-gray-400">Digitando...</div>}
                    </div>

                    <div className="p-3 bg-white border-t flex gap-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSend()}
                            className="flex-1 border rounded-full px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="Digite sua mensagem..."
                        />
                        <button onClick={handleSend} disabled={loading} className="bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition">
                            <Send size={16}/>
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-110">
                    <MessageCircle size={28} />
                </button>
            )}
        </div>
    );
}