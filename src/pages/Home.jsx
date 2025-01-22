import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaRegFileAlt, FaRegLightbulb, FaRegClock } from 'react-icons/fa';
import Navbar from '../components/Navbar/Navbar';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background) 0%, #f8f9fa 100%);
  padding-top: 48px; // Add padding for the fixed navbar
`;

const Hero = styled.section`
  padding: 6rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, #2b6cb0 100%);
  color: white;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
  background: white;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Features = styled.section`
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  color: var(--text-muted);
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  color: var(--text-color);
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  color: var(--text-muted);
  font-size: 1.125rem;
  max-width: 600px;
  margin: 0 auto;
`;

const CTASection = styled.section`
  padding: 5rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #f6f7f9 0%, #edf2f7 100%);
`;

function Home() {
  return (
    <Container>
      <Navbar />
      <Hero>
        <HeroContent>
          <Title>Create Professional CVs with Ease</Title>
          <Subtitle>
            Build stunning, ATS-friendly CVs in minutes. Stand out from the crowd
            and land your dream job with our intelligent CV builder.
          </Subtitle>
          <CTAButton to="/cv-writer/write">Create Your CV Now</CTAButton>
        </HeroContent>
      </Hero>

      <Features>
        <SectionTitle>Why Choose Our CV Builder?</SectionTitle>
        <SectionSubtitle>
          We combine modern design with powerful features to help you create
          the perfect CV for your career goals.
        </SectionSubtitle>
        
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaRegFileAlt />
            </FeatureIcon>
            <FeatureTitle>Professional Templates</FeatureTitle>
            <FeatureDescription>
              Choose from a variety of professionally designed templates that
              are proven to catch recruiters' attention.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaRegLightbulb />
            </FeatureIcon>
            <FeatureTitle>Smart Suggestions</FeatureTitle>
            <FeatureDescription>
              Get intelligent content suggestions and tips to help you write
              compelling descriptions for your experience and skills.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaRegClock />
            </FeatureIcon>
            <FeatureTitle>Quick & Easy</FeatureTitle>
            <FeatureDescription>
              Create a professional CV in minutes with our intuitive interface
              and step-by-step guidance.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </Features>

      <CTASection>
        <SectionTitle>Ready to Build Your CV?</SectionTitle>
        <SectionSubtitle>
          Join thousands of professionals who have already created successful CVs
          with our platform.
        </SectionSubtitle>
        <div style={{ marginTop: '2rem' }}>
          <CTAButton to="/cv-writer/write">Get Started Now</CTAButton>
        </div>
      </CTASection>
    </Container>
  );
}

export default Home;