// src/features/retirement/components/LanguageSwitcher.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '../hooks/useLanguage';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLang = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className="text-lg px-4 py-2 h-12 border-2 border-charcoal-200 hover:border-charcoal-400"
        >
          <Globe className="w-5 h-5 mr-2" />
          <span className="mr-2">{currentLang?.flag}</span>
          <span className="font-semibold">{currentLang?.name}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white border-2 border-charcoal-200 shadow-lg"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'fr' | 'en')}
            className={`text-lg p-3 cursor-pointer hover:bg-charcoal-50 ${
              language === lang.code ? 'bg-charcoal-100 font-semibold' : ''
            }`}
          >
            <span className="mr-3 text-xl">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Composant de sélecteur de langue simple (boutons)
export const SimpleLanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'fr' ? 'default' : 'outline'}
        size="lg"
        onClick={() => setLanguage('fr')}
        className={`text-lg px-4 py-2 h-12 ${
          language === 'fr' 
            ? 'bg-charcoal-600 hover:bg-charcoal-700 text-white' 
            : 'border-2 border-charcoal-200 hover:border-charcoal-400'
        }`}
      >
        🇫🇷 Français
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="lg"
        onClick={() => setLanguage('en')}
        className={`text-lg px-4 py-2 h-12 ${
          language === 'en' 
            ? 'bg-charcoal-600 hover:bg-charcoal-700 text-white' 
            : 'border-2 border-charcoal-200 hover:border-charcoal-400'
        }`}
      >
        🇺🇸 English
      </Button>
    </div>
  );
};