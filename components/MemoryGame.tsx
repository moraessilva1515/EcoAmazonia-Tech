import React, { useState, useEffect, useMemo } from 'react';

interface Card {
  id: number;
  word: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  words: string[];
  onComplete: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ words, onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const initialCards = words
      .flatMap((word, index) => [
        { id: index * 2, word, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, word, isFlipped: false, isMatched: false },
      ])
      .sort(() => Math.random() - 0.5);
    setCards(initialCards);
  }, [words]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.word === secondCard.word) {
        // Match
        setCards(prevCards =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedIndices([]);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, index) =>
              index === firstIndex || index === secondIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);
  
  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(card => card.isMatched);
    if (allMatched) {
        setTimeout(onComplete, 1000);
    }
  }, [cards, onComplete]);


  const handleCardClick = (index: number) => {
    if (
      flippedIndices.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }
    
    setMoves(m => m + 1);

    setCards(prevCards =>
      prevCards.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedIndices(prev => [...prev, index]);
  };

  const gridSize = useMemo(() => {
    const totalCards = words.length * 2;
    if (totalCards <= 9) return 3;
    if (totalCards <= 12) return 4;
    if (totalCards <= 16) return 4;
    return 5;
  }, [words]);

  return (
    <div className="flex flex-col items-center">
        <div 
            className="grid gap-4 p-4 max-w-2xl mx-auto"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
            {cards.map((card, index) => (
            <div
                key={card.id}
                className="aspect-square perspective"
                onClick={() => handleCardClick(index)}
            >
                <div
                    className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}
                >
                    {/* Card Back */}
                    <div className="absolute w-full h-full backface-hidden bg-amazon-medium hover:bg-amazon-light rounded-lg flex items-center justify-center cursor-pointer shadow-lg border-4 border-amazon-light/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2 w-1/2 text-amazon-accent" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4 8a1 1 0 011 1v1a1 1 0 11-2 0V9a1 1 0 011-1zM9 15a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM15 8a1 1 0 011 1v1a1 1 0 11-2 0V9a1 1 0 011-1zM4.226 4.226a1 1 0 01.707 0l1.414 1.414a1 1 0 01-1.414 1.414L4.226 5.64A1 1 0 014.226 4.226zm11.314 0a1 1 0 010 .707l-1.414 1.414a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 01.707 0zM4.226 15.774a1 1 0 010-.707l1.414-1.414a1 1 0 111.414 1.414l-1.414 1.414a1 1 0 01-.707 0zm11.314 0a1 1 0 01-.707 0l-1.414-1.414a1 1 0 111.414-1.414l1.414 1.414a1 1 0 010 .707z" />
                        </svg>
                    </div>
                    {/* Card Front */}
                    <div className={`absolute w-full h-full backface-hidden rotate-y-180 bg-amazon-text rounded-lg flex items-center justify-center p-3 shadow-lg ${card.isMatched ? 'ring-4 ring-amazon-accent' : 'ring-4 ring-transparent'}`}>
                         <span className="text-amazon-dark font-bold text-center text-lg sm:text-xl md:text-2xl break-normal leading-normal">{card.word}</span>
                    </div>
                </div>
            </div>
            ))}
        </div>
        <div className="mt-4 text-lg font-bold">Movimentos: {Math.floor(moves/2)}</div>
    </div>
  );
};

export default MemoryGame;