import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, Language, RiverQuizQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const languageMap: { [key in Language]: string } = {
  pt: "português",
  en: "inglês",
  es: "espanhol"
};

export const generateQuizQuestions = async (language: Language): Promise<QuizQuestion[]> => {
  const langName = languageMap[language] || 'português';
  const prompt = `Gere 5 perguntas de múltipla escolha em ${langName} sobre a crise climática na Amazônia. Inclua desmatamento, consumo consciente e energias renováveis. Para cada pergunta, forneça 4 opções, a resposta correta e uma breve explicação sobre o porquê da resposta estar correta (a explicação também deve estar em ${langName}).`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quiz: {
              type: Type.ARRAY,
              description: "Uma lista de perguntas para o quiz.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "A pergunta do quiz."
                  },
                  options: {
                    type: Type.ARRAY,
                    description: "Uma lista com 4 opções de resposta.",
                    items: {
                      type: Type.STRING
                    }
                  },
                  correctAnswer: {
                    type: Type.STRING,
                    description: "A resposta correta exata de uma das opções."
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Uma breve explicação para a resposta correta."
                  }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["quiz"]
        },
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return parsed.quiz;

  } catch (error) {
    console.error("Error generating quiz questions:", error);
    // Fallback with static data in case of API error
    return [
      {
        question: "Qual é a principal causa do desmatamento na Amazônia?",
        options: ["Expansão agrícola e pecuária", "Construção de cidades", "Turismo ecológico", "Extrativismo de látex"],
        correctAnswer: "Expansão agrícola e pecuária",
        explanation: "A maior parte do desmatamento na Amazônia é causada pela conversão da floresta em pastagens para gado e plantações, como a soja."
      },
      {
        question: "O que são 'rios voadores'?",
        options: ["Um tipo de transporte aéreo local", "O processo de evapotranspiração da floresta que leva umidade para outras regiões", "Lendas indígenas sobre rios que flutuam", "Nuvens de poluição de queimadas"],
        correctAnswer: "O processo de evapotranspiração da floresta que leva umidade para outras regiões",
        explanation: "A floresta amazônica libera uma quantidade imensa de vapor d'água na atmosfera, criando 'rios voadores' que influenciam o regime de chuvas em grande parte da América do Sul."
      }
    ];
  }
};

export const generateRiverQuizQuestion = async (language: Language): Promise<RiverQuizQuestion | null> => {
    const langName = languageMap[language] || 'português';
    const prompt = `Gere uma única pergunta de múltipla escolha em ${langName} sobre a preservação de rios e da vida aquática, no contexto da Amazônia. A pergunta deve ser educativa e adequada para um jogo. Forneça exatamente 3 opções de resposta, onde apenas uma tem o campo 'correct' como true. Forneça também um feedback curto e positivo para a resposta correta, também em ${langName}. Não use markdown na resposta.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING, description: `A pergunta em ${langName}.` },
                        options: {
                            type: Type.ARRAY,
                            description: "Uma lista de 3 opções de resposta.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING, description: `O texto da opção em ${langName}.` },
                                    correct: { type: Type.BOOLEAN, description: "Indica se esta é a resposta correta." }
                                },
                                required: ["text", "correct"]
                            }
                        },
                        feedback: { type: Type.STRING, description: `O feedback para a resposta correta em ${langName}.` }
                    },
                    required: ["question", "options", "feedback"]
                }
            }
        });
        const parsed = JSON.parse(response.text.trim());
        
        if (parsed.options && parsed.options.length === 3 && parsed.options.filter((o: any) => o.correct).length === 1) {
            return parsed;
        }
        console.error("Generated quiz question has invalid format:", parsed);
        return null;
    } catch (error) {
        console.error("Error generating river quiz question:", error);
        return null; // Fallback
    }
  };