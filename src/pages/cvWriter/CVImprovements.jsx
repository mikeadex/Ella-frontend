import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: var(--text-color);
  margin: 0;
`;

const ImprovementSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
`;

const SectionTitle = styled.h2`
  color: var(--text-color);
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const ContentComparison = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ContentBox = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: ${props => props.improved ? '#f0fdf4' : '#fff'};
`;

const ContentTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.improved ? '#166534' : 'var(--text-color)'};
`;

const ContentText = styled.p`
  white-space: pre-wrap;
  color: var(--text-color);
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  text-align: center;
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

function CVImprovements() {
  const { cvId } = useParams();
  const [improvements, setImprovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const fetchImprovements = async () => {
      try {
        const response = await api.get(`/cv_writer/cv/improvements/${cvId}/`);
        
        if (response.data.improvements && response.data.improvements.length === 0 && retryCount < maxRetries) {
          // If no improvements yet and within retry limit, try again after 2 seconds
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
          return;
        }
        
        setImprovements(response.data.improvements || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching improvements:', error);
        let errorMessage = 'Failed to load CV improvements. ';
        
        if (error.response?.data?.error?.includes('API key')) {
          errorMessage += 'The AI service is not properly configured. Please contact support.';
        } else if (error.response?.status === 404) {
          errorMessage += 'CV not found or access denied.';
        } else {
          errorMessage += 'Please try again later.';
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (loading) {
      fetchImprovements();
    }
  }, [cvId, retryCount]);

  if (loading) {
    return (
      <Container>
        <LoadingOverlay>
          <div>Loading improvements...</div>
        </LoadingOverlay>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>CV Improvements</Title>
      </Header>

      {improvements.length === 0 ? (
        <ErrorMessage>No improvements found for this CV.</ErrorMessage>
      ) : (
        improvements.map((improvement, index) => (
          <ImprovementSection key={index}>
            <SectionTitle>{improvement.section_type}</SectionTitle>
            <ContentComparison>
              <ContentBox>
                <ContentTitle>Original Content</ContentTitle>
                <ContentText>{improvement.original_content}</ContentText>
              </ContentBox>
              <ContentBox improved>
                <ContentTitle improved>Improved Content</ContentTitle>
                <ContentText>{improvement.improved_content}</ContentText>
              </ContentBox>
            </ContentComparison>
          </ImprovementSection>
        ))
      )}
    </Container>
  );
}

export default CVImprovements;
