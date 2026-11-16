import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, Plus, Trash2 } from 'lucide-react';

interface PollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PollModal: React.FC<PollModalProps> = ({ isOpen, onClose }) => {
  const { sendMessage } = useWhatsApp();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 12) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (idx: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.map(o => o.trim()).filter(Boolean);
    if (!question.trim() || validOptions.length < 2) return;

    sendMessage({
      type: 'poll',
      poll: {
        question: question.trim(),
        allowMultiple,
        options: validOptions.map((text, i) => ({
          id: `opt_${Date.now()}_${i}`,
          text,
          votes: [],
        })),
      },
    });

    onClose();
    setQuestion('');
    setOptions(['', '']);
  };

  const isValid = question.trim().length > 0 && options.filter(o => o.trim().length > 0).length >= 2;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="bg-[#202c33] max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-[#313d45] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="h-14 px-6 bg-[#202c33] border-b border-[#313d45] flex items-center justify-between">
          <h3 className="text-lg font-medium text-[#e9edef]">Create poll</h3>
          <button onClick={onClose} className="text-[#8696a0] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Question Input */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase text-[#00a884] font-semibold">Question</label>
            <input
              type="text"
              placeholder="Ask a question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="w-full bg-[#111b21] border border-[#313d45] rounded-lg px-4 py-2.5 text-white placeholder-[#8696a0] text-sm outline-none focus:border-[#00a884]"
              autoFocus
            />
          </div>

          {/* Options Inputs */}
          <div className="space-y-2">
            <label className="text-xs uppercase text-[#00a884] font-semibold">Options</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={e => handleOptionChange(idx, e.target.value)}
                  className="flex-1 bg-[#111b21] border border-[#313d45] rounded-lg px-4 py-2 text-white placeholder-[#8696a0] text-sm outline-none focus:border-[#00a884]"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="p-2 text-[#8696a0] hover:text-[#ea4335] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 12 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-2 text-sm text-[#00a884] hover:underline flex items-center space-x-1.5 cursor-pointer py-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add option</span>
              </button>
            )}
          </div>

          {/* Allow multiple answers checkbox */}
          <div className="pt-2 border-t border-[#313d45]">
            <label className="flex items-center space-x-3 text-sm text-[#e9edef] cursor-pointer">
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={e => setAllowMultiple(e.target.checked)}
                className="w-4 h-4 text-[#00a884] accent-[#00a884] cursor-pointer"
              />
              <span>Allow multiple answers</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
              isValid
                ? 'bg-[#00a884] hover:bg-[#008f70] text-[#111b21]'
                : 'bg-[#313d45] text-[#8696a0] cursor-not-allowed'
            }`}
          >
            Send Poll
          </button>
        </form>
      </div>
    </div>
  );
};
