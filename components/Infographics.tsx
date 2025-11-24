import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import type { LocalizedString } from '../types';

interface Infographic {
    id: number;
    enigmaticTitle: LocalizedString;
    fullTitle: LocalizedString;
    imageUrl: string;
    description: LocalizedString;
    icon: React.ReactNode;
    quiz: {
        question: LocalizedString;
        options: LocalizedString[];
        correctAnswerIndex: number;
    };
}

const infographicsData: Infographic[] = [
    {
        id: 1,
        enigmaticTitle: { pt: "O Ciclo Destrutivo", en: "The Destructive Cycle", es: "El Ciclo Destructivo" },
        fullTitle: { pt: "O Ciclo do Desmatamento", en: "The Deforestation Cycle", es: "El Ciclo de la Deforestación" },
        imageUrl: "https://images.unsplash.com/photo-1542856238-83b636271952?q=80&w=2070&auto=format&fit=crop",
        description: { 
            pt: "O desmatamento na Amazônia é um processo devastador que começa com a extração ilegal de madeira valiosa, seguida pela derrubada e queima da vegetação restante para abrir espaço, principalmente, para a pecuária e plantações de soja. Este ciclo libera toneladas de dióxido de carbono na atmosfera, intensificando o aquecimento global. Além disso, o solo exposto se torna pobre e suscetível à erosão, comprometendo a capacidade de regeneração da floresta e afetando diretamente o equilíbrio climático e o regime de chuvas em todo o continente.",
            en: "Deforestation in the Amazon is a devastating process that begins with the illegal extraction of valuable timber, followed by the clearing and burning of the remaining vegetation to make space, mainly for cattle ranching and soy plantations. This cycle releases tons of carbon dioxide into the atmosphere, intensifying global warming. Furthermore, the exposed soil becomes poor and susceptible to erosion, compromising the forest's regeneration capacity and directly affecting the climatic balance and rainfall patterns across the continent.",
            es: "La deforestación en la Amazonía es un proceso devastador que comienza con la extracción ilegal de madera valiosa, seguida de la tala y quema de la vegetación restante para dar paso, principalmente, a la ganadería y las plantaciones de soja. Este ciclo libera toneladas de dióxido de carbono a la atmósfera, intensificando el calentamiento global. Además, el suelo expuesto se empobrece y se vuelve susceptible a la erosión, comprometiendo la capacidad de regeneración de la selva y afectando directamente el equilibrio climático y el régimen de lluvias en todo el continente."
        },
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691V5.25a3.375 3.375 0 00-3.375-3.375h-1.5a3.375 3.375 0 00-3.375 3.375v3.182m5.745 0v3.182a3.375 3.375 0 01-3.375 3.375h-1.5a3.375 3.375 0 01-3.375-3.375V9.348m4.992 0h-4.992" />
            </svg>
        ),
        quiz: {
            question: { pt: "Qual é o principal motor do ciclo de desmatamento na Amazônia, após a extração de madeira?", en: "What is the main driver of the deforestation cycle in the Amazon after timber extraction?", es: "¿Cuál es el principal motor del ciclo de deforestación en la Amazonía, después de la extracción de madera?" },
            options: [
                { pt: "Turismo ecológico", en: "Ecotourism", es: "Turismo ecológico" },
                { pt: "Construção de hidrelétricas", en: "Hydroelectric dam construction", es: "Construcción de presas hidroeléctricas" },
                { pt: "Expansão da agropecuária", en: "Agricultural expansion", es: "Expansión de la agropecuaria" },
                { pt: "Projetos de reflorestamento", en: "Reforestation projects", es: "Proyectos de reforestación" }
            ],
            correctAnswerIndex: 2
        }
    },
    {
        id: 2,
        enigmaticTitle: { pt: "Rios que Voam", en: "Flying Rivers", es: "Ríos que Vuelan" },
        fullTitle: { pt: "A Importância dos Rios Voadores", en: "The Importance of Flying Rivers", es: "La Importancia de los Ríos Voladores" },
        imageUrl: "https://images.unsplash.com/photo-1532884141046-67a6e039b5b2?q=80&w=1935&auto=format&fit=crop",
        description: {
            pt: "Os 'rios voadores' são um fenômeno extraordinário onde a floresta amazônica atua como uma bomba d'água, liberando bilhões de litros de umidade na atmosfera através da transpiração das árvores. Essa massa de vapor é transportada pelos ventos, sendo fundamental para a distribuição de chuvas por vastas áreas da América do Sul, abastecendo reservatórios, irrigando lavouras e mantendo o equilíbrio climático. O desmatamento interrompe esse ciclo vital, ameaçando a segurança hídrica e alimentar de milhões de pessoas a milhares de quilômetros de distância.",
            en: "The 'flying rivers' are an extraordinary phenomenon where the Amazon rainforest acts as a water pump, releasing billions of liters of moisture into the atmosphere through tree transpiration. This vapor mass is transported by winds, being crucial for the distribution of rainfall over vast areas of South America, supplying reservoirs, irrigating crops, and maintaining climatic balance. Deforestation interrupts this vital cycle, threatening the water and food security of millions of people thousands of kilometers away.",
            es: "Los 'ríos voladores' son un fenómeno extraordinario donde la selva amazónica actúa como una bomba de agua, liberando miles de millones de litros de humedad a la atmósfera a través de la transpiración de los árboles. Esta masa de vapor es transportada por los vientos, siendo fundamental para la distribución de lluvias en vastas áreas de América del Sur, abasteciendo embalses, regando cultivos y manteniendo el equilibrio climático. La deforestación interrumpe este ciclo vital, amenazando la seguridad hídrica y alimentaria de millones de personas a miles de kilómetros de distancia."
        },
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
        ),
        quiz: {
            question: { pt: "O fenômeno dos 'rios voadores', essencial para as chuvas na América do Sul, é gerado principalmente por qual processo na Amazônia?", en: "The 'flying rivers' phenomenon, essential for rainfall in South America, is mainly generated by which process in the Amazon?", es: "El fenómeno de los 'ríos voladores', esencial para las lluvias en América del Sur, ¿es generado principalmente por qué proceso en la Amazonía?" },
            options: [
                { pt: "Ação dos ventos no Rio Amazonas", en: "Wind action on the Amazon River", es: "Acción de los vientos en el río Amazonas" },
                { pt: "Evaporação de lagos de hidrelétricas", en: "Evaporation from hydroelectric lakes", es: "Evaporación de los lagos de las presas hidroeléctricas" },
                { pt: "Transpiração das árvores da floresta", en: "Transpiration of forest trees", es: "Transpiración de los árboles de la selva" },
                { pt: "Derretimento de geleiras andinas", en: "Melting of Andean glaciers", es: "Derretimiento de los glaciares andinos" }
            ],
            correctAnswerIndex: 2
        }
    },
    {
        id: 3,
        enigmaticTitle: { pt: "A Teia da Vida", en: "The Web of Life", es: "La Red de la Vida" },
        fullTitle: { pt: "Biodiversidade em Risco", en: "Biodiversity at Risk", es: "Biodiversidad en Riesgo" },
        imageUrl: "https://images.unsplash.com/photo-1547382442-b69734139932?q=80&w=1974&auto=format&fit=crop",
        description: {
            pt: "A Amazônia é o maior santuário de biodiversidade do planeta, abrigando uma em cada dez espécies conhecidas. A destruição de seu habitat pelo desmatamento e pelas queimadas coloca em rota de extinção ícones como a onça-pintada, o boto-cor-de-rosa e incontáveis espécies de plantas, insetos e aves, muitas ainda nem catalogadas pela ciência. A perda de cada espécie causa um efeito cascata que desestabiliza todo o ecossistema, além de nos privar de potenciais curas, alimentos e soluções que essa 'biblioteca viva' poderia oferecer.",
            en: "The Amazon is the largest biodiversity sanctuary on the planet, home to one in ten known species. The destruction of its habitat by deforestation and fires puts icons like the jaguar, the pink river dolphin, and countless species of plants, insects, and birds on the path to extinction, many not yet cataloged by science. The loss of each species causes a cascade effect that destabilizes the entire ecosystem, besides depriving us of potential cures, foods, and solutions that this 'living library' could offer.",
            es: "La Amazonía es el mayor santuario de biodiversidad del planeta, albergando una de cada diez especies conocidas. La destrucción de su hábitat por la deforestación y los incendios pone en vías de extinción a iconos como el jaguar, el delfín rosado e innumerables especies de plantas, insectos y aves, muchas de ellas aún no catalogadas por la ciencia. La pérdida de cada especie provoca un efecto cascada que desestabiliza todo el ecosistema, además de privarnos de posibles curas, alimentos y soluciones que esta 'biblioteca viva' podría ofrecer."
        },
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18M16.5 3L21 7.5m0 0L16.5 12M21 7.5H3" />
            </svg>
        ),
        quiz: {
            question: { pt: "A perda de uma única espécie na Amazônia pode causar um 'efeito cascata'. O que isso significa?", en: "The loss of a single species in the Amazon can cause a 'cascade effect.' What does this mean?", es: "La pérdida de una sola especie en la Amazonía puede causar un 'efecto cascada'. ¿Qué significa esto?" },
            options: [
                { pt: "Aumenta a quantidade de cachoeiras", en: "It increases the number of waterfalls", es: "Aumenta la cantidad de cascadas" },
                { pt: "Desestabiliza todo o ecossistema interligado", en: "It destabilizes the entire interconnected ecosystem", es: "Desestabiliza todo el ecosistema interconectado" },
                { pt: "Atrai mais turistas para a região", en: "It attracts more tourists to the region", es: "Atrae a más turistas a la región" },
                { pt: "Melhora a qualidade da água dos rios", en: "It improves the water quality of the rivers", es: "Mejora la calidad del agua de los ríos" }
            ],
            correctAnswerIndex: 1
        }
    },
    {
        id: 4,
        enigmaticTitle: { pt: "A Floresta em Pé", en: "The Standing Forest", es: "La Selva en Pie" },
        fullTitle: { pt: "Preservação e Soluções Sustentáveis", en: "Preservation and Sustainable Solutions", es: "Preservación y Soluciones Sostenibles" },
        imageUrl: "https://images.unsplash.com/photo-1627492593633-8f0a0e8f484a?q=80&w=2070&auto=format&fit=crop",
        description: {
            pt: "Manter a floresta em pé é a solução mais inteligente. A bioeconomia surge como o caminho, valorizando produtos como açaí, castanha e óleos essenciais, que geram renda para as comunidades locais de forma sustentável. Outras soluções incluem o ecoturismo de base comunitária, que transforma a floresta em uma fonte de renda e orgulho, e o uso de tecnologia de ponta, como satélites e IA, para monitorar e combater o desmatamento. Essas estratégias unem o conhecimento ancestral dos povos da floresta com a inovação para criar um futuro próspero e verde.",
            en: "Keeping the forest standing is the smartest solution. The bioeconomy emerges as the way forward, valuing products like açaí, Brazil nuts, and essential oils, which generate income for local communities sustainably. Other solutions include community-based ecotourism, which turns the forest into a source of income and pride, and the use of cutting-edge technology, like satellites and AI, to monitor and combat deforestation. These strategies unite the ancestral knowledge of forest peoples with innovation to create a prosperous and green future.",
            es: "Mantener la selva en pie es la solución más inteligente. La bioeconomía surge como el camino, valorando productos como el açaí, la castaña y los aceites esenciales, que generan ingresos para las comunidades locales de forma sostenible. Otras soluciones incluyen el ecoturismo de base comunitaria, que transforma la selva en una fuente de ingresos y orgullo, y el uso de tecnología de punta, como satélites e IA, para monitorear y combatir la deforestación. Estas estrategias unen el conocimiento ancestral de los pueblos de la selva con la innovación para crear un futuro próspero y verde."
        },
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25" />
            </svg>
        ),
        quiz: {
            question: { pt: "Qual conceito econômico valoriza produtos como castanha e açaí para gerar renda e manter a floresta em pé?", en: "Which economic concept values products like Brazil nuts and açaí to generate income and keep the forest standing?", es: "¿Qué concepto económico valora productos como la castaña y el açaí para generar ingresos y mantener la selva en pie?" },
            options: [
                { pt: "Agroindústria extensiva", en: "Extensive agro-industry", es: "Agroindustria extensiva" },
                { pt: "Mineração sustentável", en: "Sustainable mining", es: "Minería sostenible" },
                { pt: "Bioeconomia", en: "Bioeconomy", es: "Bioeconomía" },
                { pt: "Extração de petróleo", en: "Oil extraction", es: "Extracción de petróleo" }
            ],
            correctAnswerIndex: 2
        }
    }
];

interface InfographicsProps {
    markInfographicAsViewed: (id: number) => void;
    viewedInfographics: number[];
}

const Infographics: React.FC<InfographicsProps> = ({ markInfographicAsViewed, viewedInfographics }) => {
    const { language, t } = useLanguage();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [answeredState, setAnsweredState] = useState<{ id: number; answerIndex: number } | null>(null);
    const selectedInfo = infographicsData.find(info => info.id === selectedId);

    const handleSelect = (id: number) => {
        setAnsweredState(null);
        setSelectedId(id);
    };

    const handleClose = () => {
        setSelectedId(null);
        setAnsweredState(null);
    }

    const handleAnswer = (optionIndex: number) => {
        if (!selectedInfo || answeredState) return;
        setAnsweredState({ id: selectedInfo.id, answerIndex: optionIndex });
        if (optionIndex === selectedInfo.quiz.correctAnswerIndex && !viewedInfographics.includes(selectedInfo.id)) {
            markInfographicAsViewed(selectedInfo.id);
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-amazon-accent">{t('infographics_title')}</h2>
                <p className="text-lg max-w-3xl mx-auto mt-2">
                    {t('infographics_subtitle')}
                </p>
            </div>

            {!selectedInfo ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {infographicsData.map((info) => (
                        <button
                            key={info.id}
                            onClick={() => handleSelect(info.id)}
                            className="relative aspect-square bg-amazon-medium/50 rounded-lg p-4 flex flex-col justify-center items-center text-center group hover:bg-amazon-medium transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl hover:shadow-amazon-accent/20"
                        >
                             {viewedInfographics.includes(info.id) && (
                                <div className="absolute top-2 right-2 bg-amazon-accent text-amazon-dark rounded-full p-1 z-10" title="PN coletado">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            <div className="text-amazon-accent group-hover:scale-110 transition-transform duration-300">
                                {info.icon}
                            </div>
                            <h3 className="text-md sm:text-lg font-bold text-white mt-4">{info.enigmaticTitle[language]}</h3>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="bg-amazon-medium/60 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden animate-fade-in max-w-5xl mx-auto">
                    <div className="relative">
                        <img src={selectedInfo.imageUrl} alt={selectedInfo.fullTitle[language]} className="w-full h-64 md:h-80 object-cover" />
                        <button onClick={handleClose} className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black transition-colors" aria-label="Fechar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-6 md:p-8">
                        <h3 className="text-3xl font-bold text-amazon-accent mb-3">{selectedInfo.fullTitle[language]}</h3>
                        <p className="text-amazon-text/90 text-lg">{selectedInfo.description[language]}</p>
                        
                        <div className="mt-8 bg-amazon-dark/40 p-5 rounded-lg">
                            <h4 className="text-xl font-bold text-amazon-accent mb-3">{t('infographics_quiz_title')}</h4>
                            <p className="mb-4 text-amazon-text/90">{selectedInfo.quiz.question[language]}</p>
                            <div className="space-y-3">
                                {selectedInfo.quiz.options.map((option, index) => {
                                    const isAnswered = !!answeredState;
                                    const isSelected = answeredState?.answerIndex === index;
                                    const isCorrect = index === selectedInfo.quiz.correctAnswerIndex;
                                    let buttonClass = 'bg-amazon-medium hover:bg-amazon-light/50';
                                    if(isAnswered) {
                                        if (isCorrect) buttonClass = 'bg-green-600 text-white';
                                        else if (isSelected) buttonClass = 'bg-red-600 text-white';
                                        else buttonClass = 'bg-amazon-medium/50 opacity-60';
                                    }

                                    return (
                                        <button
                                            key={option.pt}
                                            onClick={() => handleAnswer(index)}
                                            disabled={isAnswered || viewedInfographics.includes(selectedInfo.id)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${buttonClass}`}
                                        >
                                            {option[language]}
                                        </button>
                                    );
                                })}
                            </div>
                            {answeredState && (
                                <div className="mt-4 text-center font-bold animate-fade-in">
                                    {answeredState.answerIndex === selectedInfo.quiz.correctAnswerIndex 
                                        ? <p className="text-green-400">{t('infographics_correct_feedback')}</p>
                                        : <p className="text-red-400">{t('infographics_incorrect_feedback', selectedInfo.quiz.options[selectedInfo.quiz.correctAnswerIndex][language])}</p>
                                    }
                                </div>
                            )}
                             {viewedInfographics.includes(selectedInfo.id) && !answeredState && (
                                <div className="mt-4 text-center font-bold text-amazon-accent">
                                    {t('infographics_already_answered')}
                                </div>
                            )}
                        </div>

                         <button onClick={handleClose} className="mt-8 px-6 py-2 bg-amazon-accent text-amazon-dark font-bold rounded-lg hover:bg-white transition-colors">
                            {t('infographics_back_button')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Infographics;