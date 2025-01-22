import { useState } from "react";
import Education from "./Education";
import Experience from "./Experience";
import Language from "./Language";
import PersonalInfo from "./PersonalInfo";
import Skills from "./Skills";
import ProfessionalSummary from "./ProfessionalSummary";
import Reference from "./Reference";
import SocialMedia from "./SocialMedia";
import Certification from "./Certification";
import Interests from "./Interests";

const CVFormContainer = ({ onCVCreated }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    professionalSummary: "",
    skills: [],
    interest: [],
    certification: [],
    language: [],
    reference: [],
    socialMedia: [],
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const updateFormData = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFormCompletion = async () => {
    // Validate required personal info
    const requiredFields = ["first_name", "last_name", "contact_number"];
    const missingFields = requiredFields.filter(
      (field) => !formData.personalInfo[field]
    );

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return;
    }

    const formattedData = {
      // Personal Info
      first_name: formData.personalInfo.first_name,
      last_name: formData.personalInfo.last_name,
      email: formData.personalInfo.email || "",
      address: formData.personalInfo.address || "",
      city: formData.personalInfo.city || "",
      country: formData.personalInfo.country || "",
      contact_number: formData.personalInfo.contact_number,
      interest: formData.interest || [],
      additional_information: formData.personalInfo.additionalInfo || "",

      // Related objects
      education: (formData.education || []).map((edu) => ({
        school_name: edu.school_name,
        degree: edu.degree,
        field_of_study: edu.field_of_study,
        start_date: edu.start_date,
        end_date: edu.end_date,
        current: edu.current || false,
      })),

      experience: (formData.experience || []).map((exp) => ({
        job_title: exp.job_title,
        company_name: exp.company_name,
        start_date: exp.start_date,
        end_date: exp.end_date,
        current: exp.current || false,
        description: exp.description,
      })),

      skill: (formData.skills || []).map((skill) => ({
        name: skill.name,
      })),

      language: (formData.language || []).map((lang) => ({
        name: lang.name,
      })),

      reference: (formData.reference || []).map((ref) => ({
        name: ref.name,
        title: ref.title,
        company: ref.company,
        reference_type: ref.type,
        email: ref.email,
        phone: ref.phone,
      })),

      socialMedia: (formData.socialMedia || []).map((social) => ({
        platform: social.platform,
        url: social.url,
      })),

      professionalSummary: [
        {
          summary: formData.professionalSummary || "",
        },
      ],

      certification: (formData.certification || []).map((cert) => ({
        certification_name: cert.certification_name,
        certification_date: cert.certification_date,
        certification_link: cert.certification_link,
      })),
    };

    console.log("Submitting formatted CV data:", formattedData);
    onCVCreated(formattedData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfo
            data={formData.personalInfo}
            onUpdate={(data) => updateFormData("personalInfo", data)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ProfessionalSummary
            data={formData.professionalSummary}
            onUpdate={(data) => updateFormData("professionalSummary", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <Education
            data={formData.education}
            onUpdate={(data) => updateFormData("education", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <Experience
            data={formData.experience}
            onUpdate={(data) => updateFormData("experience", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <Skills
            data={formData.skills}
            onUpdate={(data) => updateFormData("skills", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <Interests
            data={formData.interest}
            onUpdate={(data) => updateFormData("interest", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 7:
        return (
          <Certification
            data={formData.certification}
            onUpdate={(data) => updateFormData("certification", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 8:
        return (
          <Language
            data={formData.language}
            onUpdate={(data) => updateFormData("language", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 9:
        return (
          <Reference
            data={formData.reference}
            onUpdate={(data) => updateFormData("reference", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 10:
        return (
          <SocialMedia
            data={formData.socialMedia}
            onUpdate={(data) => updateFormData("socialMedia", data)}
            onNext={handleFormCompletion}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return <div className="container mx-auto px-4 py-8">{renderStep()}</div>;
};

export default CVFormContainer;
