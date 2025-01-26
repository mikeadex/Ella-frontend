import styled from "styled-components";
import { Section } from "../../common/Section";
import { Text } from "../../common/Typography";

const Summary = styled(Text)`
    font-size: 1em;
    line-height: 1.8;
    color: var(--text-light);
    margin-top: var(--spacing-md);

    @media (max-width: 768px) {
        font-size: 0.95em;
        line-height: 1.7;
    }
`;

export const ProfessionalSummary = ({ summary, onEdit }) => (
    <Section title="Professional Summary" onAdd={onEdit}>
        <Summary>{summary}</Summary>
    </Section>
)