import React, { useState, useEffect, useCallback, useRef } from 'react';

// Simplified word search generator
const generateGrid = (words: string[], size: number) => {  
    let grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const directions = [[0, 1], [1, 0]]; // Horizontal, Vertical

    const placeWord = (word: string): boolean => {
        const wordArr = word.toUpperCase().split('');
        const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];
        let attempts = 0;
        
        while(attempts < 50) {
            attempts++;
            const r = Math.floor(Math.random() * size);
            const c = Math.floor(Math.random() * size);
            
            if (r + dr * word.length > size || c + dc * word.length > size) continue;

            let canPlace = true;
            for(let i = 0; i < word.length; i++) {
                if(grid[r + dr * i][c + dc * i] !== '' && grid[r + dr * i][c + dc * i] !== wordArr[i]) {
                    canPlace = false;
                    break;
                }
            }
            if(canPlace) {
                for(let i = 0; i < word.length; i++) {
                    grid[r + dr * i][c + dc * i] = wordArr[i];
                }
                return true;
            }
        }
        return false;
    }

    words.forEach(word => {
        placeWord(word);
    });

    // Fill empty cells
    for(let r = 0; r < size; r++) {
        for(let c = 0; c < size; c++) {
            if(grid[r][c] === '') {
                grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
    return grid;
}

interface WordSearchProps {
    words: string[];
    gridSize: number;
    onComplete: () => void;
}

const WordSearch: React.FC<WordSearchProps> = ({ words, gridSize, onComplete }) => {
    const [grid, setGrid] = useState<string[][]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [selection, setSelection] = useState<{ r: number; c: number }[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    
    const isCompleted = foundWords.length === words.length;
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setGrid(generateGrid(words, gridSize));
    }, [words, gridSize]);

    useEffect(() => {
        if (isCompleted) {
            setTimeout(onComplete, 1000);
        }
    }, [isCompleted, onComplete]);
    
    const checkSelection = () => {
        if (selection.length < 2) return;
        let selectedWord = selection.map(pos => grid[pos.r][pos.c]).join('');
        let reversedWord = selectedWord.split('').reverse().join('');
        
        const upperWords = words.map(w => w.toUpperCase());
        
        if (upperWords.includes(selectedWord) && !foundWords.includes(selectedWord)) {
            setFoundWords(prev => [...prev, selectedWord]);
        } else if (upperWords.includes(reversedWord) && !foundWords.includes(reversedWord)) {
            setFoundWords(prev => [...prev, reversedWord]);
        }
    };
    
    const handleMouseDown = (r: number, c: number) => {
        if (isCompleted) return;
        setIsSelecting(true);
        setSelection([{ r, c }]);
    };

    const handleMouseEnter = (r: number, c: number) => {
        if (!isSelecting || isCompleted) return;
        // Simple straight line logic
        const start = selection[0];
        const newSelection = [start];
        const dr = Math.sign(r - start.r);
        const dc = Math.sign(c - start.c);

        if (dr !== 0 && dc !== 0) return; // Only horizontal/vertical for simplicity

        let currR = start.r + dr;
        let currC = start.c + dc;
        while(currR !== r + dr || currC !== c + dc) {
            newSelection.push({r: currR, c: currC});
            currR += dr;
            currC += dc;
        }
        setSelection(newSelection);
    };

    const handleMouseUp = () => {
        if (!isSelecting || isCompleted) return;
        checkSelection();
        setIsSelecting(false);
        setSelection([]);
    };
    
    const isCellSelected = (r: number, c: number) => selection.some(pos => pos.r === r && pos.c === c);
    const isCellFound = (r: number, c: number) => {
        // This is inefficient but works for small grids. A better way would be to store found cells.
        // For now, let's keep it simple and not highlight found words in the grid to avoid complexity.
        return false;
    }

    if (grid.length === 0) return <p>Gerando caça-palavras...</p>;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div>
                <div 
                  ref={gridRef}
                  className="grid bg-amazon-dark/50 p-2 rounded-lg shadow-inner"
                  style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, userSelect: 'none' }}
                >
                    {grid.map((row, r) =>
                        row.map((cell, c) => (
                            <div
                                key={`${r}-${c}`}
                                onMouseDown={() => handleMouseDown(r, c)}
                                onMouseEnter={() => handleMouseEnter(r, c)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-lg cursor-pointer transition-colors ${isCellSelected(r, c) ? 'bg-amazon-accent text-amazon-dark rounded-md' : ''}`}
                            >
                                {cell}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="p-4 bg-amazon-dark/30 rounded-lg w-full md:w-48">
                <h3 className="font-bold text-lg mb-2 text-center text-amazon-light">Palavras</h3>
                <ul>
                    {words.map(word => (
                        <li key={word} className={`text-center transition-colors duration-500 ${foundWords.includes(word.toUpperCase()) ? 'line-through text-green-400' : 'text-white'}`}>
                            {word}
                        </li>
                    ))}
                </ul>
                {isCompleted && <p className="text-center text-amazon-accent font-bold mt-4">Concluído!</p>}
            </div>
        </div>
    );
};

export default WordSearch;