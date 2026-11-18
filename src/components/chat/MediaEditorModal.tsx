import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Undo2,
  Redo2,
  Crop,
  Wand2,
  Pen,
  Type,
  Square,
  Grid,
  Smile,
  Sticker as StickerIcon,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Download,
  Trash2,
  Send,
  Plus,
  Search,
  Circle,
  Minus,
  ArrowUpRight,
} from 'lucide-react';

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  font: string;
  hasBg: boolean;
}

interface ShapeOverlay {
  id: string;
  type: 'rect' | 'circle' | 'line' | 'arrow';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface StampOverlay {
  id: string;
  char: string;
  x: number;
  y: number;
  size: number;
}

interface MediaEditorModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onSend: (data: { mediaUrl: string; caption?: string; isViewOnce: boolean }) => void;
}

const FILTERS = [
  { name: 'None', css: 'none' },
  { name: 'Pop', css: 'contrast(1.3) saturate(1.4)' },
  { name: 'B&W', css: 'grayscale(100%) contrast(1.15)' },
  { name: 'Cool', css: 'hue-rotate(180deg) saturate(1.2)' },
  { name: 'Chrome', css: 'contrast(1.45) saturate(0.85)' },
  { name: 'Film', css: 'sepia(0.35) contrast(1.2) brightness(0.95)' },
];

const PALETTE = [
  '#ffffff',
  '#000000',
  '#00ffff',
  '#25d366',
  '#a855f7',
  '#f97316',
  '#ef4444',
  '#eab308',
];

const EMOJI_CATEGORIES = [
  { id: 'recent', label: '🕒', list: ['😍', '💦', '🥵', '😘', '🔥', '✨', '😂', '👍'] },
  { id: 'smileys', label: '😀', list: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'] },
  { id: 'animals', label: '🐻', list: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌'] },
  { id: 'food', label: '🍔', list: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🌽', '🌶️', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🍜', '🍣', '🍦'] },
  { id: 'activity', label: '⚽', list: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🎱', '🏓', '🏸', '🥅', '🥊', '🥋', '⛳', '🎯', '🎮', '🎲', '🧩', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️'] },
  { id: 'travel', label: '🚗', list: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🏍️', '🚲', '🛴', '🚨', '🚔', '✈️', '🚀', '🛸', '🚁', '⛵', '🚢'] },
  { id: 'objects', label: '💡', list: ['💡', '🔦', '🏮', '🪔', '📱', '💻', '🖥️', '🖨️', '⌨️', '📷', '📸', '📹', '🎥', '📞', '📻', '🎙️', '⏱️', '⏰', '⏳', '🔋', '🔌', '💎', '🔑', '🔒', '📦'] },
];

const STICKER_TABS = [
  { id: 'love', name: 'LOVE', stickers: ['❤️', '💖', '💘', '💕', '💌', '😍', '🥰', '😘'] },
  { id: 'greetings', name: 'GREETINGS', stickers: ['👋', '🙏', '🤝', '🙌', '✨', '🎉', '🎊', '🎁'] },
  { id: 'happy', name: 'HAPPY', stickers: ['😄', '🥳', '🌟', '💃', '🕺', '🍻', '🎈', '🤩'] },
  { id: 'sad', name: 'SAD', stickers: ['😢', '😭', '🥺', '💔', '🌧️', '🥀', '😿', '😞'] },
  { id: 'angry', name: 'ANGRY', stickers: ['😡', '🤬', '👿', '😤', '💢', '💥', '🔥', '😠'] },
  { id: 'celebration', name: 'CELEBRATION', stickers: ['🎉', '🎂', '🍾', '🥂', '🎆', '🎇', '🍰', '🎈'] },
];

export const MediaEditorModal: React.FC<MediaEditorModalProps> = ({
  isOpen,
  imageUrl,
  onClose,
  onSend,
}) => {
  const [currentTool, setCurrentTool] = useState<
    'none' | 'crop' | 'filter' | 'pen' | 'text' | 'shapes' | 'blur' | 'emoji' | 'sticker'
  >('none');

  const [caption, setCaption] = useState('');
  const [isViewOnce, setIsViewOnce] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('None');
  const [currentColor, setCurrentColor] = useState('#25d366');
  const [brushSize, setBrushSize] = useState(4);
  const [isHD, setIsHD] = useState(false);

  // Text overlay state
  const [texts, setTexts] = useState<TextOverlay[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState<'Sans Serif' | 'Serif' | 'Monospace'>('Sans Serif');
  const [textHasBg, setTextHasBg] = useState(true);

  // Shape overlay state
  const [shapes, setShapes] = useState<ShapeOverlay[]>([]);
  const [showShapesPopover, setShowShapesPopover] = useState(false);

  // Blur overlay state
  const [blurBox, setBlurBox] = useState<{ x: number; y: number; width: number; height: number; amount: number } | null>(null);

  // Emojis and stickers placed on image
  const [stamps, setStamps] = useState<StampOverlay[]>([]);
  const [showEmojiPopover, setShowEmojiPopover] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('recent');

  const [showStickerPopover, setShowStickerPopover] = useState(false);
  const [activeStickerTab, setActiveStickerTab] = useState('love');
  const [stickerSearch, setStickerSearch] = useState('');

  // Pen freehand canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentTool('none');
      setCaption('');
      setIsViewOnce(false);
      setRotation(0);
      setSelectedFilter('None');
      setTexts([]);
      setShapes([]);
      setBlurBox(null);
      setStamps([]);
      setShowShapesPopover(false);
      setShowEmojiPopover(false);
      setShowStickerPopover(false);
    }
  }, [isOpen, imageUrl]);

  if (!isOpen) return null;

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool !== 'pen') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history
    setDrawingHistory(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool !== 'pen') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (currentTool === 'pen' && drawingHistory.length > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const last = drawingHistory[drawingHistory.length - 1];
      ctx.putImageData(last, 0, 0);
      setDrawingHistory(prev => prev.slice(0, -1));
    } else if (texts.length > 0) {
      setTexts(prev => prev.slice(0, -1));
    } else if (shapes.length > 0) {
      setShapes(prev => prev.slice(0, -1));
    } else if (stamps.length > 0) {
      setStamps(prev => prev.slice(0, -1));
    }
  };

  const handleAddText = () => {
    const id = `txt_${Date.now()}`;
    const newText: TextOverlay = {
      id,
      text: 'Type text',
      x: 50,
      y: 50,
      color: currentColor,
      font: fontFamily,
      hasBg: textHasBg,
    };
    setTexts(prev => [...prev, newText]);
    setActiveTextId(id);
    setCurrentTool('text');
  };

  const handleAddShape = (type: 'rect' | 'circle' | 'line' | 'arrow') => {
    const id = `shape_${Date.now()}`;
    const newShape: ShapeOverlay = {
      id,
      type,
      x: 40,
      y: 40,
      width: 120,
      height: 80,
      color: currentColor,
    };
    setShapes(prev => [...prev, newShape]);
    setShowShapesPopover(false);
    setCurrentTool('shapes');
  };

  const handleAddBlur = () => {
    if (!blurBox) {
      setBlurBox({ x: 30, y: 30, width: 160, height: 90, amount: 50 });
    }
    setCurrentTool('blur');
  };

  const handleAddEmoji = (emoji: string) => {
    const id = `stamp_${Date.now()}`;
    setStamps(prev => [...prev, { id, char: emoji, x: 50, y: 50, size: 48 }]);
    setShowEmojiPopover(false);
    setShowStickerPopover(false);
  };

  // Build final edited image
  const handleFinalSend = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const offscreen = document.createElement('canvas');
      const is90or270 = rotation % 180 !== 0;
      offscreen.width = is90or270 ? img.height : img.width;
      offscreen.height = is90or270 ? img.width : img.height;
      const ctx = offscreen.getContext('2d');
      if (!ctx) {
        onSend({ mediaUrl: imageUrl, caption: caption.trim() || undefined, isViewOnce });
        return;
      }

      ctx.save();
      // Apply rotation
      ctx.translate(offscreen.width / 2, offscreen.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      // Apply filter
      if (selectedFilter !== 'None') {
        const filterObj = FILTERS.find(f => f.name === selectedFilter);
        if (filterObj && filterObj.css !== 'none') {
          ctx.filter = filterObj.css;
          ctx.drawImage(offscreen, 0, 0);
          ctx.filter = 'none';
        }
      }

      // Draw freehand drawing overlay
      if (canvasRef.current) {
        ctx.drawImage(canvasRef.current, 0, 0, offscreen.width, offscreen.height);
      }

      // Draw text overlays
      for (const t of texts) {
        ctx.save();
        ctx.font = `bold 28px ${t.font === 'Serif' ? 'serif' : t.font === 'Monospace' ? 'monospace' : 'sans-serif'}`;
        const scaleX = offscreen.width / 400;
        const scaleY = offscreen.height / 400;
        const px = (t.x / 100) * offscreen.width;
        const py = (t.y / 100) * offscreen.height;

        if (t.hasBg) {
          const metrics = ctx.measureText(t.text);
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(px - 10 * scaleX, py - 26 * scaleY, metrics.width + 20 * scaleX, 36 * scaleY);
        }
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, px, py);
        ctx.restore();
      }

      // Draw shapes
      for (const s of shapes) {
        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 4;
        const px = (s.x / 100) * offscreen.width;
        const py = (s.y / 100) * offscreen.height;
        const pw = (s.width / 100) * offscreen.width;
        const ph = (s.height / 100) * offscreen.height;

        if (s.type === 'rect') {
          ctx.strokeRect(px, py, pw, ph);
        } else if (s.type === 'circle') {
          ctx.beginPath();
          ctx.ellipse(px + pw / 2, py + ph / 2, pw / 2, ph / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (s.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + pw, py + ph);
          ctx.stroke();
        } else if (s.type === 'arrow') {
          ctx.beginPath();
          ctx.moveTo(px, py + ph);
          ctx.lineTo(px + pw, py);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw stamps (emojis & stickers)
      for (const st of stamps) {
        ctx.save();
        ctx.font = '40px sans-serif';
        const px = (st.x / 100) * offscreen.width;
        const py = (st.y / 100) * offscreen.height;
        ctx.fillText(st.char, px, py);
        ctx.restore();
      }

      const finalUrl = offscreen.toDataURL('image/jpeg', isHD ? 0.95 : 0.85);
      onSend({
        mediaUrl: finalUrl,
        caption: caption.trim() || undefined,
        isViewOnce,
      });
      onClose();
    };
    img.src = imageUrl;
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `whatsapp_edited_${Date.now()}.jpg`;
    a.click();
  };

  const activeFilterStyle = FILTERS.find(f => f.name === selectedFilter)?.css || 'none';

  return (
    <div className="fixed inset-0 z-50 bg-[#0c1317] flex flex-col justify-between select-none animate-in fade-in duration-150">
      {/* Top Navigation Bar */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#222d34] bg-[#111b21] shrink-0 text-[#aebac1]">
        {/* Left: Close */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onClose}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={handleUndo}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleUndo}
            className="p-1 hover:text-white transition-colors cursor-pointer opacity-50"
            title="Redo"
          >
            <Redo2 className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Editing Tools */}
        <div className="flex items-center space-x-4">
          {/* Crop Tool */}
          <button
            onClick={() => setCurrentTool(currentTool === 'crop' ? 'none' : 'crop')}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              currentTool === 'crop' ? 'text-[#00a884] ring-2 ring-[#00a884]' : 'hover:text-white'
            }`}
            title="Crop & rotate"
          >
            <Crop className="w-5 h-5" />
          </button>

          {/* Filter Tool */}
          <button
            onClick={() => setCurrentTool(currentTool === 'filter' ? 'none' : 'filter')}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              currentTool === 'filter' ? 'text-[#00a884] ring-2 ring-[#00a884]' : 'hover:text-white'
            }`}
            title="Filter"
          >
            <Wand2 className="w-5 h-5" />
          </button>

          {/* Paint Tool */}
          <button
            onClick={() => setCurrentTool(currentTool === 'pen' ? 'none' : 'pen')}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              currentTool === 'pen' ? 'text-[#00a884] ring-2 ring-[#00a884]' : 'hover:text-white'
            }`}
            title="Draw"
          >
            <Pen className="w-5 h-5" />
          </button>

          {/* Text Tool */}
          <button
            onClick={() => {
              if (currentTool === 'text') {
                setCurrentTool('none');
              } else {
                handleAddText();
              }
            }}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              currentTool === 'text' ? 'text-[#00a884] ring-2 ring-[#00a884]' : 'hover:text-white'
            }`}
            title="Add text"
          >
            <Type className="w-5 h-5 font-bold" />
          </button>

          {/* Shapes Tool */}
          <div className="relative">
            <button
              onClick={() => setShowShapesPopover(!showShapesPopover)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                showShapesPopover || currentTool === 'shapes' ? 'text-[#00a884] ring-2 ring-[#00a884]' : 'hover:text-white'
              }`}
              title="Add shapes"
            >
              <Square className="w-5 h-5" />
            </button>

            {showShapesPopover && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#233138] rounded-xl shadow-2xl p-2 flex space-x-2 border border-[#313d45]">
                <button
                  onClick={() => handleAddShape('rect')}
                  className="p-2 hover:bg-[#182229] rounded text-white cursor-pointer"
                  title="Rectangle"
                >
                  <Square className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleAddShape('circle')}
                  className="p-2 hover:bg-[#182229] rounded text-white cursor-pointer"
                  title="Circle"
                >
                  <Circle className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleAddShape('line')}
                  className="p-2 hover:bg-[#182229] rounded text-white cursor-pointer"
                  title="Line"
                >
                  <Minus className="w-6 h-6 rotate-45" />
                </button>
                <button
                  onClick={() => handleAddShape('arrow')}
                  className="p-2 hover:bg-[#182229] rounded text-white cursor-pointer"
                  title="Arrow"
                >
                  <ArrowUpRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          {/* Blur / Pixelate Tool */}
          <button
            onClick={handleAddBlur}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              currentTool === 'blur' ? 'text-[#00a884] ring-2 ring-[#00a884]' : 'hover:text-white'
            }`}
            title="Blur / Pixelate"
          >
            <Grid className="w-5 h-5" />
          </button>

          {/* Emoji Tool */}
          <div className="relative">
            <button
              onClick={() => {
                setShowEmojiPopover(!showEmojiPopover);
                setShowStickerPopover(false);
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                showEmojiPopover ? 'text-[#00a884] ring-2 ring-[#00a884]' : 'hover:text-white'
              }`}
              title="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            {showEmojiPopover && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#233138] rounded-2xl shadow-2xl w-80 p-3 border border-[#313d45] animate-in zoom-in-95 duration-100">
                {/* Category tabs */}
                <div className="flex items-center justify-between pb-2 border-b border-[#313d45] text-base">
                  {EMOJI_CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setActiveEmojiCategory(c.id)}
                      className={`p-1 rounded cursor-pointer ${activeEmojiCategory === c.id ? 'bg-[#00a884]/20 scale-110' : 'hover:opacity-80'}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                {/* Search */}
                <div className="my-2 flex items-center bg-[#111b21] rounded-lg px-2.5 py-1 text-xs">
                  <Search className="w-3.5 h-3.5 text-[#8696a0] mr-2" />
                  <input
                    type="text"
                    placeholder="Search emoji"
                    value={emojiSearch}
                    onChange={e => setEmojiSearch(e.target.value)}
                    className="bg-transparent flex-1 text-white outline-none"
                  />
                </div>
                {/* Emojis Grid */}
                <div className="grid grid-cols-7 gap-1.5 max-h-48 overflow-y-auto pt-1">
                  {(EMOJI_CATEGORIES.find(c => c.id === activeEmojiCategory)?.list || []).map((em, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddEmoji(em)}
                      className="text-2xl hover:scale-125 transition-transform p-1 cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticker Tool */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStickerPopover(!showStickerPopover);
                setShowEmojiPopover(false);
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                showStickerPopover ? 'text-[#00a884] ring-2 ring-[#00a884]' : 'hover:text-white'
              }`}
              title="Add sticker"
            >
              <StickerIcon className="w-5 h-5" />
            </button>

            {showStickerPopover && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#233138] rounded-2xl shadow-2xl w-84 p-3 border border-[#313d45] animate-in zoom-in-95 duration-100">
                {/* Category tabs */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#313d45] text-xs scrollbar-none">
                  {STICKER_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveStickerTab(tab.id)}
                      className={`px-2 py-1 rounded-full font-medium whitespace-nowrap cursor-pointer ${
                        activeStickerTab === tab.id ? 'bg-[#00a884] text-[#111b21]' : 'text-[#8696a0] hover:text-white'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
                {/* Search */}
                <div className="my-2 flex items-center bg-[#111b21] rounded-lg px-2.5 py-1 text-xs">
                  <Search className="w-3.5 h-3.5 text-[#8696a0] mr-2" />
                  <input
                    type="text"
                    placeholder="Search via WhatsApp sticker store"
                    value={stickerSearch}
                    onChange={e => setStickerSearch(e.target.value)}
                    className="bg-transparent flex-1 text-white outline-none"
                  />
                </div>
                {/* Stickers Grid */}
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                  {(STICKER_TABS.find(t => t.id === activeStickerTab)?.stickers || []).map((stk, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddEmoji(stk)}
                      className="text-4xl p-2 hover:scale-110 hover:bg-[#182229] rounded-xl transition-all cursor-pointer flex items-center justify-center"
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Tools: HD, Download, Done */}
        <div className="flex items-center space-x-3">
          {currentTool !== 'none' ? (
            <button
              onClick={() => setCurrentTool('none')}
              className="px-3 py-1 bg-[#00a884] text-[#111b21] font-semibold text-sm rounded-lg hover:bg-[#008f70] transition-colors cursor-pointer"
            >
              Done
            </button>
          ) : (
            <>
              {/* HD Toggle */}
              <button
                onClick={() => setIsHD(!isHD)}
                className={`px-2 py-0.5 rounded text-xs font-bold border transition-colors cursor-pointer ${
                  isHD ? 'border-[#00a884] text-[#00a884]' : 'border-[#8696a0] text-[#8696a0] hover:text-white'
                }`}
                title="Toggle HD quality"
              >
                HD
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden p-6">
        <div
          className="relative max-h-[70vh] max-w-[85vw] flex items-center justify-center transition-transform duration-200"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Base Image */}
          <img
            src={imageUrl}
            alt="Editing"
            className="max-h-[65vh] max-w-[80vw] object-contain rounded-md shadow-2xl transition-all pointer-events-none select-none"
            style={{ filter: activeFilterStyle }}
          />

          {/* Drawing Canvas Overlay */}
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`absolute inset-0 w-full h-full ${
              currentTool === 'pen' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
            }`}
          />

          {/* Blur Box Overlay */}
          {blurBox && (
            <div
              className="absolute border-2 border-[#00a884] rounded overflow-hidden cursor-move backdrop-blur-md"
              style={{
                left: `${blurBox.x}%`,
                top: `${blurBox.y}%`,
                width: `${blurBox.width}px`,
                height: `${blurBox.height}px`,
                backdropFilter: `blur(${Math.max(blurBox.amount / 5, 4)}px)`,
              }}
            >
              <div className="absolute inset-0 bg-white/10" />
            </div>
          )}

          {/* Placed Shape Overlays */}
          {shapes.map(s => (
            <div
              key={s.id}
              className="absolute pointer-events-none"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.width}px`,
                height: `${s.height}px`,
                border: s.type === 'rect' ? `3px solid ${s.color}` : undefined,
                borderRadius: s.type === 'circle' ? '50%' : undefined,
                borderColor: s.color,
                borderWidth: s.type === 'circle' ? '3px' : undefined,
              }}
            >
              {s.type === 'line' && (
                <div className="w-full h-1 bg-current" style={{ color: s.color }} />
              )}
              {s.type === 'arrow' && (
                <ArrowUpRight className="w-full h-full stroke-[3]" style={{ color: s.color }} />
              )}
            </div>
          ))}

          {/* Placed Text Overlays */}
          {texts.map(t => (
            <div
              key={t.id}
              onClick={() => setActiveTextId(t.id)}
              className={`absolute cursor-pointer p-1.5 rounded transition-all select-none ${
                activeTextId === t.id ? 'ring-2 ring-[#00a884]' : ''
              } ${t.hasBg ? 'bg-black/60' : ''}`}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                color: t.color,
                fontFamily: t.font === 'Serif' ? 'serif' : t.font === 'Monospace' ? 'monospace' : 'sans-serif',
              }}
            >
              <input
                type="text"
                value={t.text}
                onChange={e => {
                  const val = e.target.value;
                  setTexts(prev => prev.map(item => (item.id === t.id ? { ...item, text: val } : item)));
                }}
                className="bg-transparent text-xl font-bold outline-none text-center"
              />
            </div>
          ))}

          {/* Placed Stamp Overlays */}
          {stamps.map(st => (
            <div
              key={st.id}
              className="absolute cursor-move text-4xl select-none"
              style={{ left: `${st.x}%`, top: `${st.y}%` }}
            >
              {st.char}
            </div>
          ))}
        </div>
      </div>

      {/* Sub-tool Control Bars */}
      {/* 1. Crop Sub-tool Controls */}
      {currentTool === 'crop' && (
        <div className="flex items-center justify-center space-x-8 py-3 bg-[#111b21] border-t border-[#222d34] text-[#aebac1]">
          <button
            onClick={() => setRotation(r => (r - 90 + 360) % 360)}
            className="flex items-center space-x-2 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-sm">Rotate Left</span>
          </button>
          <button
            onClick={() => setRotation(r => (r + 90) % 360)}
            className="flex items-center space-x-2 hover:text-white cursor-pointer"
          >
            <RotateCw className="w-5 h-5" />
            <span className="text-sm">Rotate Right</span>
          </button>
          <button
            onClick={() => setRotation(0)}
            className="flex items-center space-x-2 hover:text-white cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </button>
        </div>
      )}

      {/* 2. Filter Sub-tool Controls */}
      {currentTool === 'filter' && (
        <div className="flex items-center justify-center space-x-4 py-3 bg-[#111b21] border-t border-[#222d34] overflow-x-auto">
          {FILTERS.map(f => (
            <div
              key={f.name}
              onClick={() => setSelectedFilter(f.name)}
              className="flex flex-col items-center space-y-1.5 cursor-pointer group"
            >
              <div
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedFilter === f.name ? 'border-[#00a884] scale-105' : 'border-transparent group-hover:border-white/50'
                }`}
              >
                <img
                  src={imageUrl}
                  alt={f.name}
                  className="w-full h-full object-cover"
                  style={{ filter: f.css }}
                />
              </div>
              <span
                className={`text-xs ${
                  selectedFilter === f.name ? 'text-[#00a884] font-bold' : 'text-[#8696a0] group-hover:text-white'
                }`}
              >
                {f.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 3. Pen Color Palette Controls */}
      {currentTool === 'pen' && (
        <div className="flex items-center justify-center space-x-4 py-3 bg-[#111b21] border-t border-[#222d34]">
          <div className="flex items-center space-x-2.5">
            {PALETTE.map(c => (
              <button
                key={c}
                onClick={() => setCurrentColor(c)}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                  currentColor === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="h-5 w-px bg-[#313d45] mx-2" />
          <div className="flex items-center space-x-2">
            {[2, 4, 8].map(sz => (
              <button
                key={sz}
                onClick={() => setBrushSize(sz)}
                className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${
                  brushSize === sz ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <div
                  className="rounded-full bg-white"
                  style={{ width: `${sz * 2}px`, height: `${sz * 2}px` }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Text Controls */}
      {currentTool === 'text' && (
        <div className="flex items-center justify-center space-x-4 py-3 bg-[#111b21] border-t border-[#222d34] text-xs text-white">
          <div className="flex items-center space-x-2">
            {PALETTE.map(c => (
              <button
                key={c}
                onClick={() => {
                  setCurrentColor(c);
                  if (activeTextId) {
                    setTexts(prev => prev.map(t => (t.id === activeTextId ? { ...t, color: c } : t)));
                  }
                }}
                className={`w-5 h-5 rounded-full cursor-pointer ${currentColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="h-5 w-px bg-[#313d45]" />
          <select
            value={fontFamily}
            onChange={e => {
              const val = e.target.value as any;
              setFontFamily(val);
              if (activeTextId) {
                setTexts(prev => prev.map(t => (t.id === activeTextId ? { ...t, font: val } : t)));
              }
            }}
            className="bg-[#202c33] text-white px-2 py-1 rounded outline-none border border-[#313d45]"
          >
            <option value="Sans Serif">Sans Serif</option>
            <option value="Serif">Serif</option>
            <option value="Monospace">Monospace</option>
          </select>
          <button
            onClick={() => {
              const next = !textHasBg;
              setTextHasBg(next);
              if (activeTextId) {
                setTexts(prev => prev.map(t => (t.id === activeTextId ? { ...t, hasBg: next } : t)));
              }
            }}
            className={`px-2.5 py-1 rounded border cursor-pointer ${
              textHasBg ? 'bg-[#00a884] text-[#111b21] border-[#00a884]' : 'border-[#8696a0] text-[#8696a0]'
            }`}
          >
            Background
          </button>
          {activeTextId && (
            <button
              onClick={() => {
                setTexts(prev => prev.filter(t => t.id !== activeTextId));
                setActiveTextId(null);
              }}
              className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 5. Blur Controls */}
      {currentTool === 'blur' && blurBox && (
        <div className="flex items-center justify-center space-x-6 py-3 bg-[#111b21] border-t border-[#222d34] text-xs text-[#aebac1]">
          <Grid className="w-4 h-4 text-[#00a884]" />
          <input
            type="range"
            min="10"
            max="100"
            value={blurBox.amount}
            onChange={e => setBlurBox({ ...blurBox, amount: Number(e.target.value) })}
            className="w-48 accent-[#00a884] cursor-pointer"
          />
          <span className="font-mono text-white">{blurBox.amount}</span>
          <button
            onClick={() => {
              setBlurBox(null);
              setCurrentTool('none');
            }}
            className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Bar: Thumbnail + Caption Input + View Once + Send */}
      <div className="p-4 bg-[#111b21] border-t border-[#222d34] flex flex-col space-y-3 shrink-0">
        <div className="flex items-center space-x-3">
          {/* Thumbnail Carousel */}
          <div className="flex items-center space-x-2 mr-2">
            <div className="w-12 h-12 rounded-lg border-2 border-[#00a884] overflow-hidden">
              <img src={imageUrl} alt="thumb" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => alert('Add more photos')}
              className="w-12 h-12 rounded-lg border border-[#313d45] flex items-center justify-center text-[#8696a0] hover:text-white hover:border-white transition-colors cursor-pointer"
              title="Add more"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Caption Input */}
          <div className="flex-1 flex items-center bg-[#202c33] rounded-lg px-3 py-2 border border-transparent focus-within:border-[#00a884]">
            <input
              type="text"
              placeholder="Type a message"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFinalSend();
                }
              }}
              className="bg-transparent flex-1 text-white placeholder-[#8696a0] text-sm outline-none"
            />
            <button
              onClick={() => setShowEmojiPopover(!showEmojiPopover)}
              className="text-[#8696a0] hover:text-white p-1 cursor-pointer ml-1"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* View Once Toggle Button (Screenshot 7: circular 1 icon) */}
          <button
            onClick={() => setIsViewOnce(!isViewOnce)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
              isViewOnce
                ? 'border-2 border-[#00a884] text-[#00a884] bg-[#00a884]/15'
                : 'border border-dashed border-[#8696a0] text-[#8696a0] hover:text-white hover:border-white'
            }`}
            title={isViewOnce ? 'View once photo activated' : 'Set to view once'}
          >
            1
          </button>

          {/* Send Button (Green circle with arrow) */}
          <button
            onClick={handleFinalSend}
            className="w-11 h-11 rounded-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center transition-colors shadow-lg cursor-pointer shrink-0"
            title="Send"
          >
            <Send className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};