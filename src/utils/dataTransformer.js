export const transformCVData = (cvFormData) => {
    return {
        profile: {
            name: `${cvFormData.personalInfo?.first_name || ''} ${cvFormData.personalInfo?.last_name || ''}`.trim(),
            title: cvFormData.personalInfo?.profession || '',
            profession: cvFormData.personalInfo?.profession || '',
            image: cvFormData.personalInfo?.image || '',
            summary: cvFormData.summary || '',
            socials: (cvFormData.socialMedia || []).map(social => ({
                platform: social.platform,
                username: social.username || social.url.split('/').pop() || '',
                icon: `brands fa-${social.platform.toLowerCase()}`,
                url: social.url || ''
            }))
        },
        contacts: [
            { 
                type: 'email', 
                value: cvFormData.personalInfo?.email || '',
                url: cvFormData.personalInfo?.email ? `mailto:${cvFormData.personalInfo.email}` : '',
                icon: `solid fa-envelope`
            },
            { 
                type: 'phone', 
                value: cvFormData.personalInfo?.contact_number || '',
                icon: `solid fa-phone`
            },
            { 
                type: 'location', 
                value: [
                    cvFormData.personalInfo?.address,
                    cvFormData.personalInfo?.city,
                    cvFormData.personalInfo?.country
                ].filter(Boolean).join(', '),
                icon: `solid fa-location-dot`
            },
            ...(cvFormData.socialMedia || []).map(social => ({
                type: social.platform.toLowerCase(),
                value: social.url || '',
                url: social.url || '',
                icon: `brands fa-${social.platform.toLowerCase()}`
            }))
        ].filter(contact => contact.value),
        professionalSummary: cvFormData.summary || '',
        workExperience: (cvFormData.experience || []).map(exp => ({
            title: exp.job_title || '',
            company: exp.company_name || '',
            location: exp.location || '',
            period: `${exp.start_date || ''} – ${exp.current ? 'Present' : exp.end_date || ''}`,
            responsibilities: exp.job_description ? exp.job_description.split('\\n').filter(Boolean) : [],
            achievements: exp.achievements ? exp.achievements.split('\\n').filter(Boolean) : []
        })),
        education: (cvFormData.education || []).map(edu => ({
            degree: edu.degree || '',
            institution: edu.school_name || '',
            location: edu.location || '',
            year: `${edu.start_date || ''} - ${edu.current ? 'Present' : edu.end_date || ''}`,
            details: [
                edu.field_of_study,
                edu.description
            ].filter(Boolean).join('. ')
        })),
        skills: (cvFormData.skills || []).map(skill => ({
            name: skill.name || skill.skill_name || '',
            level: parseInt(skill.level || skill.skill_level || '0'),
            category: skill.category || 'Technical'
        })),
        languages: (cvFormData.languages || []).map(lang => ({
            name: lang.language || '',
            level: lang.proficiency || ''
        })),
        certifications: (cvFormData.certifications || []).map(cert => ({
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || '',
            description: cert.description || ''
        })),
        interests: (cvFormData.interests || []).map(interest => ({
            name: interest.name || ''
        })),
        references: (cvFormData.references || []).map(ref => ({
            name: ref.name || '',
            title: ref.title || '',
            company: ref.company || '',
            contact: ref.contact || ''
        }))
    };
};