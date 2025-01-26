// src/styles/theme/modern.js
export const modernTheme = {
    layout: {
        maxWidth: '1200px',
        containerPadding: 'var(--spacing-xl)',
    },
    header: {
        nameGradient: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
        professionSize: {
            desktop: '1.4em',
            tablet: '1.2em',
            mobile: '1em',
        },
        professionWeight: '300',
    },
    cards: {
        background: 'var(--surface-color)',
        borderRadius: 'var(--border-radius-lg)',
        shadow: 'var(--box-shadow-lg)',
        hoverTransform: 'translateY(-2px)',
        transition: 'all 0.3s ease',
    },
    timeline: {
        dotSize: '12px',
        lineWidth: '2px',
        lineColor: 'var(--border-color)',
    }
};