
import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { formatPhoneForDisplay } from "@/utils/formatters";
import { useLocation } from "react-router-dom";

// Validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Courriel invalide" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" })
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const useContactForm = () => {
  const { toast } = useToast();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith("/en");
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear the error when the user modifies the field
    if (errors[name as keyof ContactFormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  // Fonction pour gérer la perte de focus du champ téléphone
  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Appliquer le formatage uniquement quand l'utilisateur quitte le champ
    setFormData({
      ...formData,
      phone: formatPhoneForDisplay(value, true)
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: ""
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    try {
      contactFormSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Formatage final du numéro de téléphone avant validation et envoi
    const finalFormData = {
      ...formData,
      phone: formData.phone ? formatPhoneForDisplay(formData.phone, true) : ""
    };
    
    setFormData(finalFormData);
    
    if (!validateForm()) {
      toast({
        title: isEnglish ? "Validation Error" : "Erreur de validation",
        description: isEnglish ? "Please correct the errors in the form." : "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: isEnglish ? "Message sent!" : "Message envoyé!",
        description: isEnglish ? "We will respond as soon as possible." : "Nous vous répondrons dans les plus brefs délais.",
        variant: "default",
      });
      resetForm();
      setIsSubmitting(false);
    }, 1500);
  };

  return {
    formData,
    errors,
    isSubmitting,
    isEnglish,
    handleChange,
    handlePhoneBlur,
    handleSubmit,
    resetForm
  };
};
