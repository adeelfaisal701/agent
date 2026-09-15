"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { FileText, Image as ImageIcon, Mic, Paperclip, Plus, Send, X } from "lucide-react";
import type { ChatAttachment } from "@/types/chat";
import { createId } from "@/lib/id";

interface ChatInputProps { disabled: boolean; onSubmit: (value: string, attachments: ChatAttachment[]) => void; focusSignal?: number; }

type SpeechRecognitionInstance = { start: () => void; stop: () => void; onresult: ((event: { results: { 0: { 0: { transcript: string } } } }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global { interface Window { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor; } }

export function ChatInput({ disabled, onSubmit, focusSignal = 0 }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => { textareaRef.current?.focus(); }, [focusSignal]);
  function resize() { const textarea = textareaRef.current; if (textarea) { textarea.style.height = "auto"; textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`; } }
  function submit(event?: FormEvent) { event?.preventDefault(); const next = value.trim(); if ((!next && !attachments.length) || disabled) return; onSubmit(next || "Please analyze the attached file.", attachments); setValue(""); setAttachments([]); if (textareaRef.current) textareaRef.current.style.height = "auto"; }
  function toggleVoice() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setVoiceError("Voice input is not supported in this browser."); return; }
    setVoiceError("");
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const recognition = new Recognition(); recognitionRef.current = recognition;
    recognition.onresult = (event) => { setValue((current) => `${current}${current ? " " : ""}${event.results[0][0].transcript}`); setListening(false); };
    recognition.onerror = () => setListening(false); recognition.onend = () => setListening(false); recognition.start(); setListening(true);
  }
  async function selectFiles(files: FileList | null) { if (!files) return; const allowed = ["application/pdf", "text/plain", "text/csv", "application/json", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]; const next = await Promise.all(Array.from(files).filter((file) => file.size > 0 && file.size <= 10 * 1024 * 1024 && (allowed.includes(file.type) || file.type.startsWith("image/"))).map(async (file) => ({ id: createId(), name: file.name, type: file.type || "application/octet-stream", size: file.size, data: await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); }), previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined }))); setAttachments((current) => [...current, ...next]); }
  function removeAttachment(id: string) { setAttachments((items) => { const removed = items.find((item) => item.id === id); if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl); return items.filter((item) => item.id !== id); }); }
  return <form className="composer" onSubmit={submit}><div className="attachment-list">{attachments.map((file) => <div className="attachment-chip" key={file.id}>{file.previewUrl ? <Image src={file.previewUrl} alt="" width={32} height={32} unoptimized /> : <span className="attachment-file-icon"><FileText size={16} /></span>}<div><strong>{file.name}</strong><small>{file.type || "Unknown type"}</small></div><button type="button" onClick={() => removeAttachment(file.id)} aria-label={`Remove ${file.name}`} title={`Remove ${file.name}`}><X size={14} /></button></div>)}</div><div className="composer-inner"><input ref={fileRef} type="file" multiple hidden accept=".pdf,.docx,.txt,.csv,.json,image/png,image/jpeg,image/webp,image/gif" onChange={(event) => selectFiles(event.target.files)} /><input ref={imageRef} type="file" multiple hidden accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => selectFiles(event.target.files)} /><div className="composer-tools"><button type="button" className="composer-tool composer-plus" onClick={() => fileRef.current?.click()} aria-label="More options" title="More options" disabled={disabled}><Plus size={21} strokeWidth={2.2} /></button><button type="button" className="composer-tool" onClick={() => fileRef.current?.click()} aria-label="Attach file" title="Attach file" disabled={disabled}><Paperclip size={19} /></button><button type="button" className="composer-tool" onClick={() => imageRef.current?.click()} aria-label="Upload image" title="Upload image" disabled={disabled}><ImageIcon size={19} /></button></div><textarea ref={textareaRef} value={value} onChange={(event) => { setValue(event.target.value); resize(); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(event); } }} placeholder="Message your agent..." rows={1} disabled={disabled} aria-label="Message your agent" /><div className="composer-actions"><button type="button" className={`composer-tool voice-button ${listening ? "listening" : ""}`} onClick={toggleVoice} aria-label={listening ? "Stop listening" : "Voice input"} title={listening ? "Stop listening" : "Voice input"} disabled={disabled}><Mic size={19} /></button><span className="composer-divider" aria-hidden="true" /><button className="send-button" type="submit" disabled={disabled || (!value.trim() && !attachments.length)} aria-label="Send message" title="Send message">{disabled ? <span className="spinner" /> : <Send size={18} />}</button></div></div>{voiceError && <div className="composer-error" role="status">{voiceError}</div>}</form>;
}
