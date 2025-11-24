import React, { useState } from 'react';
import type { Guardian, LocalizedGameStage } from '../types';
import GuardianDetailView from './GuardianDetailView';
import { useLanguage } from '../LanguageContext';

interface GuardioesProps {
    pnBalance: number;
    unlockedGuardians: number[];
    unlockGuardian: (guardianId: number) => void;
    guardianProgress: { [key: number]: number };
    advanceGuardianStage: (guardianId: number, stage: number, points: number) => void;
}

const curupiraWordSets1 = [
    { pt: ['FOGO', 'MATA', 'PEGA', 'TRILHA'], en: ['FIRE', 'WOODS', 'TRAP', 'TRAIL'], es: ['FUEGO', 'BOSQUE', 'TRAMPA', 'SENDERO'] },
    { pt: ['ARVORE', 'RIO', 'FOLHA', 'RAIZ'], en: ['TREE', 'RIVER', 'LEAF', 'ROOT'], es: ['ARBOL', 'RIO', 'HOJA', 'RAIZ'] },
    { pt: ['GALHO', 'CIPO', 'MUSGO', 'PEDRA'], en: ['BRANCH', 'VINE', 'MOSS', 'STONE'], es: ['RAMA', 'LIANA', 'MUSGO', 'PIEDRA'] }
];

const curupiraWordSets2 = [
    { pt: ['ONÇA', 'MICO', 'TUCANO', 'BOTO'], en: ['JAGUAR', 'MONKEY', 'TOUCAN', 'DOLPHIN'], es: ['JAGUAR', 'MONO', 'TUCAN', 'DELFIN'] },
    { pt: ['JACARE', 'PACA', 'CORUJA', 'PIRANHA'], en: ['GATOR', 'PACA', 'OWL', 'PIRANHA'], es: ['CAIMAN', 'PACA', 'BUHO', 'PIRAÑA'] }
];

const curupiraWordSets3 = [
    { pt: ['CURUPIRA', 'IARA', 'SACI', 'BOITATA'], en: ['CURUPIRA', 'IARA', 'SACI', 'BOITATA'], es: ['CURUPIRA', 'IARA', 'SACI', 'BOITATA'] },
    { pt: ['MAPINGUARI', 'CAIPORA', 'MATINTA', 'COBRA'], en: ['MAPINGUARI', 'CAIPORA', 'MATINTA', 'SNAKE'], es: ['MAPINGUARI', 'CAIPORA', 'MATINTA', 'SERPIENTE'] }
];

const curupiraWordSets4 = [
    { pt: ['QUEIMADA', 'GARIMPO', 'POLUICAO', 'DESMATE'], en: ['WILDFIRE', 'MINING', 'POLLUTION', 'LOGGING'], es: ['INCENDIO', 'MINERIA', 'POLUCION', 'TALA'] },
    { pt: ['CAÇA', 'VENENO', 'INVASAO', 'MADEIRA'], en: ['HUNTING', 'POISON', 'INVASION', 'TIMBER'], es: ['CAZA', 'VENENO', 'INVASION', 'MADERA'] }
];

const termoWordsCurupira = [
    { word: { pt: 'VERDE', en: 'GREEN', es: 'VERDE' }, hint: { pt: 'A cor da esperança e da mata.', en: 'The color of hope and the forest.', es: 'El color de la esperanza y la selva.' } },
    { word: { pt: 'FLORA', en: 'FLORA', es: 'FLORA' }, hint: { pt: 'O reino vegetal.', en: 'The plant kingdom.', es: 'El reino vegetal.' } },
    { word: { pt: 'VITAL', en: 'VITAL', es: 'VITAL' }, hint: { pt: 'Essencial para a vida.', en: 'Essential for life.', es: 'Esencial para la vida.' } },
    { word: { pt: 'MUNDO', en: 'WORLD', es: 'MUNDO' }, hint: { pt: 'A floresta é o pulmão do...', en: 'The forest is the lung of the...', es: 'La selva es el pulmón del...' } },
    { word: { pt: 'AGUAS', en: 'WATER', es: 'AGUAS' }, hint: { pt: 'Essencial para todas as formas de vida.', en: 'Essential for all forms of life.', es: 'Esencial para todas las formas de vida.' } }
];

const termoWordsIaraStage4 = [
    { word: { pt: 'PEIXE', en: 'FISHY', es: 'PECES' }, hint: { pt: 'Habitante das águas com escamas.', en: 'Scaled inhabitant of the waters.', es: 'Habitante de las aguas con escamas.' } },
    { word: { pt: 'CANOA', en: 'CANOE', es: 'CANOA' }, hint: { pt: 'Um barco para navegar nos rios.', en: 'A boat to navigate the rivers.', es: 'Un barco para navegar en los ríos.' } },
    { word: { pt: 'CANTO', en: 'SONGS', es: 'CANTO' }, hint: { pt: 'A Iara usa para encantar.', en: 'Iara uses it to enchant.', es: 'Iara lo usa para encantar.' } },
    { word: { pt: 'MAGIA', en: 'MAGIC', es: 'MAGIA' }, hint: { pt: 'O que envolve as lendas.', en: 'What surrounds the legends.', es: 'Lo que rodea a las leyendas.' } },
    { word: { pt: 'CLARO', en: 'CLEAR', es: 'CLARO' }, hint: { pt: 'Como a água de um rio preservado.', en: 'Like the water of a preserved river.', es: 'Como el agua de un río preservado.' } }
];

const termoWordsIaraStage5 = [
    { word: { pt: 'FLUIR', en: 'FLOWS', es: 'FLUIR' }, hint: { pt: 'O movimento natural da água.', en: 'The natural movement of water.', es: 'El movimiento natural del agua.' } },
    { word: { pt: 'VIDAS', en: 'LIVES', es: 'VIDAS' }, hint: { pt: 'O que os rios abrigam.', en: 'What the rivers shelter.', es: 'Lo que albergan los ríos.' } },
    { word: { pt: 'SALVE', en: 'SAVED', es: 'SALVA' }, hint: { pt: 'Um pedido de ajuda para a natureza.', en: 'A call for help for nature.', es: 'Una llamada de ayuda para la naturaleza.' } },
    { word: { pt: 'PRAIA', en: 'BEACH', es: 'PLAYA' }, hint: { pt: 'A margem de areia de um rio ou mar.', en: 'The sandy edge of a river or sea.', es: 'La orilla de arena de un río o mar.' } },
    { word: { pt: 'CORAL', en: 'CORAL', es: 'CORAL' }, hint: { pt: 'Formação subaquática colorida.', en: 'Colorful underwater formation.', es: 'Formación submarina colorida.' } }
];

const termoWordsSumauma = [
    { word: { pt: 'VITAL', en: 'VITAL', es: 'VITAL' }, hint: { pt: 'A conexão entre as raízes é ... para o ecossistema.', en: 'The connection between the roots is ... for the ecosystem.', es: 'La conexión entre las raíces es ... para el ecosistema.' } },
    { word: { pt: 'FLORA', en: 'FLORA', es: 'FLORA' }, hint: { pt: 'O reino das plantas que a Sumaúma rege.', en: 'The plant kingdom that Sumaúma rules.', es: 'El reino vegetal que Samaúma rige.' } },
    { word: { pt: 'MAGIA', en: 'MAGIC', es: 'MAGIA' }, hint: { pt: 'A força ancestral da grande árvore.', en: 'The ancestral force of the great tree.', es: 'La fuerza ancestral del gran árbol.' } },
    { word: { pt: 'MUNDO', en: 'WORLD', es: 'MUNDO' }, hint: { pt: 'A Sumaúma é o centro do seu...', en: 'The Sumaúma is the center of its...', es: 'La Samaúma es el centro de su...' } },
    { word: { pt: 'NOBRE', en: 'NOBLE', es: 'NOBLE' }, hint: { pt: 'A natureza da Árvore da Vida.', en: 'The nature of the Tree of Life.', es: 'La naturaleza del Árbol de la Vida.' } }
];

const sumaumaWordSets1 = [
    { pt: ['RAIZES', 'TRONCO', 'GALHOS', 'FOLHAS'], en: ['ROOTS', 'TRUNK', 'BRANCHES', 'LEAVES'], es: ['RAICES', 'TRONCO', 'RAMAS', 'HOJAS'] },
    { pt: ['VIDA', 'CONEXAO', 'FLORESTA', 'GIGANTE'], en: ['LIFE', 'CONNECTION', 'FOREST', 'GIANT'], es: ['VIDA', 'CONEXION', 'SELVA', 'GIGANTE'] }
];

const sumaumaWordSets2 = [
    { pt: ['COPA', 'NUVENS', 'CEU', 'SOL'], en: ['CANOPY', 'CLOUDS', 'SKY', 'SUN'], es: ['COPA', 'NUBES', 'CIELO', 'SOL'] },
    { pt: ['CHUVA', 'NINHO', 'ORQUIDEA', 'CIPOS'], en: ['RAIN', 'NEST', 'ORCHID', 'VINES'], es: ['LLUVIA', 'NIDO', 'ORQUIDEA', 'LIANAS'] }
];

const curupiraActivities: LocalizedGameStage[] = [
    { stage: 1, type: 'wordsearch', title: {pt: 'Caça-Palavras da Trilha', en: 'Trail Word Search', es: 'Sopa de Letras del Sendero'}, instructions: {pt: 'Encontre as palavras que guiam pela mata.', en: 'Find the words that guide you through the woods.', es: 'Encuentra las palabras que te guían por el bosque.'}, data: { wordSets: curupiraWordSets1, size: 8 }, points: 15 },
    { stage: 2, type: 'wordsearch', title: {pt: 'Caça-Palavras: Animais', en: 'Word Search: Animals', es: 'Sopa de Letras: Animales'}, instructions: {pt: 'Encontre os nomes dos animais que o Curupira protege.', en: 'Find the names of the animals Curupira protects.', es: 'Encuentra los nombres de los animales que Curupira protege.'}, data: { wordSets: curupiraWordSets2, size: 10 }, points: 20 },
    { stage: 3, type: 'wordsearch', title: {pt: 'Caça-Palavras: Lendas', en: 'Word Search: Legends', es: 'Sopa de Letras: Leyendas'}, instructions: {pt: 'Descubra os seres místicos da floresta.', en: 'Discover the mystical beings of the forest.', es: 'Descubre los seres místicos del bosque.'}, data: { wordSets: curupiraWordSets3, size: 12 }, points: 25 },
    { stage: 4, type: 'wordsearch', title: {pt: 'Caça-Palavras: Ameaças', en: 'Word Search: Threats', es: 'Sopa de Letras: Amenazas'}, instructions: {pt: 'Encontre os perigos que a floresta enfrenta.', en: 'Find the dangers the forest faces.', es: 'Encuentra los peligros que enfrenta el bosque.'}, data: { wordSets: curupiraWordSets4, size: 12 }, points: 30 },
    { stage: 5, type: 'termo', title: {pt: 'A Palavra Secreta', en: 'The Secret Word', es: 'La Palabra Secreta'}, instructions: {pt: 'Adivinhe a palavra que representa a essência da floresta. Você tem 2 chances.', en: 'Guess the word that represents the essence of the forest. You have 2 chances.', es: 'Adivina la palabra que representa la esencia del bosque. Tienes 2 oportunidades.'}, data: { wordList: termoWordsCurupira }, points: 50 }
];

const iaraActivities: LocalizedGameStage[] = [
    { stage: 1, type: 'rivercleanup', title: {pt: 'Limpando as Margens', en: 'Cleaning the Banks', es: 'Limpiando las Orillas'}, instructions: {pt: 'Vamos começar! Arraste cada item para a lixeira correta.', en: 'Let\'s begin! Drag each item to the correct bin.', es: '¡Empecemos! Arrastra cada objeto a la papelera correcta.'}, data: {
        items: [
            { id: 1, name: 'Garrafa de Plástico', type: 'plastic' },
            { id: 2, name: 'Casca de Banana', type: 'organic' },
            { id: 3, name: 'Lata de Alumínio', type: 'metal' },
            { id: 4, name: 'Jornal Velho', type: 'paper' },
        ],
        tip: {pt: 'Os peixes precisam de água limpa para viver!', en: 'Fish need clean water to live!', es: '¡Los peces necesitan agua limpia para vivir!'}
    }, points: 15 },
    {
        stage: 2,
        type: 'interactiveQuiz',
        title: { pt: 'Quiz das Águas', en: 'Quiz of the Waters', es: 'Prueba de las Aguas' },
        instructions: { pt: 'Responda 3 perguntas corretamente para ajudar a Iara a limpar o rio. Se errar, uma nova pergunta aparecerá!', en: 'Answer 3 questions correctly to help Iara clean the river. If you get one wrong, a new question will appear!', es: 'Responde 3 preguntas correctamente para ayudar a Iara a limpiar el río. ¡Si te equivocas, aparecerá una nueva pregunta!' },
        data: {},
        points: 20
    },
    { 
        stage: 3, 
        type: 'wordScramble', 
        title: {pt: 'Mensagem das Águas', en: 'Message from the Waters', es: 'Mensaje de las Aguas'}, 
        instructions: {pt: 'As palavras da Iara foram misturadas pela correnteza. Ordene-as para ouvir seu conselho.', en: 'Iara\'s words were mixed by the current. Put them in order to hear her advice.', es: 'Las palabras de Iara fueron mezcladas por la corriente. Ordénalas para escuchar su consejo.'}, 
        data: { 
            sentence: {
                pt: 'O RIO AGRADECE A QUEM O PROTEGE',
                en: 'THE RIVER THANKS THOSE WHO PROTECT IT',
                es: 'EL RÍO AGRADECE A QUIEN LO PROTEGE'
            }
        }, 
        points: 25 
    },
    { 
        stage: 4, 
        type: 'termo', 
        title: {pt: 'O Enigma do Rio', en: 'The River\'s Riddle', es: 'El Enigma del Río'}, 
        instructions: {pt: 'Adivinhe a palavra secreta relacionada aos rios. Você tem 2 chances.', en: 'Guess the secret word related to the rivers. You have 2 chances.', es: 'Adivina la palabra secreta relacionada con los ríos. Tienes 2 oportunidades.'}, 
        data: { wordList: termoWordsIaraStage4 }, 
        points: 30 
    },
    {
        stage: 5, 
        type: 'termo', 
        title: {pt: 'A Palavra da Correnteza', en: 'The Current\'s Word', es: 'La Palabra de la Corriente'}, 
        instructions: {pt: 'Decifre a palavra final para provar sua conexão com as águas. Você tem 2 chances.', en: 'Decipher the final word to prove your connection with the waters. You have 2 chances.', es: 'Descifra la palabra final para demostrar tu conexión con las aguas. Tienes 2 oportunidades.'}, 
        data: { wordList: termoWordsIaraStage5 }, 
        points: 50
    }
];

const sumaumaActivities: LocalizedGameStage[] = [
    {
        stage: 1,
        type: 'wordsearch',
        title: {pt: 'As Palavras da Árvore', en: 'The Tree\'s Words', es: 'Las Palabras del Árbol'},
        instructions: {pt: 'Encontre as palavras que formam a Sumaúma.', en: 'Find the words that make up Sumaúma.', es: 'Encuentra las palabras que forman a Samaúma.'},
        points: 30,
        data: { wordSets: sumaumaWordSets1, size: 10 },
    },
    {
        stage: 2,
        type: 'wordsearch',
        title: {pt: 'Vida nas Alturas', en: 'Life in the Heights', es: 'Vida en las Alturas'},
        instructions: {pt: 'Descubra o que existe na copa da grande árvore.', en: 'Discover what exists in the canopy of the great tree.', es: 'Descubre qué existe en la copa del gran árbol.'},
        points: 35,
        data: { wordSets: sumaumaWordSets2, size: 10 },
    },
    {
        stage: 3,
        type: 'memory',
        title: {pt: 'Memória das Alturas', en: 'Memory of the Heights', es: 'Memoria de las Alturas'},
        instructions: {pt: 'Encontre os pares de seres que vivem na copa da grande árvore.', en: 'Find the pairs of beings that live in the canopy of the great tree.', es: 'Encuentra las parejas de seres que viven en la copa del gran árbol.'},
        points: 40,
        data: {
            words: { 
                pt: ['HARPIA', 'ARARA', 'BORBOLETA', 'ORQUÍDEA', 'MICO', 'TUCANO'], 
                en: ['HARPY', 'MACAW', 'BUTTERFLY', 'ORCHID', 'MONKEY', 'TOUCAN'], 
                es: ['HARPÍA', 'GUACAMAYO', 'MARIPOSA', 'ORQUÍDEA', 'MONO', 'TUCÁN']
            }
        },
    },
    { 
        stage: 4, 
        type: 'puzzle', 
        title: {pt: 'Raízes da Floresta', en: 'Forest Roots', es: 'Raíces del Bosque'}, 
        instructions: {pt: 'Arraste os pedaços de raízes para formar um caminho e reconectar a Sumaúma.', en: 'Drag the pieces of roots to form a path and reconnect Sumaúma.', es: 'Arrastra los pedazos de raíces para formar un camino y reconectar a Samaúma.'}, 
        data: { 
            grid: [4, 4],
            imageUrl: 'https://images.unsplash.com/photo-1550535424-b49c71936329?q=80&w=800&auto=format&fit=crop'
        }, 
        points: 50
    },
    {
        stage: 5,
        type: 'termo',
        title: {pt: 'Palavra da Vida', en: 'Word of Life', es: 'Palabra de Vida'},
        instructions: {pt: 'Adivinhe a palavra que sela sua conexão com a Sumaúma. Você tem 2 chances.', en: 'Guess the word that seals your connection with Sumaúma. You have 2 chances.', es: 'Adivina la palabra que sella tu conexión con Samaúma. Tienes 2 oportunidades.'},
        data: { wordList: termoWordsSumauma },
        points: 60
    }
];


export const guardiansData: Guardian[] = [
    {
        id: 1,
        name: { pt: 'Curupira', en: 'Curupira', es: 'Curupira' },
        description: { 
            pt: 'Protetor das matas e dos animais. Com seus cabelos de fogo e pés virados para trás, ele confunde caçadores e lenhadores mal-intencionados.',
            en: 'Protector of the forests and animals. With his fiery hair and backward feet, he confuses ill-intentioned hunters and loggers.',
            es: 'Protector de los bosques y los animales. Con su pelo de fuego y sus pies hacia atrás, confunde a los cazadores y leñadores malintencionados.'
        },
        image: 'https://static.nationalgeographicbrasil.com/files/styles/image_3200/public/curupira_cop_edit.webp?w=1600&h=1492',
        cost: 100,
        story: {
            pt: "Dizem na floresta que, certa vez, um caçador de pele rara entrou na mata sem pedir licença. Curupira, com seu assobio agudo, o fez andar em círculos. Suas pegadas ao contrário o levaram para o coração da mata, onde o caçador, perdido e assustado, aprendeu a respeitar a casa dos outros. Ele só encontrou o caminho de volta quando prometeu nunca mais caçar por ganância. A floresta, então, o perdoou.",
            en: "They say in the forest that once, a rare fur hunter entered the woods without asking permission. Curupira, with his sharp whistle, made him walk in circles. His backward footprints led him to the heart of the forest, where the hunter, lost and frightened, learned to respect the home of others. He only found his way back when he promised never to hunt for greed again. The forest then forgave him.",
            es: "Cuentan en la selva que una vez, un cazador de pieles raras entró en el bosque sin pedir permiso. Curupira, con su agudo silbido, le hizo andar en círculos. Sus huellas al revés lo llevaron al corazón de la selva, donde el cazador, perdido y asustado, aprendió a respetar el hogar de los demás. Solo encontró el camino de vuelta cuando prometió no volver a cazar por codicia. El bosque, entonces, lo perdonó."
        },
        activities: curupiraActivities,
        finalQuote: {
            pt: "A verdadeira riqueza não está no que se extrai da natureza, mas na sabedoria de viver em harmonia com ela.",
            en: "True wealth is not in what is extracted from nature, but in the wisdom of living in harmony with it.",
            es: "La verdadera riqueza no está en lo que se extrae de la naturaleza, sino en la sabiduría de vivir en armonía con ella."
        },
        finalReward: 50,
    },
    {
        id: 2,
        name: { pt: 'Iara, a Mãe d\'Água', en: 'Iara, the Mother of Waters', es: 'Iara, la Madre de las Aguas' },
        description: {
            pt: 'Guardiã dos rios e lagos. Seu canto hipnotizante protege as águas da poluição e da pesca predatória, mantendo o equilíbrio da vida aquática.',
            en: 'Guardian of the rivers and lakes. Her mesmerizing song protects the waters from pollution and predatory fishing, maintaining the balance of aquatic life.',
            es: 'Guardiana de los ríos y lagos. Su canto hipnótico protege las aguas de la contaminación y la pesca depredadora, manteniendo el equilibrio de la vida acuática.'
        },
        image: 'https://cdnb.artstation.com/p/assets/images/images/009/642/123/large/juliane-prenhacca-juneru-iara-a.jpg?1520104846',
        cost: 200,
        story: {
            pt: "As águas de um rio sagrado começaram a adoecer, envenenadas pelo mercúrio de um garimpo ilegal. Peixes morriam, e a vida ribeirinha sofria. Do fundo do rio, emergiu Iara. Seu canto não era de sedução, mas de lamento. A melodia triste ecoou por toda a mata, fazendo a terra tremer e a chuva cair forte, lavando o veneno e revelando os criminosos. O rio voltou a respirar, protegido pela sua Mãe.",
            en: "The waters of a sacred river began to sicken, poisoned by mercury from an illegal mine. Fish died, and river life suffered. From the bottom of the river, Iara emerged. Her song was not of seduction, but of lament. The sad melody echoed throughout the forest, making the earth tremble and the rain fall heavily, washing away the poison and exposing the criminals. The river began to breathe again, protected by its Mother.",
            es: "Las aguas de un río sagrado comenzaron a enfermar, envenenadas por el mercurio de una mina ilegal. Los peces morían y la vida ribereña sufría. Del fondo del río, emergió Iara. Su canto no era de seducción, sino de lamento. La triste melodía resonó por toda la selva, haciendo temblar la tierra y caer la lluvia con fuerza, lavando el veneno y revelando a los criminales. El río volvió a respirar, protegido por su Madre."
        },
        activities: iaraActivities,
        finalQuote: {
            pt: "A pureza de um rio reflete a consciência de quem vive em suas margens. Cuide das águas como cuida da sua própria vida.",
            en: "The purity of a river reflects the conscience of those who live on its banks. Take care of the waters as you take care of your own life.",
            es: "La pureza de un río refleja la conciencia de quienes viven en sus orillas. Cuida de las aguas como cuidas de tu propia vida."
        },
        finalReward: 50,
    },
    {
        id: 3,
        name: { pt: 'Sumaúma, a Árvore da Vida', en: 'Sumaúma, the Tree of Life', es: 'Sumaúma, el Árbol de la Vida' },
        description: {
            pt: 'Considerada a "mãe" de todas as árvores, esta gigante amazônica conecta o céu, a terra e o mundo subterrâneo, simbolizando a união de toda a vida.',
            en: 'Considered the "mother" of all trees, this Amazonian giant connects the sky, the earth, and the underworld, symbolizing the unity of all life.',
            es: 'Considerada la "madre" de todos los árboles, esta gigante amazónica conecta el cielo, la tierra y el inframundo, simbolizando la unión de toda la vida.'
        },
        image: 'https://i.pinimg.com/564x/7b/e1/c6/7be1c6ada672990d5fb19db731bc3f57.jpg',
        cost: 300,
        story: {
            pt: "A Sumaúma é a escada do mundo. Suas raízes buscam as histórias do passado no fundo da terra, e seus galhos mais altos tocam as estrelas para sonhar o futuro. Em uma época de seca, quando a floresta padecia, a grande árvore compartilhou a água guardada em seu tronco com todos os seres ao seu redor, salvando-os. Ela nos ensina que o maior poder é o de nutrir e conectar todos os seres.",
            en: "Sumaúma is the world's ladder. Its roots seek the stories of the past deep in the earth, and its highest branches touch the stars to dream of the future. In a time of drought, when the forest suffered, the great tree shared the water stored in its trunk with all beings around it, saving them. It teaches us that the greatest power is to nurture and connect all beings.",
            es: "Sumaúma es la escalera del mundo. Sus raíces buscan las historias del pasado en lo profundo de la tierra, y sus ramas más altas tocan las estrellas para soñar el futuro. En una época de sequía, cuando la selva padecía, el gran árbol compartió el agua guardada en su tronco con todos los seres a su alrededor, salvándolos. Nos enseña que el mayor poder es el de nutrir y conectar a todos los seres."
        },
        activities: sumaumaActivities,
        finalQuote: {
            pt: "Cada folha, cada raiz, cada ser está conectado. Proteger um é proteger a todos. Somos todos uma só floresta.",
            en: "Every leaf, every root, every being is connected. To protect one is to protect all. We are all one forest.",
            es: "Cada hoja, cada raíz, cada ser está conectado. Proteger a uno es proteger a todos. Todos somos una sola selva."
        },
        finalReward: 50,
    }
];

const Guardioes: React.FC<GuardioesProps> = ({ pnBalance, unlockedGuardians, unlockGuardian, guardianProgress, advanceGuardianStage }) => {
    const { t, language } = useLanguage();
    const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);

    const GuardianCard: React.FC<{ guardian: Guardian }> = ({ guardian }) => {
        const isUnlocked = unlockedGuardians.includes(guardian.id);
        const canUnlock = pnBalance >= guardian.cost;
        const progress = (guardianProgress[guardian.id] || 0) / guardian.activities.length * 100;
        
        return (
            <div className="bg-amazon-medium/50 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                <div className="relative">
                    <img src={guardian.image} alt={guardian.name[language]} className="w-full h-56 object-cover" />
                    {!isUnlocked && (
                         <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amazon-light mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                <div className="mt-2 bg-amazon-dark/50 px-3 py-1 rounded-full flex items-center gap-2 text-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amazon-accent"><path d="M11.68 1.5c-.32 0-.641.042-.951.125a9.011 9.011 0 0 0-6.195 4.331 9 9 0 0 0-.67 6.471 9.004 9.004 0 0 0 4.255 6.004A9.004 9.004 0 0 0 12 22.5a9.004 9.004 0 0 0 8.875-7.075 9 9 0 0 0-.67-6.471 9.011 9.011 0 0 0-6.195-4.331A8.913 8.913 0 0 0 12 4.5a13.682 13.682 0 0 1-1.218-4.992c.287-.008.576-.008.898-.008ZM19.5 12a7.5 7.5 0 0 1-15 0 7.478 7.478 0 0 1 .69-3.043 7.5 7.5 0 0 1 13.62 0A7.478 7.478 0 0 1 19.5 12Z" /></svg>
                                    <span className="font-bold text-white">{guardian.cost} PN</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-amazon-accent">{guardian.name[language]}</h3>
                    <p className="text-amazon-text/80 mt-1 flex-grow">{guardian.description[language]}</p>
                    {isUnlocked ? (
                         <div className="mt-4">
                            <div className="w-full bg-amazon-dark/50 rounded-full h-2.5">
                                <div className="bg-amazon-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <button onClick={() => setSelectedGuardian(guardian)} className="w-full mt-3 py-2 bg-amazon-accent text-amazon-dark font-bold rounded-lg hover:bg-white transition-colors">
                                {progress < 100 ? 'Continuar Jornada' : 'Rever Jornada'}
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => unlockGuardian(guardian.id)} 
                            disabled={!canUnlock}
                            className="w-full mt-4 py-2 bg-amazon-light text-amazon-dark font-bold rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed enabled:hover:bg-white"
                        >
                            {canUnlock ? 'Desbloquear Guardião' : 'PN Insuficiente'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    if (selectedGuardian) {
        return <GuardianDetailView 
                    guardian={selectedGuardian} 
                    onBack={() => setSelectedGuardian(null)}
                    userProgress={guardianProgress[selectedGuardian.id] || 0}
                    onStageComplete={advanceGuardianStage}
                />;
    }

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-amazon-accent">Guardiões da Amazônia</h2>
                <p className="text-lg max-w-3xl mx-auto mt-2">
                    Desbloqueie os guardiões lendários da floresta usando seus Pontos de Natureza (PN). Cada guardião oferece uma jornada única com desafios e histórias para ensinar sobre a importância da preservação.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guardiansData.map(g => (
                    <GuardianCard key={g.id} guardian={g} />
                ))}
            </div>
        </div>
    );
};

export default Guardioes;