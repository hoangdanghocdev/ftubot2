import React from "react";
import { Persona, personas } from "../services/personaService";

interface PersonaSelectorProps {
  selectedPersonaId: string | null;
  onPersonaChange: (personaId: string) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersonaId,
  onPersonaChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedPersona = selectedPersonaId
    ? personas.find((p) => p.id === selectedPersonaId) || personas[0]
    : personas[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        title="Select AI Persona"
      >
        <span className="hidden sm:inline">{selectedPersona.name}</span>
        <span className="sm:hidden">👤</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                AI Persona
              </div>
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => {
                    onPersonaChange(persona.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedPersonaId === persona.id
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <div className="font-medium">{persona.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {persona.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonaSelector;



