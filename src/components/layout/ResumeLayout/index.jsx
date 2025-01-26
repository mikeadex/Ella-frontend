import styled from 'styled-components';
import { ProfileSection } from '../ProfileSection';
import { ContactInfo } from '../ContactInfo';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-xl);
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-xl);
  align-items: start;
`;

const Sidebar = styled.aside`
  position: sticky;
  top: var(--spacing-xl);
`;

const Content = styled.div``;

export const ResumeLayout = ({
  profile,
  contactInfo,
  children
}) => (
  <Container>
    <ProfileSection {...profile} />
    <MainContent>
      <Sidebar>
        <ContactInfo {...contactInfo} />
        {/* Other sidebar components will go here */}
      </Sidebar>
      <Content>
        {children}
      </Content>
    </MainContent>
  </Container>
);