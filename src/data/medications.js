export const medications = [
  {
    id: 1,
    name: 'Metformin',
    activeIngredient: 'Metformin hydrochloride',
    dosage: '500 mg',
    frequency: 'Twice daily',
    schedule: ['08:00', '20:00'],
    startDate: '2026-01-15',
    status: 'Active',
    image: null,
  },
  {
    id: 2,
    name: 'Lisinopril',
    activeIngredient: 'Lisinopril',
    dosage: '10 mg',
    frequency: 'Once daily',
    schedule: ['09:00'],
    startDate: '2026-02-01',
    status: 'Active',
    image: null,
  },
  {
    id: 3,
    name: 'Atorvastatin',
    activeIngredient: 'Atorvastatin calcium',
    dosage: '20 mg',
    frequency: 'Once daily',
    schedule: ['21:00'],
    startDate: '2026-03-10',
    status: 'Active',
    image: null,
  },
  {
    id: 4,
    name: 'Glipizide',
    activeIngredient: 'Glipizide',
    dosage: '5 mg',
    frequency: 'Once daily',
    schedule: ['07:30'],
    startDate: '2026-04-05',
    status: 'On Hold',
    image: null,
  },
];

export const cheaperAlternatives = {
  'Metformin hydrochloride': [
    { name: 'Metformin (Generic)', brand: 'Teva', price: '$4.50/month', dosage: '500 mg' },
    { name: 'Glucophage XR (Generic equivalent)', brand: 'Mylan', price: '$5.20/month', dosage: '500 mg' },
  ],
  'Lisinopril': [
    { name: 'Lisinopril (Generic)', brand: 'Sandoz', price: '$3.25/month', dosage: '10 mg' },
    { name: 'Prinivil (Generic equivalent)', brand: 'Accord', price: '$3.75/month', dosage: '10 mg' },
  ],
  'Atorvastatin calcium': [
    { name: 'Atorvastatin (Generic)', brand: 'Dr. Reddy\'s', price: '$6.40/month', dosage: '20 mg' },
    { name: 'Lipitor (Generic equivalent)', brand: 'Aurobindo', price: '$7.15/month', dosage: '20 mg' },
  ],
  'Glipizide': [
    { name: 'Glipizide (Generic)', brand: 'Sun Pharma', price: '$4.80/month', dosage: '5 mg' },
  ],
};
