
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-amazon-medium/60 backdrop-blur-md rounded-lg p-6 shadow-lg hover:shadow-amazon-accent/20 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
      {icon}
      <h3 className="text-xl font-bold text-amazon-accent mb-2">{title}</h3>
      <p className="text-amazon-text/90">{description}</p>
    </div>
  );
};

export default Card;
