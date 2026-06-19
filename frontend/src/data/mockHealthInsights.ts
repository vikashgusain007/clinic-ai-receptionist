import type { HealthInsightsData } from '@/types'

export const mockHealthInsights: HealthInsightsData = {
  recentRecords: [
    {
      id: '1',
      title: 'Complete Blood Count',
      date: '2026-06-10',
      type: 'Lab Result',
      summary: 'All values within normal range. Hemoglobin 14.2 g/dL.',
    },
    {
      id: '2',
      title: 'Annual Physical Exam',
      date: '2026-05-22',
      type: 'Visit',
      summary: 'General wellness check. Blood pressure 118/76 mmHg.',
    },
    {
      id: '3',
      title: 'Vitamin D Panel',
      date: '2026-04-15',
      type: 'Lab Result',
      summary: 'Vitamin D level slightly below optimal at 28 ng/mL.',
    },
  ],
  storedMemories: [
    {
      id: '1',
      content: 'Patient reported mild seasonal allergies in spring.',
      category: 'Allergy',
      updatedAt: '2026-06-01',
    },
    {
      id: '2',
      content: 'Prefers morning appointments when possible.',
      category: 'Preference',
      updatedAt: '2026-05-18',
    },
    {
      id: '3',
      content: 'Currently taking daily multivitamin and omega-3 supplement.',
      category: 'Medication',
      updatedAt: '2026-05-10',
    },
  ],
  timeline: [
    {
      id: '1',
      title: 'Follow-up Blood Work',
      date: '2026-07-01',
      description: 'Scheduled recheck for vitamin D levels.',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'CBC Results Reviewed',
      date: '2026-06-10',
      description: 'Lab results reviewed — no action needed.',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Annual Physical',
      date: '2026-05-22',
      description: 'Completed wellness exam with primary care.',
      status: 'completed',
    },
    {
      id: '4',
      title: 'Medication Review',
      date: '2026-06-25',
      description: 'Review current supplements and dosages.',
      status: 'review',
    },
  ],
}
