import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { sharedStyles } from '../../utils/styling';
import Notification from '../../components/common/Notification';
import CVSectionEditor from '../../components/CVForm/CVSectionEditor';
import { PencilIcon } from '@heroicons/react/24/outline';

const CVPreview = () => {
  const { cvId } = useParams();
  const location = useLocation();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [notification, setNotification] = useState(
    location.state?.message ? {
      type: location.state.type || 'info',
      message: location.state.message
    } : null
  );

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

  useEffect(() => {
    fetchCV();
  }, [cvId]);

  const handleEdit = (section, data) => {
    setEditingSection(section);
    setEditingData(data);
  };

  const handleUpdate = async (updatedData) => {
    await fetchCV();
    setNotification({
      type: 'success',
      message: 'Successfully updated CV section'
    });
  };

  const SectionHeader = ({ title, onEdit, data }) => (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <button
        onClick={() => onEdit(title, data)}
        className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
    </div>
  );

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
                <SectionHeader 
                  title="Personal Information" 
                  onEdit={handleEdit}
                  data={{
                    first_name: cv.first_name,
                    last_name: cv.last_name,
                    email: cv.email,
                    phone: cv.phone,
                    location: cv.location
                  }}
                />
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
                <section>
                  <SectionHeader 
                    title="Professional Summary" 
                    onEdit={handleEdit}
                    data={{ professional_summary: cv.professional_summary }}
                  />
                  <div className="prose max-w-none dark:prose-invert">
                    {cv.professional_summary}
                  </div>
                </section>
              )}

              {/* Education */}
              {cv.education && cv.education.length > 0 && (
                <section>
                  <SectionHeader 
                    title="Education" 
                    onEdit={handleEdit}
                    data={cv.education}
                  />
                  <div className="space-y-4">
                    {cv.education.map((edu) => (
                      <div key={edu.id} className="border-l-4 border-indigo-500 pl-4">
                        <h4 className="font-semibold">{edu.institution}</h4>
                        <p className="text-gray-600">{edu.degree}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {cv.experience && cv.experience.length > 0 && (
                <section>
                  <SectionHeader 
                    title="Experience" 
                    onEdit={handleEdit}
                    data={cv.experience}
                  />
                  <div className="space-y-6">
                    {cv.experience.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-indigo-500 pl-4">
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                        </p>
                        <div className="mt-2 prose max-w-none dark:prose-invert">
                          {exp.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {cv.skills && cv.skills.length > 0 && (
                <section>
                  <SectionHeader 
                    title="Skills" 
                    onEdit={handleEdit}
                    data={cv.skills}
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {cv.skills.map((skill) => (
                      <div key={skill.id} className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span>{skill.skill_name}</span>
                        <span className="text-sm text-gray-500">({skill.skill_level})</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No CV data available
            </div>
          )}
        </div>
      </div>

      {/* Section Editor Modal */}
      <CVSectionEditor
        isOpen={!!editingSection}
        onClose={() => {
          setEditingSection(null);
          setEditingData(null);
        }}
        section={editingSection}
        data={editingData}
        cvId={cvId}
        onUpdate={handleUpdate}
        sectionType={editingSection?.toLowerCase().replace(/\s+/g, '')}
      />
    </div>
  );
};

export default CVPreview;
