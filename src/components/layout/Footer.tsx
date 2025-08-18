import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AiConsultationForm from "@/components/consultation/AiConsultationForm";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEnglish = location.pathname.startsWith("/en");
  const isRoiPage = location.pathname === "/calculroi" || location.pathname === "/en/roicalcul";
  const isConsultationPage = location.pathname === "/consultation" || location.pathname === "/en/consultation";

  return (
    <>
      {!isRoiPage && (
        <>
          <div className="bg-sapphire text-white py-12 px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 flex flex-col items-center justify-center gap-2">
                <span role="img" aria-label="analyse">📊</span>
                <span>
                  {isEnglish 
                    ? "Free Quick Analysis:" 
                    : "Brève analyse gratuite :"}
                </span>
                <span>
                  {isEnglish 
                    ? "automate, save, perform" 
                    : "automatisez, économisez, performez"}
                </span>
              </h2>
              <p className="text-lg mb-6">
                {isEnglish 
                  ? "Use our free tools to discover which tasks in your business have the highest potential for automation, savings and performance gains."
                  : "Utilisez nos outils gratuits pour découvrir quelles tâches de votre entreprise ont le plus fort potentiel d'automatisation, d'économies et de gains de performance."}
              </p>
              <ul className="mb-8 text-base text-gold-200 list-disc list-inside text-left max-w-md mx-auto">
                <li>
                  {isEnglish 
                    ? "Identify your most expensive processes"
                    : "Identifiez vos processus les plus coûteux"}
                </li>
                <li>
                  {isEnglish 
                    ? "Calculate your potential savings in just a few clicks"
                    : "Calculez vos économies potentielles en quelques clics"}
                </li>
                <li>
                  {isEnglish 
                    ? "Get a personalized estimate of your return on investment"
                    : "Obtenez une estimation personnalisée de votre retour sur l'investissement"}
                </li>
              </ul>
              <Link
                to={isEnglish ? "/en/rentabilite" : "/fr/rentabilite"}
                className="bg-gold hover:bg-gold-600 text-charcoal-900 font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 text-lg"
              >
                {isEnglish 
                  ? "Profitability"
                  : "Rentabilité"}
              </Link>
            </div>
          </div>

          {!isConsultationPage && (
            <div className="bg-white text-charcoal-900 py-12 px-4 text-center border-t border-gold/20">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                  <span role="img" aria-label="chrono">⏱️</span>
                  {isEnglish 
                    ? "Get your personalized automation assessment – Free and fast!"
                    : "Obtenez votre diagnostic d'automatisation personnalisé – Gratuit et rapide !"}
                </h2>
                <p className="text-lg mb-6">
                  {isEnglish 
                    ? "Get a free evaluation of the automation potential of a specific task in your business. Receive an expert report including:"
                    : "Faites évaluer gratuitement le potentiel d'automatisation d'une tâche précise de votre entreprise. Recevez un rapport d'expert incluant :"}
                </p>
                <ul className="mb-8 text-base text-sapphire list-disc list-inside text-left max-w-md mx-auto">
                  <li>
                    {isEnglish 
                      ? "Potential savings and return on investment"
                      : "Les économies potentielles et le retour sur investissement"}
                  </li>
                  <li>
                    {isEnglish 
                      ? "Concrete implementation suggestions"
                      : "Des suggestions concrètes d'implantation"}
                  </li>
                  <li>
                    {isEnglish 
                      ? "A custom action plan for the next step"
                      : "Un plan d'action sur-mesure pour passer à l'étape suivante"}
                  </li>
                </ul>
                <div className="font-semibold text-sapphire mb-6">
                  {isEnglish 
                    ? "Join the decision-makers who are already optimizing their operations with AI and make a difference in your sector."
                    : "Rejoignez les décideurs qui optimisent déjà leurs opérations grâce à l'IA et faites la différence dans votre secteur."}
                </div>
                <Link
                  to={isEnglish ? "/en/potential" : "/fr/potentiel"}
                  className="bg-gold hover:bg-gold-600 text-charcoal-900 font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 text-lg mb-8"
                >
                  {isEnglish 
                    ? "Get my free assessment"
                    : "Obtenir mon évaluation gratuite"}
                </Link>
              </div>
            </div>
          )}
        </>
      )}
      <footer className="relative overflow-hidden">
        {/* Dynamic background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900 via-charcoal-900 to-charcoal-800 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-sapphire to-gold z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-sapphire/5 blur-[100px] z-0"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-gold/5 blur-[120px] z-0"></div>
        
        <div id="contact-section" className="container-custom section-padding relative z-10">
          {/* Bloc supprimé : ancien CTA potentiel d'automatisation IA */}
        </div>
      </footer>
    </>
  );
};

export default Footer;
