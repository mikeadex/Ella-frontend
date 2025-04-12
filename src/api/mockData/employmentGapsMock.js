/**
 * Mock data for employment gaps analysis
 * This matches the structure returned by our backend employment_gaps.py analyzer
 */

export const employmentGapsMock = {
  "summary": "Your CV shows 2 significant employment gaps, including a 14-month period from March 2021 - March 2022. These gaps may raise questions with potential employers if not properly addressed.",
  "gaps": [
    {
      "start_date": "2021-01-15",
      "end_date": "2022-03-20",
      "period": "January 2021 - March 2022",
      "duration_months": 14,
      "duration_years": 1.2,
      "significance": "high",
      "explanation": null,
      "recommendation": "Consider adding a detailed explanation for this significant gap. Include any freelance work, education, professional development, or personal projects that demonstrate continued skill development."
    },
    {
      "start_date": "2019-03-01",
      "end_date": "2019-11-15",
      "period": "March 2019 - November 2019",
      "duration_months": 8,
      "duration_years": null,
      "significance": "medium",
      "explanation": "Some consulting work mentioned, but lacks specifics",
      "recommendation": "Brief explanation recommended. Highlight any skills developed or professional activities during this period."
    }
  ],
  "has_significant_gaps": true,
  "total_gap_months": 22,
  "addressing_tips": [
    "Be honest but strategic about explaining gaps in your cover letter",
    "Focus on skills and knowledge gained during employment gaps",
    "Consider using a functional resume format to emphasize skills over chronology",
    "Include relevant volunteer work, courses, or certifications obtained during gaps",
    "Prepare concise, positive explanations for interviews"
  ],
  "impact": "Your recent employment gaps may affect how recruiters perceive your career consistency. Without explanation, some automated screening systems might flag your application for review, potentially affecting initial selection phases."
};

export default employmentGapsMock;
