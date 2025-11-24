import React, { useEffect, useRef, useState, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../LanguageContext';
import type { LocalizedString } from '../types';

interface VideosProps {
    markVideoAsWatched: (videoId: string) => void;
    watchedVideos: string[];
}

interface VideoPlayerProps {
    videoId: string;
    onVideoEnd: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onVideoEnd }) => {
    const playerRef = useRef<any>(null);

    const onPlayerStateChange = useCallback((event: any) => {
        if (event.data === (window as any).YT.PlayerState.ENDED) {
            onVideoEnd();
        }
    }, [onVideoEnd]);

    useEffect(() => {
        const createPlayer = () => {
             if (document.getElementById(`youtube-player-${videoId}`)) {
                const player = new (window as any).YT.Player(`youtube-player-${videoId}`, {
                    videoId: videoId,
                    playerVars: {
                        'autoplay': 0,
                        'controls': 1,
                        'rel': 0,
                    },
                    events: {
                        'onStateChange': onPlayerStateChange
                    }
                });
                playerRef.current = player;
            }
        }
        
        // FIX: The parent component `Videos` is responsible for making sure the API is ready.
        // We only create the player if the API is available.
        if ((window as any).YT && (window as any).YT.Player) {
             createPlayer();
        }


        return () => {
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                playerRef.current.destroy();
            }
        };
    }, [videoId, onPlayerStateChange]);

    return <div id={`youtube-player-${videoId}`} className="w-full h-full"></div>;
};

interface VideoCardProps {
    title: string;
    videoId: string;
    description: string;
    onVideoEnd: () => void;
    isWatched: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, videoId, description, onVideoEnd, isWatched }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-amazon-medium/60 backdrop-blur-md rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="aspect-w-16 aspect-h-9 w-full">
                <VideoPlayer videoId={videoId} onVideoEnd={onVideoEnd} />
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-amazon-accent mb-2">{title}</h3>
                <p className="text-amazon-text/90 flex-grow">{description}</p>
                <div className={`w-full mt-4 px-6 py-3 font-bold rounded-lg text-center transition-colors duration-300 ${isWatched ? 'bg-amazon-accent/20 text-amazon-accent' : 'bg-amazon-dark/50 text-amazon-light'}`}>
                  {isWatched ? t('video_card_watched') : t('video_card_unwatched')}
                </div>
            </div>
        </div>
    );
};

interface Video {
    title: LocalizedString;
    videoId: string;
    description: LocalizedString;
}

const videoData: Video[] = [
    {
      title: { 
          pt: "Amazônia: O Despertar da Florestania",
          en: "Amazon: The Awakening of Forest-Citizenship",
          es: "Amazonía: El Despertar de la Ciudadanía Forestal"
      },
      videoId: "Vr55Lfl_G_c",
      description: {
          pt: "Um documentário que explora a relação profunda dos povos da floresta com o ecossistema e os desafios que enfrentam para protegê-lo.",
          en: "A documentary that explores the deep relationship of the forest peoples with the ecosystem and the challenges they face in protecting it.",
          es: "Un documental que explora la profunda relación de los pueblos de la selva con el ecosistema y los desafíos que enfrentan para protegerlo."
      }
    },
    {
      title: {
          pt: "Como Salvar a Amazônia?",
          en: "How to Save the Amazon?",
          es: "¿Cómo Salvar la Amazonía?"
      },
      videoId: "jB51f6dG-wI",
      description: {
          pt: "Especialistas discutem caminhos e soluções para um desenvolvimento sustentável que possa coexistir com a preservação da maior floresta tropical do mundo.",
          en: "Experts discuss paths and solutions for sustainable development that can coexist with the preservation of the world's largest tropical forest.",
          es: "Expertos discuten caminos y soluciones para un desarrollo sostenible que pueda coexistir con la preservación de la selva tropical más grande del mundo."
      }
    },
    {
      title: {
          pt: "Como cuidar do meio ambiente?",
          en: "How to take care of the environment?",
          es: "¿Cómo cuidar el medio ambiente?"
      },
      videoId: "Ekbd_hSQOhc",
      description: {
          pt: "Este vídeo oferece dicas práticas e simples que todos podem adotar no dia a dia para ajudar a proteger nosso planeta e a Amazônia.",
          en: "This video offers practical and simple tips that everyone can adopt in their daily lives to help protect our planet and the Amazon.",
          es: "Este video ofrece consejos prácticos y sencillos que todos pueden adoptar en su día a día para ayudar a proteger nuestro planeta y la Amazonía."
      }
    }
];

const Videos: React.FC<VideosProps> = ({ markVideoAsWatched, watchedVideos }) => {
    const { language, t } = useLanguage();
    const [isApiReady, setIsApiReady] = useState(false);

    useEffect(() => {
        const onYouTubeIframeAPIReady = () => {
            setIsApiReady(true);
        };
        
        if ((window as any).YT && (window as any).YT.Player) {
            setIsApiReady(true);
        } else {
            (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
            
            // FIX: Load the YouTube Iframe API script if it's not already present.
            // This logic is moved from the child VideoPlayer to the parent Videos component
            // to prevent race conditions and ensure the script is loaded only once.
            if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
            }
        }

        return () => {
            (window as any).onYouTubeIframeAPIReady = null;
        }
    }, []);

  return (
    <div className="animate-fade-in">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amazon-accent">{t('videos_title')}</h2>
            <p className="text-lg max-w-2xl mx-auto mt-2">{t('videos_subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            {isApiReady ? (
                videoData.map(video => (
                    <VideoCard 
                        key={video.videoId}
                        title={video.title[language]}
                        videoId={video.videoId}
                        description={video.description[language]}
                        isWatched={watchedVideos.includes(video.videoId)}
                        onVideoEnd={() => markVideoAsWatched(video.videoId)}
                    />
                ))
            ) : (
                <div className="md:col-span-2 flex flex-col justify-center items-center h-64 bg-amazon-medium/30 rounded-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg">{t('videos_loading')}</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Videos;