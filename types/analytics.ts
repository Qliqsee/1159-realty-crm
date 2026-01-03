export interface DateRange {
  from: Date;
  to: Date;
  preset?: "today" | "yesterday" | "last7days" | "last30days" | "last90days" | "thisMonth" | "lastMonth" | "thisYear" | "lastYear" | "custom";
}

export interface ComparisonPeriod {
  current: DateRange;
  previous: DateRange;
  type: "YoY" | "MoM" | "WoW" | "Custom";
}

export interface MetricCard {
  label: string;
  value: number;
  format: "number" | "currency" | "percentage";
  trend?: number; // Percentage change
  trendDirection?: "up" | "down" | "neutral";
  icon?: string;
  color?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  fill?: boolean;
}

export interface SalesAnalytics {
  totalSales: MetricCard;
  totalRevenue: MetricCard;
  averageSaleValue: MetricCard;
  conversionRate: MetricCard;
  salesByPropertyType: ChartData;
  salesByLocation: ChartData;
  salesByAgent: ChartData;
  salesTrend: ChartData;
  revenueForecast: ChartData;
}

export interface CustomerAnalytics {
  totalCustomers: MetricCard;
  newCustomers: MetricCard;
  retentionRate: MetricCard;
  churnRate: MetricCard;
  customerLifetimeValue: ChartData;
  repeatPurchaseRate: MetricCard;
  customerSegmentation: ChartData;
  purchaseFrequency: ChartData;
  paymentBehavior: ChartData;
}

export interface LocationAnalytics {
  topPerformingLocations: LocationPerformance[];
  locationDemandForecast: ChartData;
  priceTrendsByArea: ChartData;
  emergingLocations: LocationPerformance[];
  locationGrowthRate: ChartData;
}

export interface LocationPerformance {
  locationId: string;
  locationName: string;
  type: "State" | "LGA" | "Area";
  totalSales: number;
  revenue: number;
  averageSaleTime: number; // In days
  demandScore: number;
  growthRate: number;
  popularityScore: number;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  totalSales: number;
  revenue: number;
  commissionEarned: number;
  conversionRate: number;
  averageDealSize: number;
  totalClients: number;
  activeEnrollments: number;
  leadToSaleRatio: number;
  performanceTrend: number;
  rank: number;
}

export interface PropertyAnalytics {
  mostViewedProperties: PropertyPerformance[];
  mostInterestedProperties: PropertyPerformance[];
  mostSoldProperties: PropertyPerformance[];
  averageTimeToSell: MetricCard;
  plotAllocationStatus: ChartData;
  paymentCompletionRates: ChartData;
  propertyRevenue: ChartData;
}

export interface PropertyPerformance {
  propertyId: string;
  propertyName: string;
  views: number;
  interests: number;
  sales: number;
  revenue: number;
  averageTimeToSell: number;
  conversionRate: number;
  popularityScore: number;
}

export interface CommissionAnalytics {
  totalCommissionsPaid: MetricCard;
  pendingCommissions: MetricCard;
  agentEarnings: ChartData;
  partnerEarnings: ChartData;
  commissionTrends: ChartData;
  topEarners: TopEarner[];
}

export interface TopEarner {
  id: string;
  name: string;
  type: "Agent" | "Partner";
  totalEarned: number;
  pending: number;
  paid: number;
  rank: number;
}

export interface FinancialReport {
  totalRevenue: MetricCard;
  outstandingPayments: MetricCard;
  overduePayments: MetricCard;
  collectionEfficiency: MetricCard;
  revenueByPeriod: ChartData;
  paymentDefaultRate: MetricCard;
  refundsSummary: MetricCard;
}

export interface PredictiveInsight {
  type: "Repeat Purchase Likelihood" | "Churn Risk" | "Location Demand" | "Sales Forecast" | "Payment Default Risk";
  clientId?: string;
  clientName?: string;
  locationId?: string;
  locationName?: string;
  score: number; // 0-100
  confidence: number; // 0-100
  factors: string[];
  recommendation: string;
  createdAt: Date;
}

export interface CustomReport {
  id: string;
  name: string;
  description?: string;
  metrics: string[];
  dimensions: string[];
  filters: Record<string, unknown>;
  chartType: "line" | "bar" | "pie" | "area" | "table";
  schedule?: ReportSchedule;
  createdBy: string;
  createdAt: Date;
  lastRun?: Date;
}

export interface ReportSchedule {
  frequency: "daily" | "weekly" | "monthly";
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:mm
  recipients: string[]; // Email addresses
}
