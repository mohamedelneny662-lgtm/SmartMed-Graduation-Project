export const todayDoses = [
  {
    id: 1,
    medicationId: 1,
    medicineName: 'Metformin',
    dosage: '500 mg',
    scheduledTime: '08:00',
    status: 'Confirmed',
  },
  {
    id: 2,
    medicationId: 2,
    medicineName: 'Lisinopril',
    dosage: '10 mg',
    scheduledTime: '09:00',
    status: 'Confirmed',
  },
  {
    id: 3,
    medicationId: 1,
    medicineName: 'Metformin',
    dosage: '500 mg',
    scheduledTime: '20:00',
    status: 'Unknown',
  },
  {
    id: 4,
    medicationId: 3,
    medicineName: 'Atorvastatin',
    dosage: '20 mg',
    scheduledTime: '21:00',
    status: 'Unknown',
  },
];

export const weeklyAdherence = [
  { day: 'Mon', adherence: 100 },
  { day: 'Tue', adherence: 90 },
  { day: 'Wed', adherence: 100 },
  { day: 'Thu', adherence: 80 },
  { day: 'Fri', adherence: 100 },
  { day: 'Sat', adherence: 95 },
  { day: 'Sun', adherence: 88 },
];

export const adherenceHistory = [
  { id: 1, date: '2026-10-22', label: 'Thursday', adherence: 100, confirmed: 4, total: 4 },
  { id: 2, date: '2026-10-21', label: 'Wednesday', adherence: 75, confirmed: 3, total: 4 },
  { id: 3, date: '2026-10-20', label: 'Tuesday', adherence: 100, confirmed: 4, total: 4 },
  { id: 4, date: '2026-10-19', label: 'Monday', adherence: 50, confirmed: 2, total: 4 },
  { id: 5, date: '2026-10-18', label: 'Sunday', adherence: 100, confirmed: 4, total: 4 },
];

export const recentLabs = [
  {
    id: 1,
    testName: 'HbA1c',
    result: '6.8%',
    unit: '%',
    date: '2026-10-15',
    status: 'High',
  },
  {
    id: 2,
    testName: 'Fasting Glucose',
    result: '105 mg/dL',
    unit: 'mg/dL',
    date: '2026-10-15',
    status: 'Normal',
  },
  {
    id: 3,
    testName: 'Total Cholesterol',
    result: '185 mg/dL',
    unit: 'mg/dL',
    date: '2026-09-28',
    status: 'Normal',
  },
];
