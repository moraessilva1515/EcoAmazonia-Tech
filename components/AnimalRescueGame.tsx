import React, { useState, useEffect, useMemo } from 'react';

interface Animal {
    id: number;
    name: string;
    image: string;
    trashImage: string;
    rescued: boolean;
}

interface AnimalRescueGameProps {
    data: {
        animals: Omit<Animal, 'rescued'>[];
    };
    onComplete: () => void;
}

const AnimalRescueGame: React.FC<AnimalRescueGameProps> = ({ data, onComplete }) => {
    const [animals, setAnimals] = useState<Animal[]>(() => 
        data.animals.map(a => ({ ...a, rescued: false }))
    );

    const positions = useMemo(() => animals.map(() => ({
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 80}%`,
    })), [data.animals]);

    const rescuedCount = animals.filter(a => a.rescued).length;
    const totalAnimals = animals.length;

    useEffect(() => {
        if (rescuedCount === totalAnimals) {
            setTimeout(onComplete, 1000);
        }
    }, [rescuedCount, totalAnimals, onComplete]);

    const handleRescue = (id: number) => {
        setAnimals(prev =>
            prev.map(animal =>
                animal.id === id ? { ...animal, rescued: true } : animal
            )
        );
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] bg-blue-900/50 rounded-lg overflow-hidden shadow-inner mb-4 bg-blend-overlay" style={{backgroundImage: `url('https://images.unsplash.com/photo-1590023641240-34b7a7837012?q=80&w=800')`}}>
                {animals.map((animal, index) => (
                    <div
                        key={animal.id}
                        className="absolute w-24 h-24 sm:w-32 sm:h-32 transition-all duration-500"
                        style={{ ...positions[index], transform: animal.rescued ? 'scale(1.1)' : 'scale(1)' }}
                    >
                        <img src={animal.image} alt={animal.name} className={`w-full h-full object-contain transition-opacity duration-500 ${animal.rescued ? 'opacity-100' : 'opacity-70'}`} />
                        {!animal.rescued && (
                            <button
                                onClick={() => handleRescue(animal.id)}
                                className="absolute inset-0 cursor-pointer group"
                                aria-label={`Salvar ${animal.name}`}
                            >
                                <img
                                    src={animal.trashImage}
                                    alt="Lixo"
                                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 animate-pulse"
                                />
                            </button>
                        )}
                         {animal.rescued && (
                            <div className="absolute -top-2 -right-2 text-2xl animate-fade-in" style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) 1' }}>✨</div>
                         )}
                    </div>
                ))}
            </div>
            <div className="w-full p-2 bg-amazon-dark/30 rounded-full">
                <div 
                    className="h-4 bg-amazon-accent rounded-full transition-all duration-500"
                    style={{ width: `${(rescuedCount / totalAnimals) * 100}%` }}
                ></div>
            </div>
            <p className="mt-2 font-bold">{rescuedCount} / {totalAnimals} animais salvos!</p>
        </div>
    );
};

export default AnimalRescueGame;
