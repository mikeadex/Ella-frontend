import styled from "styled-components";
import { H1, Text } from "../../common/Typography";
import { SocialLink } from "../../common/SocialLink";
import { Card } from "../../common/Card";

const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px'
};

const ProfileWrapper = styled(Card)`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.98)
  );
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--box-shadow-lg);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  @media (max-width: ${breakpoints.tablet}) {
    padding: var(--spacing-xl);
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      to right,
      var(--accent-color),
      var(--accent-light)
    );
  }
`;

const ProfileContent = styled.div`
  display: flex;
  gap: var(--spacing-2xl);
  align-items: flex-start;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-xl);
  }

  @media (max-width: ${breakpoints.mobile}) {
    gap: var(--spacing-lg);
  }
`;

const ProfileImage = styled.div`
  flex: 0 0 220px;
  height: 220px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow-md);
  border: 4px solid #fff;
  position: relative;

  @media (max-width: ${breakpoints.tablet}) {
    flex: 0 0 180px;
    height: 180px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    flex: 0 0 150px;
    height: 150px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
    border-radius: var(--border-radius-lg);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding-top: var(--spacing-sm);

  @media (max-width: ${breakpoints.tablet}) {
    padding-top: 0;
    gap: var(--spacing-md);
  }
`;

const StyledH1 = styled(H1)`
  @media (max-width: ${breakpoints.mobile}) {
    margin-bottom: var(--spacing-xs);
  }
`;

const Profession = styled(Text)`
  font-size: 1.4em;
  font-weight: 300;
  color: var(--secondary-color);
  margin: 0;
  letter-spacing: -0.01em;
  opacity: 0.9;
  line-height: 1.2;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2em;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.1em;
    margin-bottom: var(--spacing-sm);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.tablet}) {
    justify-content: center;
  }

  @media (max-width: ${breakpoints.mobile}) {
    gap: var(--spacing-sm);
    margin-top: 0;
  }
`;

export const ProfileSection = ({ name, profession, image, socials }) => (
  <ProfileWrapper>
    <ProfileContent>
      <ProfileImage>
        <img src={image} alt={`${name}'s profile`} />
      </ProfileImage>
      <ProfileInfo>
        <StyledH1>{name}</StyledH1>
        <Profession>{profession}</Profession>
        <SocialLinks>
          {socials?.map((social, index) => (
            <SocialLink key={index} {...social} />
          ))}
        </SocialLinks>
      </ProfileInfo>
    </ProfileContent>
  </ProfileWrapper>
);