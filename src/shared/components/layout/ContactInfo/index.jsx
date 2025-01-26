import styled from 'styled-components';
import { Section } from '../../common/Section';
import { Icon } from '../../common/Icon';

const ContactList = styled.ul`
    list-style: none;
    padding: 0;
`;

const ContactItem = styled.li`
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-xs) 0;

    a {
        color: var(--primary-color);
        text-decoration: none;
        
        &:hover {
            color: var(--accent-color);
        }
    }
`;

const contactTypes = {
    phone: { icon: 'phone', link: (value) => `tel:${value}` },
    email: { icon: 'at', link: (value) => `mailto:${value}` },
    website: { icon: 'globe', link: (value) => value },
    location: { icon: 'location-dot', link: null },
};

export const ContactInfo = ({ contacts, onAdd }) => (
    <Section title="CONTACT INFORMATION" onAdd={onAdd}>
        <ContactList>
            {contacts.map(({ type, value }, index) => (
                <ContactItem key={index}>
                    <Icon name={contactTypes[type].icon} marginRight="var(--spacing-sm)" />
                    {contactTypes[type].link ? (
                        <a href={contactTypes[type].link(value)} target="_blank" rel="noopener noreferrer">
                            {value}
                        </a>
                    ) : (
                        <span>{value}</span>
                    )}
                </ContactItem>
            ))}
        </ContactList>
    </Section>
);
