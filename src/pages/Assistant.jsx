import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import {
  AlertCircle,
  Bot,
  Paperclip,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { initialMessages, suggestedPrompts } from '../data/chat';

const buildResponse = (messageText) => {
  const text = messageText.toLowerCase();

  if (text.includes('hba1c')) {
    return "Based on your confirmed lab results, your HbA1c is 6.8%, which is above the normal range (4.0–5.6%). This reflects an average blood sugar level over the past 2–3 months. I can only explain confirmed values — this is educational information only, not a diagnosis.";
  }

  if (text.includes('medication') && text.includes('today')) {
    return "Looking at your schedule today: Metformin 500 mg at 08:00 and 20:00, Lisinopril 10 mg at 09:00, and Atorvastatin 20 mg at 21:00. You have confirmed Metformin at 08:00 and Lisinopril at 09:00. Metformin at 20:00 and Atorvastatin at 21:00 are still pending.";
  }

  if (text.includes('cheaper') || text.includes('alternative')) {
    return "For Metformin hydrochloride, example generic options include Metformin (Generic) by Teva at about $4.50/month and Mylan's generic equivalent at about $5.20/month. These contain the same active ingredient. Please verify availability, strength, and suitability with your pharmacist or doctor before changing any medication.";
  }

  if (text.includes('cholesterol')) {
    return "Your latest confirmed cholesterol panel shows total cholesterol at 185 mg/dL and LDL at 110 mg/dL, which is slightly above the reference range of under 100 mg/dL. HDL is 45 mg/dL, within range. Your clinician can interpret these together with your overall cardiovascular risk.";
  }

  if (text.includes('report') || text.includes('attach') || text.includes('upload')) {
    return "I can see that you would like help with a report. In this prototype I cannot read attachments or perform OCR. Please upload the report on the Labs page, review the extracted values, and confirm them before they are used in charts or assistant explanations.";
  }

  return "I can help explain your confirmed lab results in simple language, discuss your medication schedule, or provide general information about medication alternatives based on active ingredients. Could you be more specific about what you would like to know?";
};

const Assistant = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState('');
  const bodyRef = useRef(null);
  const fileRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [messages, isTyping]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleSend = (messageText = input) => {
    const trimmed = messageText.trim();
    if ((!trimmed && !attachment) || isTyping) return;

    const content = trimmed || 'Please help me understand the attached report (demo).';
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      attachment: attachment || null,
      timestamp: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setAttachment('');
    setIsTyping(true);

    timeoutRef.current = window.setTimeout(() => {
      const response = attachment
        ? "Thanks for sharing a file. This demo cannot open or process attachments, so no report content was read. You can use the Labs page to review and confirm extracted values first — then I can help explain them."
        : buildResponse(content);

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((current) => [...current, assistantMessage]);
      setIsTyping(false);
    }, 1050);
  };

  const startNewChat = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessages(initialMessages);
    setInput('');
    setAttachment('');
    setIsTyping(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Educational support"
        eyebrowIcon={Sparkles}
        title="AI health assistant"
        subtitle="Ask about your confirmed lab results, medication schedule, or general health information. Demo responses only."
      />

      <div className="stack-md">
        <div className="notice notice--warning">
          <AlertCircle aria-hidden="true" />
          <div className="notice__body">
            <p className="notice__title">Medical disclaimer</p>
            <p className="notice__text">
              The assistant provides educational information only and does not diagnose conditions
              or change medication doses. It cannot replace advice from a qualified healthcare
              professional.
            </p>
          </div>
        </div>

        <div className="card chat-shell">
          <div className="chat-head">
            <div className="chat-identity">
              <span className="chat-avatar" aria-hidden="true">
                <Bot />
              </span>
              <div>
                <p className="chat-name">
                  SmartMed Assistant
                  <span className="badge badge--cyan">Demo</span>
                </p>
                <p className="chat-status">
                  <span className="live-dot" aria-hidden="true" />
                  Online · educational responses only
                </p>
              </div>
            </div>
            <div className="chat-head__actions">
              <span className="badge badge--slate">Confirmed data only</span>
              <button type="button" className="btn btn--secondary btn--sm" onClick={startNewChat}>
                <RotateCcw />
                New chat
              </button>
            </div>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`msg-row${message.type === 'user' ? ' msg-row--user' : ''}`}
              >
                <span className="msg-avatar" aria-hidden="true">
                  {message.type === 'user' ? <User /> : <Bot />}
                </span>
                <div className="msg-stack">
                  <div
                    className={`msg-bubble${
                      message.type === 'user' ? ' msg-bubble--user' : ' msg-bubble--assistant'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.attachment && (
                      <p className="msg-file">
                        <Paperclip aria-hidden="true" />
                        {message.attachment}
                      </p>
                    )}
                  </div>
                  <span className="msg-meta">
                    {message.type === 'user' ? 'You' : 'SmartMed Assistant'} ·{' '}
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="msg-row">
                <span className="msg-avatar" aria-hidden="true">
                  <Bot />
                </span>
                <div className="msg-stack">
                  <div className="msg-bubble typing" aria-label="Assistant is typing">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="msg-meta">Thinking…</span>
                </div>
              </div>
            )}
          </div>

          <div className="prompt-bar">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="prompt-chip"
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
              >
                {prompt}
              </button>
            ))}
          </div>

          {attachment && (
            <div className="attachment-bar">
              <span className="badge badge--blue">
                <Paperclip aria-hidden="true" />
                {attachment}
              </span>
              <button
                type="button"
                className="icon-btn"
                style={{ width: 26, height: 26 }}
                onClick={() => setAttachment('')}
                aria-label="Remove attachment"
              >
                <X />
              </button>
            </div>
          )}

          <div className="composer">
            <button
              type="button"
              className="btn btn--secondary btn--icon"
              onClick={() => fileRef.current?.click()}
              aria-label="Attach a report (demo)"
              title="Attach a report (demo)"
            >
              <Paperclip />
            </button>
            <input
              ref={fileRef}
              type="file"
              className="sr-only"
              aria-label="Attach a report"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setAttachment(file.name);
                event.target.value = '';
              }}
            />
            <div className="composer__field">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about your confirmed results or medications..."
                aria-label="Message the assistant"
              />
            </div>
            <button
              type="button"
              className="btn btn--primary btn--icon"
              onClick={() => handleSend()}
              aria-label="Send message"
              disabled={isTyping || (!input.trim() && !attachment)}
            >
              <Send />
            </button>
          </div>
          <p className="chat-note">
            <ShieldCheck aria-hidden="true" />
            Demo assistant · no real AI, no data leaves this browser
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
