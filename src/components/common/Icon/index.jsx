import styled from 'styled-components';

const IconWrapper = styled.i`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.$size || '1rem'};
  color: ${props => props.$color || 'inherit'};
  ${props => props.$marginRight && `margin-right: ${props.$marginRight}`};
`;

export const Icon = ({ name, size, color, className, marginRight }) => (
  <IconWrapper
    className={`fa-solid fa-${name} ${className || ''}`}
    $size={size}
    $color={color}
    $marginRight={marginRight}
    aria-hidden="true"
  />
);