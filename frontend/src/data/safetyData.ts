import { drivers } from './mockData'
import type {
  ComplianceRecord,
  SafetyIncident,
  SafetyNotification,
  SafetyReportTemplate,
} from '../types'
import { buildComplianceRecord } from '../utils/safety'

export const safetyIncidents: SafetyIncident[] = [
  {
    id: 'INC001',
    title: 'Hard braking on highway',
    driverId: 'D002',
    driverName: 'Amit Sharma',
    tripId: 'T004',
    category: 'safety',
    severity: 'medium',
    description: 'Sudden hard braking reported near Lonavala ghat section. No collision.',
    reportedAt: '2026-07-11T14:22:00Z',
    status: 'investigating',
    location: 'Mumbai-Pune Expressway',
  },
  {
    id: 'INC002',
    title: 'Expired medical certificate',
    driverId: 'D004',
    driverName: 'Vikram Singh',
    category: 'violation',
    severity: 'high',
    description: 'Driver medical fitness certificate expired. Driver placed off duty pending renewal.',
    reportedAt: '2026-07-10T09:00:00Z',
    status: 'open',
  },
  {
    id: 'INC003',
    title: 'Minor vehicle damage — loading bay',
    driverId: 'D001',
    driverName: 'Rajesh Kumar',
    tripId: 'T001',
    category: 'vehicle',
    severity: 'low',
    description: 'Rear bumper scratch during reverse parking at Pune warehouse.',
    reportedAt: '2026-07-09T16:45:00Z',
    status: 'resolved',
    location: 'Pune DC Warehouse',
  },
  {
    id: 'INC004',
    title: 'Speed limit violation alert',
    driverId: 'D004',
    driverName: 'Vikram Singh',
    category: 'violation',
    severity: 'critical',
    description: 'Telematics alert: 92 km/h in 60 km/h zone on NH-48.',
    reportedAt: '2026-07-08T11:30:00Z',
    status: 'open',
    location: 'NH-48, Satara',
  },
  {
    id: 'INC005',
    title: 'Fatigue driving concern',
    driverId: 'D002',
    driverName: 'Amit Sharma',
    category: 'safety',
    severity: 'high',
    description: 'Exceeded recommended continuous driving hours. Rest break mandated.',
    reportedAt: '2026-07-07T20:15:00Z',
    status: 'closed',
  },
]

export const safetyNotifications: SafetyNotification[] = [
  {
    id: 'N001',
    type: 'license_expiry',
    title: 'License expiring soon',
    message: 'Vikram Singh\'s license expires on 2026-07-01 — immediate action required.',
    createdAt: '2026-07-12T08:00:00Z',
    read: false,
    priority: 'high',
    link: '/safety/licenses',
  },
  {
    id: 'N002',
    type: 'low_score',
    title: 'Low safety score alert',
    message: 'Vikram Singh safety score dropped to 65%. Schedule coaching session.',
    createdAt: '2026-07-11T15:30:00Z',
    read: false,
    priority: 'high',
    link: '/safety/compliance',
  },
  {
    id: 'N003',
    type: 'incident',
    title: 'New incident reported',
    message: 'Hard braking incident (INC001) requires investigation.',
    createdAt: '2026-07-11T14:25:00Z',
    read: false,
    priority: 'medium',
    link: '/safety/incidents',
  },
  {
    id: 'N004',
    type: 'compliance',
    title: 'Training renewal due',
    message: 'Amit Sharma defensive driving certification expires in 30 days.',
    createdAt: '2026-07-10T10:00:00Z',
    read: true,
    priority: 'medium',
    link: '/safety/compliance',
  },
  {
    id: 'N005',
    type: 'license_expiry',
    title: 'License renewal window',
    message: 'Amit Sharma license expires 2026-09-20. Begin renewal process.',
    createdAt: '2026-07-09T09:00:00Z',
    read: true,
    priority: 'medium',
    link: '/safety/licenses',
  },
  {
    id: 'N006',
    type: 'system',
    title: 'Weekly compliance report ready',
    message: 'Your weekly driver compliance summary is available for download.',
    createdAt: '2026-07-08T07:00:00Z',
    read: true,
    priority: 'low',
    link: '/safety/reports',
  },
]

export const complianceRecords: ComplianceRecord[] = drivers.map((driver, index) =>
  buildComplianceRecord(driver, {
    trainingComplete: driver.safetyScore >= 75,
    medicalClearance: driver.id !== 'D004',
    lastReview: `2026-0${6 + (index % 2)}-${10 + index * 3}`,
  }),
)

export const safetyReportTemplates: SafetyReportTemplate[] = [
  {
    id: 'RPT001',
    name: 'Monthly Compliance Summary',
    description: 'Driver compliance status, training records, and license validity overview.',
    frequency: 'monthly',
    lastGenerated: '2026-07-01',
  },
  {
    id: 'RPT002',
    name: 'Incident Investigation Report',
    description: 'Detailed log of all incidents, investigations, and resolutions.',
    frequency: 'on_demand',
    lastGenerated: '2026-07-10',
  },
  {
    id: 'RPT003',
    name: 'License Audit Report',
    description: 'License expiry tracking, renewal status, and regulatory compliance.',
    frequency: 'quarterly',
    lastGenerated: '2026-04-01',
  },
  {
    id: 'RPT004',
    name: 'Safety Score Analysis',
    description: 'Fleet-wide safety score trends, rankings, and improvement recommendations.',
    frequency: 'weekly',
    lastGenerated: '2026-07-07',
  },
]

export const monthlySafetyScores = [
  { month: 'Feb', score: 79 },
  { month: 'Mar', score: 81 },
  { month: 'Apr', score: 83 },
  { month: 'May', score: 80 },
  { month: 'Jun', score: 84 },
  { month: 'Jul', score: 84 },
]

export const incidentsByCategory = [
  { category: 'Safety', count: 8 },
  { category: 'Vehicle', count: 5 },
  { category: 'Violation', count: 4 },
  { category: 'Route', count: 3 },
  { category: 'Other', count: 2 },
]
