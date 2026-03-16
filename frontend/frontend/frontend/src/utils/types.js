// Roles
export const Roles = {
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  ADMIN: 'admin',
}

// Example User structure
export const UserExample = {
  id: '1',
  email: 'doctor@demo.com',
  name: 'Dr. Sarah Chen',
  role: Roles.DOCTOR,
  avatar: '',          // optional
  specialization: '',  // optional
  approved: true,      // optional
}

// Example Patient structure
export const PatientExample = {
  id: '1',
  name: 'Robert Smith',
  age: 65,
  gender: 'Male',   // 'Male' | 'Female' | 'Other'
  doctorId: '1',
}

// Example Scan structure
export const ScanExample = {
  id: '1',
  patientId: '1',
  patientName: 'Robert Smith',
  doctorId: '1',
  date: '2026-03-11',
  mriImageUrl: '/path/to/mri.jpg',
  status: 'pending', // 'pending' | 'processing' | 'completed'
}

// Example Prediction structure
export const PredictionExample = {
  id: '1',
  scanId: '1',
  diagnosis: 'Alzheimer', // 'Normal' | 'MCI' | 'Alzheimer'
  confidence: 92,
  gradCamUrl: '/path/to/gradcam.jpg',
  shapValues: [{ feature: 'Hippocampus', value: 0.7 }],
  limeExplanation: 'Feature X increased probability of Alzheimer',
  counterfactual: 'If feature Y was lower, diagnosis would be Normal',
}

// Example Report structure
export const ReportExample = {
  id: '1',
  scanId: '1',
  patientId: '1',
  doctorId: '1',
  date: '2026-03-11',
  diagnosis: 'Alzheimer',
  confidence: 92,
  sharedWithPatient: true,
  pdfUrl: '/path/to/report.pdf',
}