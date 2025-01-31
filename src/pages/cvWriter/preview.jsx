import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { sharedStyles } from '../../utils/styling';
import Notification from '../../components/common/Notification';

const CVPreview = () => {
  const { cvId } = useParams();
  const location = useLocation();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(
    location.state?.message ? {
      type: location.state.type || 'info',
      message: location.state.message
    } : null
  );

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await axiosInstance.get(`/api/cv_writer/cv/${cvId}/`);
        setCV(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching CV:', err);
        setError('Failed to load CV. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [cvId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className={sharedStyles.card}>
        <div className={sharedStyles.cardHeader}>
          <h2 className="text-2xl font-bold">CV Preview</h2>
        </div>

        <div className={sharedStyles.cardBody}>
          {cv ? (
            <div className="space-y-6">
              {/* Personal Info */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{cv.first_name} {cv.last_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{cv.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{cv.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{cv.location}</p>
                  </div>
                </div>
              </section>

              {/* Professional Summary */}
              {cv.professional_summary && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Professional Summary</h3>
                  <div className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: cv.professional_summary }} 
                  />
                </section>
              )}

              {/* Experience */}
              {cv.experience && cv.experience.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Experience</h3>
                  <div className="space-y-6">
                    {cv.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{exp.position}</h4>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="text-gray-600">{exp.location}</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                          </p>
                        </div>
                        <div className="mt-2 prose max-w-none" 
                          dangerouslySetInnerHTML={{ __html: exp.description }} 
                        />
                        {exp.achievements && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-700 mb-2">Key Achievements</h5>
                            <div className="prose max-w-none" 
                              dangerouslySetInnerHTML={{ __html: exp.achievements }} 
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {cv.education && cv.education.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Education</h3>
                  <div className="space-y-6">
                    {cv.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.institution}</p>
                            <p className="text-gray-600">{edu.field_of_study}</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {edu.start_date} - {edu.current ? 'Present' : edu.end_date}
                          </p>
                        </div>
                        {edu.description && (
                          <div className="mt-2 prose max-w-none" 
                            dangerouslySetInnerHTML={{ __html: edu.description }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {cv.skills && cv.skills.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Skills</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {cv.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex-grow">
                          {skill.name}
                        </span>
                        {skill.level && (
                          <span className="text-sm text-gray-500">
                            {skill.level}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {cv.certifications && cv.certifications.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                  <div className="grid gap-4">
                    {cv.certifications.map((cert, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{cert.name}</h4>
                            <p className="text-gray-600">{cert.issuing_organization}</p>
                          </div>
                          {cert.issue_date && (
                            <p className="text-sm text-gray-500">
                              {cert.issue_date}
                              {cert.expiry_date && ` - ${cert.expiry_date}`}
                            </p>
                          )}
                        </div>
                        {cert.credential_id && (
                          <p className="text-sm text-gray-600 mt-1">
                            Credential ID: {cert.credential_id}
                          </p>
                        )}
                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm mt-1 block"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {cv.languages && cv.languages.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Languages</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {cv.languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-sm text-gray-600">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Interests */}
              {cv.interests && cv.interests.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {cv.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        {interest.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* References */}
              {cv.references && cv.references.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">References</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {cv.references.map((ref, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold">{ref.name}</h4>
                        <p className="text-gray-600">{ref.position}</p>
                        <p className="text-gray-600">{ref.company}</p>
                        {ref.email && (
                          <p className="text-gray-600">
                            <span className="font-medium">Email:</span> {ref.email}
                          </p>
                        )}
                        {ref.phone && (
                          <p className="text-gray-600">
                            <span className="font-medium">Phone:</span> {ref.phone}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Social Media */}
              {cv.social_media && cv.social_media.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Social Media</h3>
                  <div className="space-y-2">
                    {cv.social_media.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                      >
                        <span className="font-medium">{social.platform}</span>
                        <span className="text-gray-500">→</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Additional Information */}
              {cv.additional_information && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                  <div className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: cv.additional_information }} 
                  />
                </section>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No CV data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
