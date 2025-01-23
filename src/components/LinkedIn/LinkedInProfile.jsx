import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { linkedInService } from '../../services/linkedInService';
import { Button, Alert, Spinner } from '../common';

const LinkedInProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [syncStatus, setSyncStatus] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await linkedInService.getProfile();
            setProfile(data);
            setSyncStatus(data.sync_status);
        } catch (err) {
            setError('Failed to load LinkedIn profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        try {
            setLoading(true);
            const response = await linkedInService.syncProfile(profile.id);
            setSyncStatus(response.status);
            // Poll for sync status
            startPolling(profile.id);
        } catch (err) {
            setError('Failed to sync LinkedIn profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startPolling = (profileId) => {
        const pollInterval = setInterval(async () => {
            try {
                const data = await linkedInService.getProfile(profileId);
                setSyncStatus(data.sync_status);
                if (data.sync_status === 'completed' || data.sync_status === 'failed') {
                    clearInterval(pollInterval);
                    if (data.sync_status === 'completed') {
                        fetchProfile(); // Refresh profile data
                    }
                }
            } catch (err) {
                console.error('Polling error:', err);
                clearInterval(pollInterval);
            }
        }, 5000); // Poll every 5 seconds
    };

    const handleGenerateCV = async () => {
        try {
            setLoading(true);
            const response = await linkedInService.generateCV(profile.id);
            navigate(`/cv/${response.cv_id}`);
        } catch (err) {
            setError('Failed to generate CV');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return <Spinner />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">LinkedIn Profile</h2>

                {error && (
                    <Alert type="error" message={error} onClose={() => setError(null)} />
                )}

                {!profile ? (
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">No LinkedIn profile connected</p>
                        <Button onClick={() => navigate('/linkedin/connect')}>
                            Connect LinkedIn
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Last synced: {profile.last_synced ? new Date(profile.last_synced).toLocaleString() : 'Never'}
                            </p>
                            <p className="text-gray-600">
                                Status: <span className={`font-semibold ${syncStatus === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                                    {syncStatus}
                                </span>
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Education Section */}
                            {profile.education && profile.education.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Education</h3>
                                    <div className="space-y-4">
                                        {profile.education.map((edu) => (
                                            <div key={edu.id} className="border-l-4 border-blue-500 pl-4">
                                                <h4 className="font-medium">{edu.school_name}</h4>
                                                <p className="text-gray-600">{edu.degree}</p>
                                                <p className="text-sm text-gray-500">
                                                    {edu.start_date} - {edu.end_date || 'Present'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience Section */}
                            {profile.experience && profile.experience.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Experience</h3>
                                    <div className="space-y-4">
                                        {profile.experience.map((exp) => (
                                            <div key={exp.id} className="border-l-4 border-green-500 pl-4">
                                                <h4 className="font-medium">{exp.title}</h4>
                                                <p className="text-gray-600">{exp.company_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {exp.start_date} - {exp.end_date || 'Present'}
                                                </p>
                                                <p className="text-gray-600 mt-2">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills Section */}
                            {profile.skills && profile.skills.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                                            >
                                                {skill.name}
                                                {skill.endorsements > 0 && (
                                                    <span className="ml-1 text-blue-600">
                                                        ({skill.endorsements})
                                                    </span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 space-x-4">
                            <Button
                                onClick={handleSync}
                                disabled={loading || syncStatus === 'in_progress'}
                            >
                                {loading ? 'Syncing...' : 'Sync Profile'}
                            </Button>
                            <Button
                                onClick={handleGenerateCV}
                                disabled={loading || syncStatus !== 'completed'}
                                variant="secondary"
                            >
                                Generate CV
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LinkedInProfile;
