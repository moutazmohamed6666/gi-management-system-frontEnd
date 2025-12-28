export type DealStatus =
  | "Draft"
  | "Submitted"
  | "Finance Review"
  | "Approved"
  | "Commission Received"
  | "Commission Transferred"
  | "Closed";

export interface Deal {
  id: string;
  propertyType: string;
  developer: string;
  project: string;
  unitType: string;
  unitNumber: string;
  location: string;
  buyerName: string;
  buyerContact: string;
  sellerName: string;
  sellerContact: string;
  agentName: string;
  leadSource: string;
  roi: string;
  paymentPlan: string;
  askingPrice: number;
  sellingPrice: number;
  nationality: string;
  country: string;
  dealCloseDate: string;
  notes: string;
  status: DealStatus;

  // Finance fields
  fixedCommission?: number;
  buyerRepCommission?: number;
  sellerRepCommission?: number;
  managerCommission?: number;
  agentCommission?: number;
  totalCommission?: number;
  receivedAmount?: number;
  receivedPercentage?: number;
  paidToAgent?: boolean;
  paidPercentage?: number;
  paidDate?: string;
  remainingAmount?: number;
  commissionStatus?: "Pending" | "Partially Paid" | "Paid";
  financeNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "agent" | "finance" | "ceo" | "admin" | "sales_admin";
  manager?: string;
  status: "Active" | "Inactive";
  createdDate: string;
}

export interface CommissionRule {
  id: string;
  developer: string;
  project?: string;
  commissionType: "Percentage" | "Fixed";
  commissionValue: number;
  agentSplit: number;
  managerSplit: number;
  companySplit: number;
  effectiveDate: string;
  notes: string;
}

export const mockDeals: Deal[] = [
  {
    id: "D001",
    propertyType: "Apartment",
    developer: "Emaar Properties",
    project: "Dubai Creek Harbour",
    unitType: "2 Bedroom",
    unitNumber: "A-1205",
    location: "Dubai Creek Harbour",
    buyerName: "Ahmed Al Maktoum",
    buyerContact: "+971 50 123 4567",
    sellerName: "Emaar Properties",
    sellerContact: "+971 4 366 4444",
    agentName: "Sarah Johnson",
    leadSource: "Website",
    roi: "8.5%",
    paymentPlan: "60/40",
    askingPrice: 1500000,
    sellingPrice: 1450000,
    nationality: "UAE",
    country: "United Arab Emirates",
    dealCloseDate: "2025-03-15",
    notes: "VIP client, priority handling",
    status: "Finance Review",
    fixedCommission: 43500,
    buyerRepCommission: 43500,
    sellerRepCommission: 0,
    managerCommission: 8700,
    agentCommission: 34800,
    totalCommission: 43500,
    receivedAmount: 43500,
    receivedPercentage: 100,
    paidToAgent: false,
    paidPercentage: 0,
    remainingAmount: 43500,
    commissionStatus: "Pending",
    financeNotes: "Awaiting developer payment confirmation",
  },
  {
    id: "D002",
    propertyType: "Villa",
    developer: "Damac Properties",
    project: "Damac Hills 2",
    unitType: "4 Bedroom Villa",
    unitNumber: "V-342",
    location: "Damac Hills",
    buyerName: "Mohammed Hassan",
    buyerContact: "+971 55 987 6543",
    sellerName: "Damac Properties",
    sellerContact: "+971 4 390 0000",
    agentName: "Sarah Johnson",
    leadSource: "Referral",
    roi: "7.2%",
    paymentPlan: "70/30",
    askingPrice: 2800000,
    sellingPrice: 2750000,
    nationality: "Saudi Arabia",
    country: "Saudi Arabia",
    dealCloseDate: "2025-02-28",
    notes: "Cash buyer",
    status: "Approved",
    fixedCommission: 82500,
    buyerRepCommission: 82500,
    sellerRepCommission: 0,
    managerCommission: 16500,
    agentCommission: 66000,
    totalCommission: 82500,
    receivedAmount: 82500,
    receivedPercentage: 100,
    paidToAgent: true,
    paidPercentage: 100,
    paidDate: "2025-03-10",
    remainingAmount: 0,
    commissionStatus: "Paid",
  },
  {
    id: "D003",
    propertyType: "Townhouse",
    developer: "Dubai Properties",
    project: "Villanova",
    unitType: "3 Bedroom Townhouse",
    unitNumber: "T-156",
    location: "Dubai Land",
    buyerName: "Lisa Chen",
    buyerContact: "+971 52 345 6789",
    sellerName: "Dubai Properties",
    sellerContact: "+971 4 365 2222",
    agentName: "Mike Thompson",
    leadSource: "Direct",
    roi: "6.8%",
    paymentPlan: "80/20",
    askingPrice: 1850000,
    sellingPrice: 1800000,
    nationality: "China",
    country: "China",
    dealCloseDate: "2025-04-01",
    notes: "First-time buyer",
    status: "Submitted",
    financeNotes: "Pending document verification",
  },
  {
    id: "D004",
    propertyType: "Penthouse",
    developer: "Meraas",
    project: "Bluewaters Residences",
    unitType: "4 Bedroom Penthouse",
    unitNumber: "PH-05",
    location: "Bluewaters Island",
    buyerName: "Robert Williams",
    buyerContact: "+971 50 111 2233",
    sellerName: "Meraas",
    sellerContact: "+971 4 355 5555",
    agentName: "Sarah Johnson",
    leadSource: "Exhibition",
    roi: "9.2%",
    paymentPlan: "50/50",
    askingPrice: 8500000,
    sellingPrice: 8200000,
    nationality: "UK",
    country: "United Kingdom",
    dealCloseDate: "2025-05-20",
    notes: "Investment property",
    status: "Commission Received",
    fixedCommission: 246000,
    buyerRepCommission: 246000,
    sellerRepCommission: 0,
    managerCommission: 49200,
    agentCommission: 196800,
    totalCommission: 246000,
    receivedAmount: 246000,
    receivedPercentage: 100,
    paidToAgent: true,
    paidPercentage: 50,
    paidDate: "2025-05-25",
    remainingAmount: 123000,
    commissionStatus: "Partially Paid",
    financeNotes: "Second payment scheduled for June 15",
  },
  {
    id: "D005",
    propertyType: "Apartment",
    developer: "Nakheel",
    project: "Palm Jumeirah",
    unitType: "1 Bedroom",
    unitNumber: "A-803",
    location: "Palm Jumeirah",
    buyerName: "Fatima Abdullah",
    buyerContact: "+971 56 789 0123",
    sellerName: "Nakheel",
    sellerContact: "+971 4 390 1111",
    agentName: "Mike Thompson",
    leadSource: "Social Media",
    roi: "7.5%",
    paymentPlan: "60/40",
    askingPrice: 2200000,
    sellingPrice: 2150000,
    nationality: "UAE",
    country: "United Arab Emirates",
    dealCloseDate: "2025-03-08",
    notes: "Beachfront unit",
    status: "Closed",
    fixedCommission: 64500,
    buyerRepCommission: 64500,
    sellerRepCommission: 0,
    managerCommission: 12900,
    agentCommission: 51600,
    totalCommission: 64500,
    receivedAmount: 64500,
    receivedPercentage: 100,
    paidToAgent: true,
    paidPercentage: 100,
    paidDate: "2025-03-15",
    remainingAmount: 0,
    commissionStatus: "Paid",
  },
];

export const mockUsers: User[] = [
  {
    id: "U001",
    name: "Sarah Johnson",
    email: "sarah.johnson@agency.com",
    role: "agent",
    manager: "John Smith",
    status: "Active",
    createdDate: "2024-01-15",
  },
  {
    id: "U002",
    name: "Mike Thompson",
    email: "mike.thompson@agency.com",
    role: "agent",
    manager: "John Smith",
    status: "Active",
    createdDate: "2024-02-20",
  },
  {
    id: "U003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@agency.com",
    role: "finance",
    status: "Active",
    createdDate: "2024-01-10",
  },
  {
    id: "U004",
    name: "David Chen",
    email: "david.chen@agency.com",
    role: "ceo",
    status: "Active",
    createdDate: "2023-12-01",
  },
  {
    id: "U005",
    name: "Admin User",
    email: "admin@agency.com",
    role: "admin",
    status: "Active",
    createdDate: "2023-12-01",
  },
  {
    id: "U006",
    name: "Sales Admin",
    email: "salesadmin@agency.com",
    role: "sales_admin",
    status: "Active",
    createdDate: "2025-12-27",
  },
];

export const mockCommissionRules: CommissionRule[] = [
  {
    id: "CR001",
    developer: "Emaar Properties",
    project: "Dubai Creek Harbour",
    commissionType: "Percentage",
    commissionValue: 3,
    agentSplit: 80,
    managerSplit: 20,
    companySplit: 0,
    effectiveDate: "2025-01-01",
    notes: "Standard commission structure",
  },
  {
    id: "CR002",
    developer: "Damac Properties",
    commissionType: "Percentage",
    commissionValue: 3,
    agentSplit: 80,
    managerSplit: 20,
    companySplit: 0,
    effectiveDate: "2025-01-01",
    notes: "All Damac projects",
  },
  {
    id: "CR003",
    developer: "Meraas",
    project: "Bluewaters Residences",
    commissionType: "Percentage",
    commissionValue: 3,
    agentSplit: 80,
    managerSplit: 20,
    companySplit: 0,
    effectiveDate: "2025-01-01",
    notes: "Premium project - higher commission",
  },
];