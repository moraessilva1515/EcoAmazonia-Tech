import React, { useState, useEffect } from 'react';
import Card from './Card';
import { useLanguage } from '../LanguageContext';
import type { Language, LocalizedString } from '../types';

interface LocalizedMission {
    id: number;
    icon: React.ReactNode;
    title: LocalizedString;
    description: LocalizedString;
    points: number;
}

const missions: LocalizedMission[] = [
    {
        id: 1,
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
        title: { pt: "Mestre da Reciclagem", en: "Recycling Master", es: "Maestro del Reciclaje" },
        description: { pt: "Separe o lixo orgânico do reciclável. Plástico, papel, metal e vidro podem ganhar uma nova vida!", en: "Separate organic from recyclable waste. Plastic, paper, metal, and glass can get a new life!", es: "Separa la basura orgánica de la reciclable. ¡Plástico, papel, metal y vidrio pueden tener una nueva vida!" },
        points: 20
    },
    {
        id: 2,
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: { pt: "Caçador de Vampiros de Energia", en: "Energy Vampire Hunter", es: "Cazador de Vampiros de Energía" },
        description: { pt: "Desligue aparelhos da tomada quando não estiver usando. Até em stand-by eles consomem energia!", en: "Unplug devices when not in use. Even on standby, they consume energy!", es: "Desenchufa los aparatos cuando no los uses. ¡Incluso en stand-by consumen energía!" },
        points: 15
    },
    {
        id: 3,
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        title: { pt: "Guardião dos Minutos", en: "Guardian of the Minutes", es: "Guardián de los Minutos" },
        description: { pt: "Reduza o tempo no banho. Cada minuto economizado representa litros de água poupados.", en: "Reduce your shower time. Every minute saved represents liters of water saved.", es: "Reduce el tiempo en la ducha. Cada minuto ahorrado representa litros de agua ahorrados." },
        points: 25
    },
    {
        id: 4,
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
        title: { pt: "Consumidor Consciente", en: "Conscious Consumer", es: "Consumidor Consciente" },
        description: { pt: "Prefira produtos locais e de empresas com selo de sustentabilidade. Seu carrinho de compras tem poder!", en: "Prefer local products and companies with sustainability seals. Your shopping cart has power!", es: "Prefiere productos locales y de empresas con sello de sostenibilidad. ¡Tu carrito de compras tiene poder!" },
        points: 30
    },
     {
        id: 5,
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" /></svg>,
        title: { pt: "Detetive do Desperdício", en: "Waste Detective", es: "Detective del Desperdicio" },
        description: { pt: "Planeje suas refeições e compre apenas o necessário para evitar o desperdício de alimentos.", en: "Plan your meals and buy only what you need to avoid food waste.", es: "Planifica tus comidas y compra solo lo necesario para evitar el desperdicio de alimentos." },
        points: 20
    }
];

interface HomeProps {
    addPn: (amount: number) => void;
}

interface PreservationTipsModalProps {
    onClose: () => void;
    addPn: (amount: number) => void;
}

const PreservationTipsModal: React.FC<PreservationTipsModalProps> = ({ onClose, addPn }) => {
    const { language } = useLanguage();
    const [selectedMissions, setSelectedMissions] = useState<number[]>([]);

    const handleMissionToggle = (missionId: number) => {
        setSelectedMissions(prev => 
            prev.includes(missionId)
                ? prev.filter(id => id !== missionId)
                : [...prev, missionId]
        );
    };

    const handleConfirmMissions = () => {
        if (selectedMissions.length === 0) return;

        const pointsToAdd = selectedMissions.reduce((total, id) => {
            const mission = missions.find(m => m.id === id);
            return total + (mission ? mission.points : 0);
        }, 0);

        addPn(pointsToAdd);
        setSelectedMissions([]);
        onClose(); // Close modal after confirming
    };

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

    return (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div 
              className="bg-amazon-dark rounded-lg shadow-2xl max-w-3xl w-full relative border-t-8 border-amazon-accent flex flex-col"
              onClick={(e) => e.stopPropagation()}
          >
              <button onClick={onClose} className="absolute top-2 right-2 text-amazon-light hover:text-white" aria-label="Fechar">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="p-6 md:p-8">
                  <h2 className="text-3xl font-bold mb-2 text-amazon-accent">
                      {language === 'pt' ? 'Missões do Guardião da Floresta' : language === 'en' ? 'Forest Guardian Missions' : 'Misiones del Guardián de la Selva'}
                  </h2>
                  <p className="text-lg text-amazon-text/80 mb-6">{language === 'pt' ? 'Selecione as tarefas que você concluiu e confirme para ganhar "Pontos de Natureza" (PN)! Você pode repetir as missões quantas vezes quiser.' : language === 'en' ? 'Select the tasks you have completed and confirm to earn "Nature Points" (NP)! You can repeat the missions as many times as you like.' : '¡Selecciona las tareas que has completado y confirma para ganar "Puntos de Naturaleza" (PN)! Puedes repetir las misions cuantas veces quieras.'}</p>
              </div>
              
              <div className="space-y-4 max-h-[50vh] overflow-y-auto px-6 md:px-8 flex-grow">
                  {missions.map((mission) => {
                      const isSelected = selectedMissions.includes(mission.id);
                      return (
                          <label key={mission.id} htmlFor={`mission-${mission.id}`} className={`bg-amazon-medium/50 p-4 rounded-lg flex items-center gap-4 transition-all duration-200 cursor-pointer ${isSelected ? 'ring-2 ring-amazon-accent' : ''}`}>
                              <input 
                                type="checkbox"
                                id={`mission-${mission.id}`}
                                className="form-checkbox h-6 w-6 rounded bg-amazon-dark text-amazon-accent border-amazon-light focus:ring-amazon-accent"
                                checked={isSelected}
                                onChange={() => handleMissionToggle(mission.id)}
                              />
                              <div className="flex-shrink-0">{mission.icon}</div>
                              <div className="flex-grow">
                                  <h3 className="font-bold text-lg text-white">{mission.title[language]}</h3>
                                  <p className="text-sm text-amazon-text/90">{mission.description[language]}</p>
                              </div>
                              <div className="bg-amazon-accent text-amazon-dark font-bold text-sm px-3 py-1 rounded-full">
                                  +{mission.points} PN
                              </div>
                          </label>
                      )
                  })}
              </div>
              <div className="p-6 md:p-8 mt-4">
                <button 
                    onClick={handleConfirmMissions}
                    disabled={selectedMissions.length === 0}
                    className="w-full py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg text-lg hover:bg-white transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                >
                   {language === 'pt' ? `Concluir Missões (${selectedMissions.length} selecionada${selectedMissions.length !== 1 ? 's' : ''})` : language === 'en' ? `Complete Missions (${selectedMissions.length} selected)` : `Completar Misiones (${selectedMissions.length} seleccionada${selectedMissions.length !== 1 ? 's' : ''})`}
                </button>
              </div>
          </div>
        </div>
      );
}

const CountdownTimer: React.FC = () => {
  const { language } = useLanguage();
  const calculateTimeLeft = () => {
    const difference = +new Date('2025-11-10T00:00:00') - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    } else {
        timeLeft = { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    }
    return timeLeft;
  };
  
  const intervalNames: {[key: string]: {[key in Language]: string}} = {
    dias: {pt: 'dias', en: 'days', es: 'días'},
    horas: {pt: 'horas', en: 'hours', es: 'horas'},
    minutos: {pt: 'minutos', en: 'minutes', es: 'minutos'},
    segundos: {pt: 'segundos', en: 'seconds', es: 'segundos'},
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    return (
      <div key={interval} className="flex flex-col items-center mx-2">
          <span className="text-4xl lg:text-5xl font-bold text-white tracking-wider">{String(timeLeft[interval]).padStart(2, '0')}</span>
          <span className="text-xs uppercase text-amazon-light mt-1">{intervalNames[interval][language]}</span>
      </div>
    );
  });

  return (
    <div className="flex justify-center items-center">
      {timerComponents.length ? timerComponents : <span className="text-2xl font-bold text-white">O evento começou!</span>}
    </div>
  );
};


const Home: React.FC<HomeProps> = ({ addPn }) => {
    const { t, language } = useLanguage();
    const [showPreservationTips, setShowPreservationTips] = useState(false);

  return (
    <div className="space-y-12 animate-fade-in">
      {showPreservationTips && <PreservationTipsModal onClose={() => setShowPreservationTips(false)} addPn={addPn} />}
      <section className="text-center p-8 bg-amazon-medium/50 rounded-lg shadow-2xl backdrop-blur-sm">
        <h2 className="text-4xl md:text-5xl font-bold text-amazon-accent mb-4">
          {t('home_title')}
        </h2>
        <p className="text-lg md:text-xl max-w-4xl mx-auto text-amazon-text">
          {t('home_subtitle')}
        </p>
      </section>

      <section className="space-y-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
            {language === 'pt' ? <>De Olho na <span className="text-amazon-accent">COP30 em Belém!</span></> : language === 'en' ? <>Eyes on <span className="text-amazon-accent">COP30 in Belém!</span></> : <>¡Ojo a la <span className="text-amazon-accent">COP30 en Belém!</span></>}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
             <Card 
                title={language === 'pt' ? 'O que é a COP30?' : language === 'en' ? 'What is COP30?' : '¿Qué es la COP30?'}
                description={language === 'pt' ? "A COP é a maior conferência da ONU sobre o clima. Em 2025, a 30ª edição será em Belém (PA), no coração da Amazônia! É uma chance única para o mundo discutir o futuro do planeta, com a floresta como protagonista, e para nós, amazônidas, mostrarmos nossa força e conhecimento na busca por soluções." : language === 'en' ? "COP is the largest UN climate conference. In 2025, the 30th edition will be in Belém (PA), in the heart of the Amazon! It's a unique chance for the world to discuss the planet's future, with the forest as the protagonist, and for us, Amazonians, to show our strength and knowledge in the search for solutions." : "La COP es la mayor conferencia de la ONU sobre el clima. ¡En 2025, la 30ª edición será en Belém (PA), en el corazón de la Amazonía! Es una oportunidad única para que el mundo discuta el futuro del planeta, con la selva como protagonista, y para que nosotros, los amazónicos, mostremos nuestra fuerza y conocimiento en la búsqueda de soluciones."}
                icon={<IconCOP />}
             />
             <div className="bg-amazon-medium/60 backdrop-blur-md rounded-lg p-6 shadow-lg flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-amazon-accent mb-4">{language === 'pt' ? 'Contagem Regressiva para o Evento' : language === 'en' ? 'Countdown to the Event' : 'Cuenta Regresiva para el Evento'}</h3>
                <CountdownTimer />
             </div>
        </div>
      </section>
      
      <section className="text-center p-6 bg-amazon-medium/30 rounded-lg">
        <button
          onClick={() => setShowPreservationTips(true)}
          className="inline-block px-8 py-4 bg-amazon-accent text-amazon-dark font-bold rounded-full hover:bg-white transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amazon-accent/50"
        >
          <div className="flex items-center gap-3">
            <IconShield />
            <span>{language === 'pt' ? 'Missão: Guardião da Floresta' : language === 'en' ? 'Mission: Forest Guardian' : 'Misión: Guardián de la Selva'}</span>
          </div>
        </button>
        <p className="text-md text-amazon-light mt-4 max-w-2xl mx-auto">
            {language === 'pt' ? 'Clique para descobrir missões diárias e se tornar um protetor ativo do meio ambiente.' : language === 'en' ? 'Click to discover daily missions and become an active protector of the environment.' : 'Haz clic para descubrir misiones diarias y convertirte en un protector activo del medio ambiente.'}
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <Card
          title={language === 'pt' ? 'Nossa Missão' : language === 'en' ? 'Our Mission' : 'Nuestra Misión'}
          description={language === 'pt' ? 'Utilizar ferramentas tecnológicas para engajar e educar sobre os desafios ambientais da Amazônia, promovendo uma cultura de sustentabilidade e participação ativa.' : language === 'en' ? 'Use technological tools to engage and educate about the environmental challenges of the Amazon, promoting a culture of sustainability and active participation.' : 'Utilizar herramientas tecnológicas para involucrar y educar sobre los desafíos ambientales de la Amazonía, promoviendo una cultura de sostenibilidad y participación activa.'}
          icon={<IconMission />}
        />
        <Card
          title={language === 'pt' ? 'Conteúdo Interativo' : language === 'en' ? 'Interactive Content' : 'Contenido Interactivo'}
          description={language === 'pt' ? 'Aprenda de forma dinâmica com quizzes, infográficos e vídeos sobre desmatamento, consumo consciente e energias renováveis.' : language === 'en' ? 'Learn dynamically with quizzes, infographics, and videos about deforestation, conscious consumption, and renewable energy.' : 'Aprende de forma dinámica con pruebas, infografías y videos sobre deforestación, consumo consciente y energías renovables.'}
          icon={<IconInteractive />}
        />
        <Card
          title={language === 'pt' ? 'Impacto Esperado' : language === 'en' ? 'Expected Impact' : 'Impacto Esperado'}
          description={language === 'pt' ? 'Aumentar a percepção sobre as mudanças climáticas e fortalecer a relação entre ciência, tecnologia e sociedade na busca por um futuro mais verde.' : language === 'en' ? 'Increase awareness of climate change and strengthen the relationship between science, technology, and society in the search for a greener future.' : 'Aumentar la conciencia sobre el cambio climático y fortalecer la relación entre ciencia, tecnología y sociedad en la búsqueda de un futuro más verde.'}
          icon={<IconImpact />}
        />
      </div>
    </div>
  );
};

const IconShield: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const IconMission: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-amazon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const IconInteractive: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-amazon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const IconImpact: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-amazon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const IconCOP: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-amazon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c1.355 0 2.707-.157 4-.447M12 21c-1.355 0-2.707-.157-4-.447m8 0a9.005 9.005 0 00-8 0m8 0c1.355 0 2.707.157 4 .447m-4-.447a9.005 9.005 0 01-8 0m0 0c-1.355 0-2.707.157-4 .447m4-.447A9.005 9.005 0 0012 3c-1.355 0-2.707.157-4 .447m4-.447A9.005 9.005 0 0112 3c1.355 0 2.707.157 4 .447M3.284 6.747A9.005 9.005 0 0012 3m0 18a9.005 9.005 0 00-8.716-6.747m0 0A9.005 9.005 0 003.284 6.747M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.188 10.584c.328.328.328.86 0 1.188l-3.376 3.375a.84.84 0 01-1.188 0l-1.99-1.99a.84.84 0 010-1.188l3.375-3.375a.84.84 0 011.188 0l1.99 1.99z" />
    </svg>
);

export default Home;
