/**
 * Composant LearningModule - Phase 5 Modules Néophytes
 * Interface d'apprentissage interactive avec contenu progressif et quiz
 * Système éducatif basé sur l'expertise Retraite101
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Circle, 
  Play, 
  Pause, 
  RotateCcw,
  Award,
  Bookmark,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Target,
  AlertTriangle,
  Lightbulb,
  Video,
  FileText,
  X,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { Alert, AlertDescription } from './alert';
import { Textarea } from './textarea';
import { 
  LearningService, 
  LearningModule as LearningModuleType, 
  LearningContent,
  UserProgress,
  Question,
  Certificate
} from '../../services/LearningService';

interface LearningModuleProps {
  moduleId: string;
  onComplete?: (certificate?: Certificate) => void;
  onClose?: () => void;
  className?: string;
}

interface ModuleState {
  currentContentIndex: number;
  isQuizMode: boolean;
  quizAnswers: Record<string, any>;
  quizSubmitted: boolean;
  quizResults?: any;
  timeSpent: number;
  isPlaying: boolean;
  showNotes: boolean;
  noteText: string;
}

export const LearningModule: React.FC<LearningModuleProps> = ({
  moduleId,
  onComplete,
  onClose,
  className = ''
}) => {
  const [module, setModule] = useState<LearningModuleType | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [moduleState, setModuleState] = useState<ModuleState>({
    currentContentIndex: 0,
    isQuizMode: false,
    quizAnswers: {},
    quizSubmitted: false,
    timeSpent: 0,
    isPlaying: false,
    showNotes: false,
    noteText: ''
  });

  const learningService = LearningService.getInstance();

  useEffect(() => {
    const moduleData = learningService.getAllModules().find(m => m.id === moduleId);
    if (moduleData) {
      setModule(moduleData);
      const userProgress = learningService.getUserProgress(moduleId);
      setProgress(userProgress);
      
      if (userProgress) {
        setModuleState(prev => ({
          ...prev,
          currentContentIndex: userProgress.currentContentIndex,
          timeSpent: userProgress.timeSpent
        }));
      }
    }
  }, [moduleId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (moduleState.isPlaying) {
      interval = setInterval(() => {
        setModuleState(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 }));
        
        // Sauvegarder le progrès toutes les minutes
        if (moduleState.timeSpent % 60 === 0) {
          learningService.updateProgress(moduleId, moduleState.currentContentIndex, 1);
        }
      }, 60000); // 1 minute
    }
    return () => clearInterval(interval);
  }, [moduleState.isPlaying, moduleState.timeSpent, moduleId, moduleState.currentContentIndex]);

  if (!module) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du module...</p>
        </div>
      </div>
    );
  }

  const currentContent = module.content[moduleState.currentContentIndex];
  const isLastContent = moduleState.currentContentIndex === module.content.length - 1;
  const progressPercentage = Math.round(((moduleState.currentContentIndex + 1) / module.content.length) * 100);

  const handleNextContent = () => {
    if (isLastContent) {
      setModuleState(prev => ({ ...prev, isQuizMode: true }));
    } else {
      setModuleState(prev => ({ 
        ...prev, 
        currentContentIndex: prev.currentContentIndex + 1 
      }));
      learningService.updateProgress(moduleId, moduleState.currentContentIndex + 1, 1);
    }
  };

  const handlePreviousContent = () => {
    if (moduleState.currentContentIndex > 0) {
      setModuleState(prev => ({ 
        ...prev, 
        currentContentIndex: prev.currentContentIndex - 1 
      }));
    }
  };

  const handleQuizAnswer = (questionId: string, answer: any) => {
    setModuleState(prev => ({
      ...prev,
      quizAnswers: { ...prev.quizAnswers, [questionId]: answer }
    }));
  };

  const handleQuizSubmit = () => {
    const results = learningService.submitQuiz(moduleId, moduleState.quizAnswers);
    setModuleState(prev => ({ 
      ...prev, 
      quizSubmitted: true, 
      quizResults: results 
    }));
    
    if (results.passed) {
      onComplete?.(results.certificate);
    }
  };

  const handleBookmark = () => {
    if (currentContent) {
      learningService.addBookmark(moduleId, currentContent.id);
    }
  };

  const handleAddNote = () => {
    if (currentContent && moduleState.noteText.trim()) {
      learningService.addNote(moduleId, currentContent.id, moduleState.noteText);
      setModuleState(prev => ({ ...prev, noteText: '', showNotes: false }));
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getContentIcon = (type: LearningContent['type']) => {
    switch (type) {
      case 'text':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'interactive':
        return <Target className="h-5 w-5 text-purple-500" />;
      case 'example':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getContentStyle = (type: LearningContent['type']) => {
    switch (type) {
      case 'tip':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'example':
        return 'border-yellow-200 bg-yellow-50';
      case 'interactive':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  // Mode Quiz
  if (moduleState.isQuizMode) {
    if (moduleState.quizSubmitted && moduleState.quizResults) {
      return (
        <Card className={`w-full max-w-4xl mx-auto ${className}`}>
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
              {moduleState.quizResults.passed ? (
                <CheckCircle className="h-10 w-10 text-white" />
              ) : (
                <X className="h-10 w-10 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {moduleState.quizResults.passed ? 'Félicitations !' : 'Quiz non réussi'}
            </CardTitle>
            <p className="text-gray-600">
              Score obtenu : {moduleState.quizResults.score}% 
              (minimum requis : {module.quiz.passingScore}%)
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Résultats détaillés */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Résultats détaillés</h3>
              {moduleState.quizResults.results.map((result: any, index: number) => (
                <Card key={index} className={`border-l-4 ${result.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">{result.question}</p>
                      <Badge variant={result.isCorrect ? 'default' : 'destructive'}>
                        {result.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Votre réponse : <span className="font-medium">{result.userAnswer}</span>
                    </p>
                    {!result.isCorrect && (
                      <p className="text-sm text-green-600 mb-2">
                        Bonne réponse : <span className="font-medium">{result.correctAnswer}</span>
                      </p>
                    )}
                    <p className="text-sm text-gray-700">{result.explanation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Certificat */}
            {moduleState.quizResults.certificate && (
              <Card className="border-gold bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">
                      Certificat de réussite
                    </h3>
                    <p className="text-yellow-700 mb-4">
                      {moduleState.quizResults.certificate.title}
                    </p>
                    <p className="text-sm text-yellow-600 mb-4">
                      ID : {moduleState.quizResults.certificate.credentialId}
                    </p>
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le certificat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              {moduleState.quizResults.passed ? (
                <Button onClick={() => onComplete?.(moduleState.quizResults.certificate)}>
                  Terminer le module
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setModuleState(prev => ({ 
                      ...prev, 
                      isQuizMode: false, 
                      currentContentIndex: 0,
                      quizSubmitted: false,
                      quizAnswers: {}
                    }))}
                  >
                    Revoir le contenu
                  </Button>
                  {module.quiz.allowRetake && (
                    <Button 
                      onClick={() => setModuleState(prev => ({ 
                        ...prev, 
                        quizSubmitted: false,
                        quizAnswers: {}
                      }))}
                    >
                      Reprendre le quiz
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    // Interface du quiz
    return (
      <Card className={`w-full max-w-4xl mx-auto ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Quiz - {module.title}</CardTitle>
            <div className="flex items-center space-x-2">
              {module.quiz.timeLimit && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {module.quiz.timeLimit} min
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            {module.quiz.questions.length} questions • Score minimum : {module.quiz.passingScore}%
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {module.quiz.questions.map((question, index) => (
            <QuestionComponent
              key={question.id}
              question={question}
              questionNumber={index + 1}
              onAnswer={(answer) => handleQuizAnswer(question.id, answer)}
              selectedAnswer={moduleState.quizAnswers[question.id]}
            />
          ))}
          
          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleQuizSubmit}
              disabled={Object.keys(moduleState.quizAnswers).length !== module.quiz.questions.length}
              className="bg-green-600 hover:bg-green-700"
            >
              Soumettre le quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mode contenu d'apprentissage
  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{module.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(moduleState.timeSpent)}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progression</span>
            <span>{moduleState.currentContentIndex + 1}/{module.content.length}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {currentContent && (
          <div className="space-y-6">
            {/* En-tête du contenu */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getContentIcon(currentContent.type)}
                <div>
                  <h2 className="text-xl font-bold">{currentContent.title}</h2>
                  <Badge variant="outline" className="text-xs mt-1">
                    {currentContent.type}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModuleState(prev => ({ ...prev, showNotes: !prev.showNotes }))}
                >
                  <StickyNote className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Contenu principal */}
            <Card className={`border-2 ${getContentStyle(currentContent.type)}`}>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  {currentContent.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                {currentContent.mediaUrl && (
                  <div className="mt-6">
                    <video 
                      controls 
                      className="w-full rounded-lg"
                      src={currentContent.mediaUrl}
                    >
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                  </div>
                )}
                
                {currentContent.interactiveComponent && (
                  <div className="mt-6 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-center text-gray-600">
                      Composant interactif : {currentContent.interactiveComponent}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Zone de notes */}
            {moduleState.showNotes && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-4">
                  <h3 className="font-medium mb-3">Ajouter une note</h3>
                  <Textarea
                    value={moduleState.noteText}
                    onChange={(e) => setModuleState(prev => ({ ...prev, noteText: e.target.value }))}
                    placeholder="Écrivez votre note ici..."
                    className="mb-3"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setModuleState(prev => ({ ...prev, showNotes: false, noteText: '' }))}>
                      Annuler
                    </Button>
                    <Button size="sm" onClick={handleAddNote}>
                      Sauvegarder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePreviousContent}
                disabled={moduleState.currentContentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setModuleState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                  size="sm"
                >
                  {moduleState.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="text-sm text-gray-500">
                  {moduleState.currentContentIndex + 1} / {module.content.length}
                </span>
              </div>

              <Button onClick={handleNextContent}>
                {isLastContent ? 'Passer au quiz' : 'Suivant'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Composant pour les questions de quiz
const QuestionComponent: React.FC<{
  question: Question;
  questionNumber: number;
  onAnswer: (answer: any) => void;
  selectedAnswer?: any;
}> = ({ question, questionNumber, onAnswer, selectedAnswer }) => {
  const handleAnswerChange = (answer: any) => {
    onAnswer(answer);
  };

  return (
    <Card className="border-l-4 border-blue-500">
      <CardContent className="pt-4">
        <div className="flex items-start space-x-3">
          <Badge className="mt-1">{questionNumber}</Badge>
          <div className="flex-1">
            <h3 className="font-medium mb-3">{question.question}</h3>
            
            {question.type === 'multiple-choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={() => handleAnswerChange(option)}
                      className="text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
            
            {question.type === 'true-false' && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="Vrai"
                    checked={selectedAnswer === 'Vrai'}
                    onChange={() => handleAnswerChange('Vrai')}
                    className="text-blue-600"
                  />
                  <span>Vrai</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="Faux"
                    checked={selectedAnswer === 'Faux'}
                    onChange={() => handleAnswerChange('Faux')}
                    className="text-blue-600"
                  />
                  <span>Faux</span>
                </label>
              </div>
            )}
            
            {question.type === 'calculation' && (
              <input
                type="number"
                value={selectedAnswer || ''}
                onChange={(e) => handleAnswerChange(parseFloat(e.target.value))}
                placeholder="Entrez votre réponse"
                className="w-full p-2 border rounded-md"
              />
            )}
            
            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <span>Difficulté: {question.difficulty}</span>
              <span>{question.points} points</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningModule;
