import React, { useState, useEffect, useMemo, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface Piece {
  id: number;
  dataUrl: string;
  correctIndex: number;
}

interface JigsawPuzzleProps {
  imageUrl: string;
  onComplete: () => void;
  grid: [number, number];
}

const JigsawPuzzle: React.FC<JigsawPuzzleProps> = ({ imageUrl, onComplete, grid }) => {
  const [rows, cols] = grid;
  const totalPieces = rows * cols;

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [slots, setSlots] = useState<(Piece | null)[]>(Array(totalPieces).fill(null));
  const [draggedPiece, setDraggedPiece] = useState<Piece | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shuffleArray = useCallback((array: Piece[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const pieceWidth = naturalWidth / cols;
      const pieceHeight = naturalHeight / rows;
      
      const newPieces: Piece[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
          ctx.drawImage(
            img,
            c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight,
            0, 0, pieceWidth, pieceHeight
          );
          
          const index = r * cols + c;
          newPieces.push({
            id: index,
            dataUrl: canvas.toDataURL(),
            correctIndex: index,
          });
        }
      }
      setPieces(shuffleArray(newPieces));
      setIsLoading(false);
    };
    img.onerror = () => {
        setError('Não foi possível carregar a imagem do quebra-cabeça. Verifique a conexão ou tente mais tarde.');
        setIsLoading(false);
    }
    img.src = imageUrl;
  }, [imageUrl, rows, cols, shuffleArray]);

  useEffect(() => {
    const isSolved = slots.every((p, i) => p?.correctIndex === i);
    if (isSolved && slots.length === totalPieces && pieces.length === 0) {
      setTimeout(() => onComplete(), 500); // Small delay for visual feedback
    }
  }, [slots, onComplete, totalPieces, pieces.length]);

  const handleDragStart = (piece: Piece) => {
    setDraggedPiece(piece);
  };

  const handleDrop = (slotIndex: number) => {
    if (!draggedPiece || slots[slotIndex]) return;

    setSlots(prevSlots => {
      const newSlots = [...prevSlots];
      newSlots[slotIndex] = draggedPiece;
      return newSlots;
    });

    setPieces(prevPieces => prevPieces.filter(p => p.id !== draggedPiece.id));
    setDraggedPiece(null);
  };

  const handleSlotClick = (slotIndex: number) => {
    const pieceInSlot = slots[slotIndex];
    if (!pieceInSlot || pieceInSlot.correctIndex === slotIndex) return;

    setSlots(prevSlots => {
        const newSlots = [...prevSlots];
        newSlots[slotIndex] = null;
        return newSlots;
    });

    setPieces(prevPieces => shuffleArray([...prevPieces, pieceInSlot]));
  };
  
  const isCorrect = (piece: Piece | null, index: number) => piece?.correctIndex === index;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /> <p className="ml-4">Montando o desafio...</p></div>;
  }
  
  if (error) {
    return <div className="text-red-400 text-center p-4 bg-red-900/30 rounded-lg">{error}</div>;
  }

  const isComplete = slots.every((p, i) => p?.correctIndex === i) && pieces.length === 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-center items-start w-full">
      <div
        className="grid border-2 border-amazon-dark rounded-lg overflow-hidden shadow-lg"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {slots.map((piece, i) => (
          <div
            key={i}
            onDrop={() => handleDrop(i)}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => handleSlotClick(i)}
            className={`aspect-square bg-amazon-dark/40 transition-all duration-300 ${!piece ? 'hover:bg-amazon-accent/20 cursor-pointer' : ''} ${piece && isCorrect(piece, i) ? 'border-2 border-green-500/50' : 'border-2 border-transparent'} ${piece && !isCorrect(piece, i) ? 'cursor-pointer' : ''}`}
            style={{width: `${Math.min(120, 400/cols)}px`}}
          >
            {piece && <img src={piece.dataUrl} alt={`piece ${i}`} className="w-full h-full object-cover" />}
          </div>
        ))}
      </div>
      <div className="p-4 bg-amazon-dark/30 rounded-lg max-w-full lg:max-w-xs w-full">
        <h3 className="text-center font-bold mb-2 text-amazon-light">Peças</h3>
        <div className="grid gap-2 max-h-80 overflow-y-auto p-2" style={{ gridTemplateColumns: `repeat(${Math.min(cols, 3)}, 1fr)`}}>
            {pieces.map(piece => (
            <div
                key={piece.id}
                draggable
                onDragStart={() => handleDragStart(piece)}
                className="cursor-grab active:cursor-grabbing hover:scale-110 hover:shadow-lg transition-transform"
            >
                <img src={piece.dataUrl} alt={`piece ${piece.id}`} />
            </div>
            ))}
        </div>
        {isComplete && <p className="text-center text-sm text-amazon-accent mt-2 font-bold">Quebra-cabeça completo!</p>}
      </div>
    </div>
  );
};

export default JigsawPuzzle;