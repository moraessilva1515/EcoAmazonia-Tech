import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import type { LocalizedString } from '../types';

interface SDGData {
  id: number;
  title: LocalizedString;
  riddle: LocalizedString;
  description: LocalizedString;
  amazon_connection: LocalizedString;
  color: string;
  quiz: {
      question: LocalizedString;
      options: LocalizedString[];
      correctAnswerIndex: number;
  };
}

const sdgData: SDGData[] = [
    { id: 1, color: "#e5243b", 
        title: { pt: "Erradicação da Pobreza", en: "No Poverty", es: "Fin de la Pobreza" }, 
        riddle: { pt: "Busco um mundo onde o prato cheio e o teto seguro não sejam privilégio, mas um direito de todos. Quem sou eu?", en: "I seek a world where a full plate and a safe roof are not a privilege, but a right for all. Who am I?", es: "Busco un mundo donde el plato lleno y el techo seguro no sean un privilegio, sino un derecho de todos. ¿Quién soy?" }, 
        description: { pt: "Acabar com a pobreza em todas as suas formas, em todos os lugares.", en: "End poverty in all its forms everywhere.", es: "Poner fin a la pobreza en todas sus formas en todo el mundo." },
        amazon_connection: { pt: "Na Amazônia, significa garantir que comunidades ribeirinhas e indígenas tenham acesso a recursos, terras e oportunidades, combatendo a exploração e promovendo a bioeconomia.", en: "In the Amazon, it means ensuring that riverine and indigenous communities have access to resources, land, and opportunities, combating exploitation and promoting the bioeconomy.", es: "En la Amazonía, significa garantizar que las comunidades ribereñas e indígenas tengan acceso a recursos, tierras y oportunidades, combatiendo la explotación y promoviendo la bioeconomía." }, 
        quiz: { 
            question: { pt: "Qual prática sustentável na Amazônia ajuda a erradicar a pobreza nas comunidades locais?", en: "Which sustainable practice in the Amazon helps eradicate poverty in local communities?", es: "¿Qué práctica sostenible en la Amazonía ayuda a erradicar la pobreza en las comunidades locales?" }, 
            options: [
                { pt: "Bioeconomia (açaí, castanha)", en: "Bioeconomy (açaí, Brazil nuts)", es: "Bioeconomía (açaí, castaña)" }, 
                { pt: "Mineração em larga escala", en: "Large-scale mining", es: "Minería a gran escala" }, 
                { pt: "Monocultura de soja", en: "Soy monoculture", es: "Monocultivo de soja" }
            ], 
            correctAnswerIndex: 0 
        } 
    },
    { id: 2, color: "#dda63a",
        title: { pt: "Fome Zero", en: "Zero Hunger", es: "Hambre Cero" },
        riddle: { pt: "Alimento o mundo com respeito à terra, garantindo que a semente de hoje seja a colheita farta de amanhã. Quem sou eu?", en: "I feed the world with respect for the land, ensuring that today's seed is tomorrow's bountiful harvest. Who am I?", es: "Alimento al mundo con respeto a la tierra, garantizando que la semilla de hoy sea la cosecha abundante de mañana. ¿Quién soy?" },
        description: { pt: "Acabar com a fome, alcançar a segurança alimentar e melhoria da nutrição e promover a agricultura sustentável.", en: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture.", es: "Poner fin al hambre, lograr la seguridad alimentaria y la mejora de la nutrición y promover la agricultura sostenible." },
        amazon_connection: { pt: "Promover sistemas agroflorestais e a valorização de produtos locais como açaí e castanha, combatendo o desmatamento para pastagens e monoculturas.", en: "Promote agroforestry systems and the valuation of local products like açaí and Brazil nuts, combating deforestation for pasture and monocultures.", es: "Promover sistemas agroforestales y la valorización de productos locales como el açaí y la castaña, combatiendo la deforestación para pastizales y monocultivos." },
        quiz: {
            question: { pt: "Para garantir a segurança alimentar na Amazônia, qual sistema de plantio é mais sustentável?", en: "To ensure food security in the Amazon, which planting system is more sustainable?", es: "Para garantizar la seguridad alimentaria en la Amazonía, ¿qué sistema de siembra es más sostenible?" },
            options: [
                { pt: "Agrofloresta", en: "Agroforestry", es: "Agroforestería" },
                { pt: "Queimadas para pasto", en: "Burning for pasture", es: "Quema para pastizales" },
                { pt: "Uso intensivo de agrotóxicos", en: "Intensive use of pesticides", es: "Uso intensivo de agrotóxicos" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 3, color: "#4c9f38",
        title: { pt: "Saúde e Bem-Estar", en: "Good Health and Well-being", es: "Salud y Bienestar" },
        riddle: { pt: "Cuido do corpo e da mente, pois uma vida saudável é a base para toda nação. Quem sou eu?", en: "I care for the body and mind, as a healthy life is the foundation for every nation. Who am I?", es: "Cuido del cuerpo y de la mente, pues una vida saludable es la base de toda nación. ¿Quién soy?" },
        description: { pt: "Assegurar uma vida saudável e promover o bem-estar para todos, em todas as idades.", en: "Ensure healthy lives and promote well-being for all at all ages.", es: "Garantizar una vida sana y promover el bienestar para todos en todas las edades." },
        amazon_connection: { pt: "Levar atendimento médico às comunidades isoladas, valorizar os conhecimentos tradicionais sobre plantas medicinais e combater doenças endêmicas como a malária.", en: "Provide medical care to isolated communities, value traditional knowledge of medicinal plants, and combat endemic diseases like malaria.", es: "Llevar atención médica a las comunidades aisladas, valorar los conocimientos tradicionales sobre plantas medicinales y combatir enfermedades endémicas como la malaria." },
        quiz: {
            question: { pt: "Qual é uma ameaça à saúde ribeirinha ligada a uma atividade ilegal?", en: "What is a threat to riverine health linked to an illegal activity?", es: "¿Cuál es una amenaza para la salud ribereña vinculada a una actividad ilegal?" },
            options: [
                { pt: "Poluição dos rios por mercúrio", en: "River pollution by mercury", es: "Contaminación de los ríos por mercurio" },
                { pt: "Ecoturismo", en: "Ecotourism", es: "Ecoturismo" },
                { pt: "Excesso de pesca", en: "Overfishing", es: "Sobrepesca" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 4, color: "#c5192d",
        title: { pt: "Educação de Qualidade", en: "Quality Education", es: "Educación de Calidad" },
        riddle: { pt: "Abro portas para o futuro com o poder do conhecimento. Quem sou eu?", en: "I open doors to the future with the power of knowledge. Who am I?", es: "Abro puertas al futuro con el poder del conocimiento. ¿Quién soy?" },
        description: { pt: "Assegurar a educação inclusiva e equitativa e de qualidade, e promover oportunidades de aprendizagem ao longo da vida para todos.", en: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.", es: "Garantizar una educación inclusiva, equitativa y de calidad y promover oportunidades de aprendizaje durante toda la vida para todos." },
        amazon_connection: { pt: "Garantir educação contextualizada para os povos da floresta, que valorize sua cultura e promova a ciência e a tecnologia para a conservação ambiental.", en: "Ensure contextualized education for forest peoples that values their culture and promotes science and technology for environmental conservation.", es: "Garantizar una educación contextualizada para los pueblos de la selva, que valore su cultura y promueva la ciencia y la tecnología para la conservación ambiental." },
        quiz: {
            question: { pt: "Uma educação de qualidade na Amazônia deve valorizar principalmente:", en: "Quality education in the Amazon should primarily value:", es: "Una educación de calidad en la Amazonía debe valorar principalmente:" },
            options: [
                { pt: "Cultura e conhecimento dos povos da floresta", en: "Culture and knowledge of forest peoples", es: "La cultura y el conocimiento de los pueblos de la selva" },
                { pt: "Apenas o ensino urbano tradicional", en: "Only traditional urban teaching", es: "Solo la enseñanza urbana tradicional" },
                { pt: "A exploração de recursos minerais", en: "The exploitation of mineral resources", es: "La explotación de recursos minerales" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 5, color: "#ff3a21",
        title: { pt: "Igualdade de Gênero", en: "Gender Equality", es: "Igualdad de Género" },
        riddle: { pt: "Luto para que filhas e mães tenham as mesmas oportunidades e vozes que filhos e pais. Quem sou eu?", en: "I fight so that daughters and mothers have the same opportunities and voices as sons and fathers. Who am I?", es: "Lucho para que las hijas y las madres tengan las mismas oportunidades y voces que los hijos y los padres. ¿Quién soy?" },
        description: { pt: "Alcançar a igualdade de gênero e empoderar todas as mulheres e meninas.", en: "Achieve gender equality and empower all women and girls.", es: "Lograr la igualdad entre los géneros y empoderar a todas las mujeres y las niñas." },
        amazon_connection: { pt: "Fortalecer o papel da mulher como guardiã da floresta e do conhecimento tradicional, garantindo sua participação em decisões e acesso a renda.", en: "Strengthen the role of women as guardians of the forest and traditional knowledge, ensuring their participation in decisions and access to income.", es: "Fortalecer el papel de la mujer como guardiana de la selva y del conocimiento tradicional, garantizando su participación en las decisiones y el acceso a los ingresos." },
        quiz: {
            question: { pt: "Qual o papel fundamental das mulheres na conservação da Amazônia?", en: "What is the fundamental role of women in Amazon conservation?", es: "¿Cuál es el papel fundamental de las mujeres en la conservación de la Amazonía?" },
            options: [
                { pt: "Guardiãs do conhecimento tradicional", en: "Guardians of traditional knowledge", es: "Guardianas del conocimiento tradicional" },
                { pt: "Apenas tarefas domésticas", en: "Only domestic chores", es: "Solo tareas domésticas" },
                { pt: "Trabalho em madeireiras", en: "Work in logging companies", es: "Trabajo en madereras" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 6, color: "#26bde2",
        title: { pt: "Água Potável e Saneamento", en: "Clean Water and Sanitation", es: "Agua Limpia y Saneamiento" },
        riddle: { pt: "Sou a fonte da vida, limpa e cristalina. Quem sou eu?", en: "I am the source of life, clean and crystal clear. Who am I?", es: "Soy la fuente de la vida, limpia y cristalina. ¿Quién soy?" },
        description: { pt: "Assegurar a disponibilidade e gestão sustentável da água e saneamento para todos.", en: "Ensure availability and sustainable management of water and sanitation for all.", es: "Garantizar la disponibilidad de agua y su gestión sostenible y el saneamiento para todos." },
        amazon_connection: { pt: "Proteger as nascentes e rios da poluição por mercúrio (garimpo) e esgoto, garantindo água limpa para as comunidades que dependem diretamente dos rios.", en: "Protect springs and rivers from pollution by mercury (mining) and sewage, ensuring clean water for communities that depend directly on the rivers.", es: "Proteger las nacientes y los ríos de la contaminación por mercurio (minería) y aguas residuales, garantizando agua limpia para las comunidades que dependen directamente de los ríos." },
        quiz: {
            question: { pt: "A proteção dos rios amazônicos é crucial para evitar a contaminação por:", en: "The protection of Amazonian rivers is crucial to avoid contamination by:", es: "La protección de los ríos amazónicos es crucial para evitar la contaminación por:" },
            options: [
                { pt: "Mercúrio do garimpo ilegal", en: "Mercury from illegal mining", es: "Mercurio de la minería ilegal" },
                { pt: "Salinidade excessiva", en: "Excessive salinity", es: "Salinidad excesiva" },
                { pt: "Plástico de recifes de coral", en: "Plastic from coral reefs", es: "Plástico de los arrecifes de coral" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 7, color: "#fcc30b",
        title: { pt: "Energia Limpa e Acessível", en: "Affordable and Clean Energy", es: "Energía Asequible y no Contaminante" },
        riddle: { pt: "Ilumino o mundo sem sujar o céu. Quem sou eu?", en: "I light up the world without dirtying the sky. Who am I?", es: "Ilumino el mundo sin ensuciar el cielo. ¿Quién soy?" },
        description: { pt: "Assegurar o acesso confiável, sustentável, moderno e a preço acessível à energia para todos.", en: "Ensure access to affordable, reliable, sustainable and modern energy for all.", es: "Garantizar el acceso a una energía asequible, segura, sostenible y moderna para todos." },
        amazon_connection: { pt: "Implementar soluções de energia solar em comunidades isoladas, reduzindo a dependência de geradores a diesel e o impacto de grandes hidrelétricas.", en: "Implement solar energy solutions in isolated communities, reducing dependence on diesel generators and the impact of large hydroelectric dams.", es: "Implementar soluciones de energía solar en comunidades aisladas, reduciendo la dependencia de generadores diésel y el impacto de grandes presas hidroeléctricas." },
        quiz: {
            question: { pt: "Qual fonte de energia é mais indicada para comunidades isoladas na Amazônia?", en: "Which energy source is most suitable for isolated communities in the Amazon?", es: "¿Qué fuente de energía es la más adecuada para las comunidades aisladas de la Amazonía?" },
            options: [
                { pt: "Energia Solar", en: "Solar Energy", es: "Energía Solar" },
                { pt: "Carvão Mineral", en: "Coal", es: "Carbón Mineral" },
                { pt: "Usinas Nucleares", en: "Nuclear Power Plants", es: "Centrales Nucleares" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 8, color: "#a21942",
        title: { pt: "Trabalho Decente", en: "Decent Work", es: "Trabajo Decente" },
        riddle: { pt: "Gero oportunidades justas, onde o suor é valorizado. Quem sou eu?", en: "I create fair opportunities, where sweat is valued. Who am I?", es: "Genero oportunidades justas, donde el sudor es valorado. ¿Quién soy?" },
        description: { pt: "Promover o crescimento econômico sustentado, inclusivo e sustentável, emprego pleno e produtivo e trabalho decente para todos.", en: "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.", es: "Promover el crecimiento económico sostenido, inclusivo y sostenible, el empleo pleno y productivo y el trabajo decente para todos." },
        amazon_connection: { pt: "Incentivar o ecoturismo, a bioeconomia e cadeias produtivas sustentáveis que mantenham a floresta em pé e gerem renda para a população local.", en: "Encourage ecotourism, the bioeconomy, and sustainable production chains that keep the forest standing and generate income for the local population.", es: "Fomentar el ecoturismo, la bioeconomía y las cadenas de producción sostenibles que mantengan la selva en pie y generen ingresos para la población local." },
        quiz: {
            question: { pt: "Qual modelo econômico gera trabalho decente e mantém a floresta em pé?", en: "Which economic model generates decent work and keeps the forest standing?", es: "¿Qué modelo económico genera trabajo decente y mantiene la selva en pie?" },
            options: [
                { pt: "Bioeconomia e ecoturismo", en: "Bioeconomy and ecotourism", es: "Bioeconomía y ecoturismo" },
                { pt: "Pecuária extensiva", en: "Extensive cattle ranching", es: "Ganadería extensiva" },
                { pt: "Indústria madeireira predatória", en: "Predatory logging industry", es: "Industria maderera depredadora" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 9, color: "#fd6925",
        title: { pt: "Inovação e Infraestrutura", en: "Innovation and Infrastructure", es: "Innovación e Infraestructura" },
        riddle: { pt: "Construo pontes para o futuro de forma sustentável. Quem sou eu?", en: "I build bridges to the future sustainably. Who am I?", es: "Construyo puentes hacia el futuro de forma sostenible. ¿Quién soy?" },
        description: { pt: "Construir infraestruturas resilientes, promover a industrialização inclusiva e sustentável e fomentar a inovação.", en: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.", es: "Construir infraestructuras resilientes, promover la industrialización inclusiva y sostenible y fomentar la innovación." },
        amazon_connection: { pt: "Desenvolver 'cidades da floresta' com infraestrutura verde, saneamento e tecnologia, além de bioindústrias que agreguem valor aos produtos amazônicos.", en: "Develop 'forest cities' with green infrastructure, sanitation, and technology, as well as bio-industries that add value to Amazonian products.", es: "Desarrollar 'ciudades de la selva' con infraestructura verde, saneamiento y tecnología, además de bioindustrias que agreguen valor a los productos amazónicos." },
        quiz: {
            question: { pt: "Infraestrutura sustentável na Amazônia inclui:", en: "Sustainable infrastructure in the Amazon includes:", es: "La infraestructura sostenible en la Amazonía incluye:" },
            options: [
                { pt: "Bioindústrias e saneamento ecológico", en: "Bio-industries and ecological sanitation", es: "Bioindustrias y saneamiento ecológico" },
                { pt: "Construção de mais estradas na mata", en: "Building more roads in the forest", es: "Construcción de más carreteras en la selva" },
                { pt: "Expansão urbana descontrolada", en: "Uncontrolled urban expansion", es: "Expansión urbana descontrolada" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 10, color: "#dd1367",
        title: { pt: "Redução das Desigualdades", en: "Reduced Inequalities", es: "Reducción de las Desigualdades" },
        riddle: { pt: "Busco um equilíbrio onde a balança da justiça pese igual para todos. Quem sou eu?", en: "I seek a balance where the scales of justice weigh equally for all. Who am I?", es: "Busco un equilibrio donde la balanza de la justicia pese igual para todos. ¿Quién soy?" },
        description: { pt: "Reduzir a desigualdade dentro dos países e entre eles.", en: "Reduce inequality within and among countries.", es: "Reducir la desigualdad en y entre los países." },
        amazon_connection: { pt: "Garantir que os benefícios da conservação e do desenvolvimento cheguem a todos, especialmente aos povos indígenas e comunidades tradicionais, historicamente marginalizados.", en: "Ensure that the benefits of conservation and development reach everyone, especially indigenous peoples and traditional communities, who have been historically marginalized.", es: "Garantizar que los beneficios de la conservación y el desarrollo lleguen a todos, especialmente a los pueblos indígenas y las comunidades tradicionales, históricamente marginados." },
        quiz: {
            question: { pt: "Para reduzir desigualdades na Amazônia, é essencial garantir:", en: "To reduce inequalities in the Amazon, it is essential to guarantee:", es: "Para reducir las desigualdades en la Amazonía, es esencial garantizar:" },
            options: [
                { pt: "Direitos territoriais aos povos indígenas", en: "Territorial rights for indigenous peoples", es: "Derechos territoriales para los pueblos indígenas" },
                { pt: "Incentivos para grandes corporações", en: "Incentives for large corporations", es: "Incentivos para las grandes corporaciones" },
                { pt: "Centralização de recursos nas capitais", en: "Centralization of resources in capitals", es: "Centralización de recursos en las capitales" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 11, color: "#fd9d24",
        title: { pt: "Cidades Sustentáveis", en: "Sustainable Cities", es: "Ciudades Sostenibles" },
        riddle: { pt: "Transformo espaços urbanos em lares verdes e seguros. Quem sou eu?", en: "I transform urban spaces into green and safe homes. Who am I?", es: "Transformo los espacios urbanos en hogares verdes y seguros. ¿Quién soy?" },
        description: { pt: "Tornar as cidades e os assentamentos humanos inclusivos, seguros, resilientes e sustentáveis.", en: "Make cities and human settlements inclusive, safe, resilient and sustainable.", es: "Lograr que las ciudades y los asentamientos humanos sean inclusivos, seguros, resilientes y sostenibles." },
        amazon_connection: { pt: "Planejar o crescimento de cidades como Manaus e Belém para reduzir o impacto na floresta, com mais áreas verdes, saneamento e transporte público de qualidade.", en: "Plan the growth of cities like Manaus and Belém to reduce the impact on the forest, with more green areas, sanitation, and quality public transport.", es: "Planificar el crecimiento de ciudades como Manaus y Belém para reducir el impacto en la selva, con más áreas verdes, saneamiento y transporte público de calidad." },
        quiz: {
            question: { pt: "O que caracteriza uma cidade sustentável na Amazônia?", en: "What characterizes a sustainable city in the Amazon?", es: "¿Qué caracteriza a una ciudad sostenible en la Amazonía?" },
            options: [
                { pt: "Planejamento urbano que protege a floresta", en: "Urban planning that protects the forest", es: "Planificación urbana que protege la selva" },
                { pt: "Crescimento ilimitado", en: "Unlimited growth", es: "Crecimiento ilimitado" },
                { pt: "Dependência de transporte individual", en: "Dependence on individual transport", es: "Dependencia del transporte individual" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 12, color: "#bf8b2e",
        title: { pt: "Consumo Responsável", en: "Responsible Consumption", es: "Consumo Responsable" },
        riddle: { pt: "Ensino a usar apenas o necessário e a pensar no amanhã. Quem sou eu?", en: "I teach to use only what is necessary and to think about tomorrow. Who am I?", es: "Enseño a usar solo lo necesario y a pensar en el mañana. ¿Quién soy?" },
        description: { pt: "Assegurar padrões de produção e de consumo sustentáveis.", en: "Ensure sustainable consumption and production patterns.", es: "Garantizar modalidades de consumo y producción sostenibles." },
        amazon_connection: { pt: "Combater o consumo de produtos ligados ao desmatamento (carne, soja, madeira ilegal) e incentivar a compra de produtos de origem sustentável e certificada.", en: "Combat the consumption of products linked to deforestation (meat, soy, illegal timber) and encourage the purchase of sustainably sourced and certified products.", es: "Combatir el consumo de productos vinculados a la deforestación (carne, soja, madera ilegal) y fomentar la compra de productos de origen sostenible y certificado." },
        quiz: {
            question: { pt: "Uma forma de consumo responsável ligada à Amazônia é:", en: "A form of responsible consumption linked to the Amazon is:", es: "Una forma de consumo responsable vinculada a la Amazonía es:" },
            options: [
                { pt: "Verificar a origem da carne e madeira", en: "Check the origin of meat and wood", es: "Verificar el origen de la carne y la madera" },
                { pt: "Comprar produtos importados", en: "Buy imported products", es: "Comprar productos importados" },
                { pt: "Priorizar embalagens plásticas", en: "Prioritize plastic packaging", es: "Priorizar los envases de plástico" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 13, color: "#3f7e44",
        title: { pt: "Ação Climática", en: "Climate Action", es: "Acción por el Clima" },
        riddle: { pt: "O planeta aquece e eu sou o chamado à ação. Quem sou eu?", en: "The planet is warming, and I am the call to action. Who am I?", es: "El planeta se calienta y yo soy el llamado a la acción. ¿Quién soy?" },
        description: { pt: "Tomar medidas urgentes para combater a mudança climática e seus impactos.", en: "Take urgent action to combat climate change and its impacts.", es: "Adoptar medidas urgentes para combatir el cambio climático y sus efectos." },
        amazon_connection: { pt: "A Amazônia é vital para regular o clima global. Combater o desmatamento e as queimadas é a principal ação para evitar a emissão de gases de efeito estufa e manter os 'rios voadores'.", en: "The Amazon is vital for regulating the global climate. Combating deforestation and fires is the main action to avoid greenhouse gas emissions and maintain the 'flying rivers'.", es: "La Amazonía es vital para regular el clima global. Combatir la deforestación y los incendios es la principal acción para evitar la emisión de gases de efecto invernadero y mantener los 'ríos voladores'." },
        quiz: {
            question: { pt: "Qual é a ação mais impactante para combater a mudança climática na Amazônia?", en: "What is the most impactful action to combat climate change in the Amazon?", es: "¿Cuál es la acción más impactante para combatir el cambio climático en la Amazonía?" },
            options: [
                { pt: "Combater o desmatamento e as queimadas", en: "Combat deforestation and fires", es: "Combatir la deforestación y los incendios" },
                { pt: "Aumentar o número de aeroportos", en: "Increase the number of airports", es: "Aumentar el número de aeropuertos" },
                { pt: "Incentivar o uso de ar condicionado", en: "Encourage the use of air conditioning", es: "Fomentar el uso de aire acondicionado" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 14, color: "#0a97d9",
        title: { pt: "Vida na Água", en: "Life Below Water", es: "Vida Submarina" },
        riddle: { pt: "Protejo os gigantes azuis do planeta. Quem sou eu?", en: "I protect the blue giants of the planet. Who am I?", es: "Protejo a los gigantes azules del planeta. ¿Quién soy?" },
        description: { pt: "Conservação e uso sustentável dos oceanos, dos mares e dos recursos marinhos para o desenvolvimento sustentável.", en: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development.", es: "Conservar y utilizar en forma sostenible los océanos, los mares y los recursos marinos para el desarrollo sostenible." },
        amazon_connection: { pt: "A bacia amazônica é o maior sistema fluvial do mundo. Proteger seus rios e peixes da poluição e da pesca predatória é crucial para a vida de milhões de pessoas e para o equilíbrio do oceano Atlântico.", en: "The Amazon basin is the world's largest river system. Protecting its rivers and fish from pollution and overfishing is crucial for the lives of millions of people and for the balance of the Atlantic Ocean.", es: "La cuenca del Amazonas es el sistema fluvial más grande del mundo. Proteger sus ríos y peces de la contaminación y la pesca depredadora es crucial para la vida de millones de personas y para el equilibrio del océano Atlántico." },
        quiz: {
            question: { pt: "A vida aquática na Amazônia depende da proteção contra:", en: "Aquatic life in the Amazon depends on protection from:", es: "La vida acuática en la Amazonía depende de la protección contra:" },
            options: [
                { pt: "Pesca predatória e poluição", en: "Overfishing and pollution", es: "La pesca depredadora y la contaminación" },
                { pt: "Construção de praias artificiais", en: "Construction of artificial beaches", es: "La construcción de playas artificiales" },
                { pt: "Navegação de pequenos barcos", en: "Navigation of small boats", es: "La navegación de pequeñas embarcaciones" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 15, color: "#56c02b",
        title: { pt: "Vida Terrestre", en: "Life on Land", es: "Vida de Ecosistemas Terrestres" },
        riddle: { pt: "Sou a guardiã das florestas e de todas as criaturas. Quem sou eu?", en: "I am the guardian of the forests and all creatures. Who am I?", es: "Soy la guardiana de los bosques y de todas las criaturas. ¿Quién soy?" },
        description: { pt: "Proteger, recuperar e promover o uso sustentável dos ecossistemas terrestres, gerir de forma sustentável as florestas, combater a desertificação, deter e reverter a degradação da terra e deter a perda de biodiversidade.", en: "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.", es: "Proteger, restablecer y promover el uso sostenible de los ecosistemas terrestres, gestionar los bosques de forma sostenible, luchar contra la desertificación, detener e invertir la degradación de las tierras y poner freno a la pérdida de la diversidad biológica." },
        amazon_connection: { pt: "Esta é a ODS mais diretamente ligada à Amazônia, o maior repositório de biodiversidade terrestre do mundo. O objetivo é desmatamento zero e a restauração de áreas degradadas.", en: "This is the SDG most directly linked to the Amazon, the world's largest repository of terrestrial biodiversity. The goal is zero deforestation and the restoration of degraded areas.", es: "Este es el ODS más directamente relacionado con la Amazonía, el mayor repositorio de biodiversidad terrestre del mundo. El objetivo es la deforestación cero y la restauración de las zonas degradadas." },
        quiz: {
            question: { pt: "Qual o objetivo principal desta ODS na Amazônia?", en: "What is the main objective of this SDG in the Amazon?", es: "¿Cuál es el objetivo principal de este ODS en la Amazonía?" },
            options: [
                { pt: "Desmatamento zero e restauração florestal", en: "Zero deforestation and forest restoration", es: "Deforestación cero y restauración forestal" },
                { pt: "Exploração de toda madeira disponível", en: "Exploitation of all available timber", es: "Explotación de toda la madera disponible" },
                { pt: "Introdução de espécies exóticas", en: "Introduction of exotic species", es: "Introducción de especies exóticas" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 16, color: "#00689d",
        title: { pt: "Paz, Justiça e Instituições", en: "Peace, Justice and Strong Institutions", es: "Paz, Justicia e Instituciones Sólidas" },
        riddle: { pt: "Construo sociedades pacíficas com leis que funcionam para todos. Quem sou eu?", en: "I build peaceful societies with laws that work for everyone. Who am I?", es: "Construyo sociedades pacíficas con leyes que funcionan para todos. ¿Quién soy?" },
        description: { pt: "Promover sociedades pacíficas e inclusivas para o desenvolvimento sustentável, proporcionar o acesso à justiça para todos e construir instituições eficazes, responsáveis e inclusivas em todos os níveis.", en: "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.", es: "Promover sociedades pacíficas e inclusivas para el desarrollo sostenible, facilitar el acceso a la justicia para todos y crear instituciones eficaces, responsables e inclusivas a todos los niveles." },
        amazon_connection: { pt: "Combater crimes ambientais como grilagem, desmatamento e garimpo ilegal, e proteger ativistas e povos indígenas de ameaças e violência.", en: "Combat environmental crimes such as land grabbing, deforestation, and illegal mining, and protect activists and indigenous peoples from threats and violence.", es: "Combatir los delitos ambientales como la apropiación ilegal de tierras, la deforestación y la minería ilegal, y proteger a los activistas y pueblos indígenas de las amenazas y la violencia." },
        quiz: {
            question: { pt: "Para alcançar a paz na Amazônia, é crucial combater:", en: "To achieve peace in the Amazon, it is crucial to combat:", es: "Para alcanzar la paz en la Amazonía, es crucial combatir:" },
            options: [
                { pt: "Crimes ambientais e a violência contra ativistas", en: "Environmental crimes and violence against activists", es: "Los delitos ambientales y la violencia contra los activistas" },
                { pt: "A criação de novas unidades de conservação", en: "The creation of new conservation units", es: "La creación de nuevas unidades de conservación" },
                { pt: "O turismo ecológico", en: "Ecotourism", es: "El turismo ecológico" }
            ],
            correctAnswerIndex: 0
        }
    },
    { id: 17, color: "#19486a",
        title: { pt: "Parcerias", en: "Partnerships", es: "Alianzas" },
        riddle: { pt: "Sozinho vou rápido, mas juntos vamos mais longe. Quem sou eu?", en: "Alone I go fast, but together we go further. Who am I?", es: "Solo voy rápido, pero juntos vamos más lejos. ¿Quién soy?" },
        description: { pt: "Fortalecer os meios de implementação e revitalizar a parceria global para o desenvolvimento sustentável.", en: "Strengthen the means of implementation and revitalize the global partnership for sustainable development.", es: "Fortalecer los medios de ejecución y revitalizar la Alianza Mundial para el Desarrollo Sostenible." },
        amazon_connection: { pt: "Articular governos, ONGs, empresas e comunidades locais em projetos de conservação e desenvolvimento, buscando financiamento internacional e cooperação tecnológica.", en: "Articulate governments, NGOs, companies, and local communities in conservation and development projects, seeking international funding and technological cooperation.", es: "Articular a los gobiernos, las ONG, las empresas y las comunidades locales en proyectos de conservación y desarrollo, buscando financiación internacional y cooperación tecnológica." },
        quiz: {
            question: { pt: "A proteção da Amazônia depende de parcerias entre:", en: "The protection of the Amazon depends on partnerships between:", es: "La protección de la Amazonía depende de alianzas entre:" },
            options: [
                { pt: "Governos, ONGs, empresas e comunidades", en: "Governments, NGOs, companies, and communities", es: "Gobiernos, ONG, empresas y comunidades" },
                { pt: "Apenas países amazônicos", en: "Only Amazonian countries", es: "Solo los países amazónicos" },
                { pt: "Apenas organizações internacionais", en: "Only international organizations", es: "Solo las organizaciones internacionales" }
            ],
            correctAnswerIndex: 0
        }
    }
];

interface ODSProps {
    completedOdsQuizzes: number[];
    completeOdsQuiz: (odsId: number, points: number) => void;
}

const SDGModal: React.FC<{ sdg: SDGData; onClose: () => void; onCorrectAnswer: (points: number) => void; isCompleted: boolean; }> = ({ sdg, onClose, onCorrectAnswer, isCompleted }) => {
    const { language, t } = useLanguage();
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [onClose]);

    const handleAnswer = (selectedIndex: number) => {
        if (answered || isCompleted) return;
        setSelectedAnswer(sdg.quiz.options[selectedIndex][language]);
        setAnswered(true);
        if(selectedIndex === sdg.quiz.correctAnswerIndex) {
            onCorrectAnswer(15);
        }
    }
  
    return (
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div 
            className="bg-amazon-dark rounded-lg shadow-2xl max-w-2xl w-full relative border-t-8"
            style={{ borderColor: sdg.color }}
            onClick={(e) => e.stopPropagation()}
        >
            <button onClick={onClose} className="absolute top-2 right-2 text-amazon-light hover:text-white" aria-label={t('ods_modal_close_label')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6 md:p-8">
                <h2 className="text-3xl font-bold mb-1" style={{ color: sdg.color }}>
                    ODS {sdg.id}: {sdg.title[language]}
                </h2>

                {(!answered && !isCompleted) ? (
                    <div className="mt-4">
                        <p className="font-bold text-lg text-amazon-accent mb-3">{sdg.quiz.question[language]}</p>
                        <div className="space-y-3">
                            {sdg.quiz.options.map((option, index) => (
                                <button key={option.pt} onClick={() => handleAnswer(index)} className="w-full text-left p-3 bg-amazon-medium hover:bg-amazon-light/50 rounded-lg transition-colors">
                                    {option[language]}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in mt-4">
                         {(answered || isCompleted) && (
                            <div className={`p-3 rounded-lg mb-4 ${selectedAnswer === sdg.quiz.options[sdg.quiz.correctAnswerIndex][language] || isCompleted ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                <p className="font-bold">
                                    {isCompleted && !answered ? t('ods_modal_already_correct') : ''}
                                    {answered && (selectedAnswer === sdg.quiz.options[sdg.quiz.correctAnswerIndex][language] ? t('ods_modal_correct_feedback') : t('ods_modal_incorrect_feedback'))}
                                </p>
                            </div>
                        )}
                        <p className="text-lg italic text-amazon-text/80 mb-4">{sdg.description[language]}</p>
                        <div className="bg-amazon-medium/50 p-4 rounded-md">
                            <h3 className="font-bold text-xl text-amazon-accent mb-2">{t('ods_modal_connection_title')}</h3>
                            <p className="text-amazon-text/90">{sdg.amazon_connection[language]}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
};
  
const SDGCard: React.FC<{ sdg: SDGData; onSelect: () => void; isCompleted: boolean }> = ({ sdg, onSelect, isCompleted }) => {
    const { language } = useLanguage();
    return (
        <button
        onClick={onSelect}
        className="relative aspect-square bg-amazon-medium/50 rounded-lg p-3 flex flex-col justify-center items-center text-center group hover:bg-amazon-medium transition-all duration-300 transform hover:-translate-y-1"
        style={{ '--sdg-color': sdg.color } as React.CSSProperties}
        >
        <div className="absolute inset-0 bg-[var(--sdg-color)] opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
        {isCompleted && (
             <div className="absolute top-2 right-2 bg-amazon-accent text-amazon-dark rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        )}
        <h3 className="text-4xl font-bold text-white group-hover:text-[var(--sdg-color)] transition-colors duration-300">
            {sdg.id}
        </h3>
        <p className="text-xs text-amazon-light mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10">
            {sdg.riddle[language]}
        </p>
        </button>
    );
};

const SDGExplanationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { language } = useLanguage();

    const content = {
        pt: {
            title: "O que são os Objetivos de Desenvolvimento Sustentável (ODS)?",
            p1: "Os Objetivos de Desenvolvimento Sustentável, ou ODS, são uma coleção de 17 metas globais estabelecidas pela Assembleia Geral das Nações Unidas em 2015. Eles formam a Agenda 2030, um plano de ação universal para erradicar a pobreza, proteger o planeta e garantir que todas as pessoas desfrutem de paz e prosperidade até 2030.",
            p2: "Os ODS são integrados e indivisíveis, e equilibram as três dimensões do desenvolvimento sustentável: a econômica, a social e a ambiental. Eles são um apelo à ação de todos os países - pobres, ricos e de renda média - para promover a prosperidade enquanto protegem o planeta.",
            p3: "Para a Amazônia, os ODS são especialmente cruciais. A floresta desempenha um papel vital na regulação do clima global (ODS 13), abriga uma biodiversidade imensa (ODS 15) e é o lar de comunidades tradicionais e indígenas cujos direitos e bem-estar estão no centro de vários objetivos (ODS 1, 5, 10). Aplicar os ODS na Amazônia significa encontrar caminhos para um desenvolvimento que mantenha a floresta em pé e garanta uma vida digna para sua população.",
            close: "Entendi!"
        },
        en: {
            title: "What are the Sustainable Development Goals (SDGs)?",
            p1: "The Sustainable Development Goals, or SDGs, are a collection of 17 global goals set by the United Nations General Assembly in 2015. They form the 2030 Agenda, a universal plan of action to end poverty, protect the planet, and ensure that all people enjoy peace and prosperity by 2030.",
            p2: "The SDGs are integrated and indivisible, and they balance the three dimensions of sustainable development: the economic, social, and environmental. They are a call to action for all countries—poor, rich, and middle-income—to promote prosperity while protecting the planet.",
            p3: "For the Amazon, the SDGs are especially crucial. The forest plays a vital role in regulating the global climate (SDG 13), hosts immense biodiversity (SDG 15), and is home to traditional and indigenous communities whose rights and well-being are at the core of several goals (SDGs 1, 5, 10). Applying the SDGs in the Amazon means finding pathways for development that keeps the forest standing and ensures a dignified life for its population.",
            close: "Got it!"
        },
        es: {
            title: "¿Qué son los Objetivos de Desarrollo Sostenible (ODS)?",
            p1: "Los Objetivos de Desarrollo Sostenible, u ODS, son una colección de 17 metas globales establecidas por la Asamblea General de las Naciones Unidas en 2015. Forman la Agenda 2030, un plan de acción universal para erradicar la pobreza, proteger el planeta y asegurar que todas las personas disfruten de paz y prosperidad para 2030.",
            p2: "Los ODS son integrados e indivisibles, y equilibran las tres dimensiones del desarrollo sostenible: la económica, la social y la ambiental. Son un llamado a la acción de todos los países —pobres, ricos y de ingresos medios— para promover la prosperidad mientras protegen el planeta.",
            p3: "Para la Amazonía, los ODS son especialmente cruciales. La selva desempeña un papel vital en la regulación del clima global (ODS 13), alberga una biodiversidad inmensa (ODS 15) y es el hogar de comunidades tradicionales e indígenas cuyos derechos y bienestar están en el centro de varios objetivos (ODS 1, 5, 10). Aplicar los ODS en la Amazonía significa encontrar caminos para un desarrollo que mantenga la selva en pie y garantice una vida digna para su población.",
            close: "¡Entendido!"
        }
    };
    
    const selectedContent = content[language];

    return (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60] animate-fade-in"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div 
              className="bg-amazon-dark rounded-lg shadow-2xl max-w-3xl w-full relative border-t-8 border-amazon-accent flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
          >
              <div className="p-6 md:p-8">
                  <h2 className="text-3xl font-bold mb-4 text-amazon-accent">
                      {selectedContent.title}
                  </h2>
              </div>
              
              <div className="space-y-4 overflow-y-auto px-6 md:px-8 flex-grow text-lg text-amazon-text/90">
                  <p>{selectedContent.p1}</p>
                  <p>{selectedContent.p2}</p>
                  <p>{selectedContent.p3}</p>
              </div>

              <div className="p-6 md:p-8 mt-4">
                <button 
                    onClick={onClose}
                    className="w-full py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg text-lg hover:bg-white transition-all transform hover:scale-105"
                >
                   {selectedContent.close}
                </button>
              </div>
          </div>
        </div>
    );
};

const ODS: React.FC<ODSProps> = ({ completedOdsQuizzes, completeOdsQuiz }) => {
  const { t } = useLanguage();
  const [selectedSDG, setSelectedSDG] = useState<SDGData | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelectSDG = (sdg: SDGData) => {
    setSelectedSDG(sdg);
  };

  return (
    <div className="animate-fade-in">
        <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-2">
                <h2 className="text-4xl font-bold text-amazon-accent">{t('ods_title')}</h2>
                <button 
                    onClick={() => setShowExplanation(true)} 
                    className="p-1 rounded-full text-amazon-light hover:bg-amazon-light/20 hover:text-white transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amazon-accent"
                    aria-label="O que são os ODS?"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
            <p className="text-lg max-w-3xl mx-auto mt-2">
               {t('ods_subtitle')}
            </p>
        </div>
      
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sdgData.map((sdg) => (
                <SDGCard 
                    key={sdg.id} 
                    sdg={sdg} 
                    onSelect={() => handleSelectSDG(sdg)}
                    isCompleted={completedOdsQuizzes.includes(sdg.id)}
                />
            ))}
        </div>

        {selectedSDG && (
            <SDGModal 
                sdg={selectedSDG} 
                onClose={() => setSelectedSDG(null)}
                onCorrectAnswer={(points) => completeOdsQuiz(selectedSDG.id, points)}
                isCompleted={completedOdsQuizzes.includes(selectedSDG.id)}
            />
        )}

        {showExplanation && <SDGExplanationModal onClose={() => setShowExplanation(false)} />}
    </div>
  );
};

export default ODS;
