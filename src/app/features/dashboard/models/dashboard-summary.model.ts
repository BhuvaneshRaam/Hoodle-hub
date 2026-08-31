export interface PersonalPrqMetrics {
  myPendingRequests?: number | null;
  myRejectedRequests?: number | null;
  totalApprovedPrqs?: number | null;
}

export interface ApprovalMetrics {
  pendingApprovals?: number | null;
}

export interface PoMetrics {
  monthlyPoSpend?: number | null;
}

export interface VendorMetrics {
  activeVendors?: number | null;
}

export interface DashboardSummaryModel {
  personalPrqMetrics?: PersonalPrqMetrics | null;
  approvalMetrics?: ApprovalMetrics | null;
  poMetrics?: PoMetrics | null;
  vendorMetrics?: VendorMetrics | null;
  
  recentPrqs?: any[] | null;
  bottleneckPrqs?: any[] | null;
  recentPos?: any[] | null;
}