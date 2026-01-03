export type PropertyType = "Land" | "Apartment";

export type PropertyStatus = "Available" | "Sold Out" | "Reserved" | "Disabled";

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  subtype: string;
  status: PropertyStatus;
  description: string;

  // Location
  state: string;
  stateId: string;
  lga: string;
  lgaId: string;
  area: string;
  areaId: string;
  latitude?: number;
  longitude?: number;
  nearbyLandmarks: string[];

  // Pricing
  regularPrice: number; // Always visible
  marketPrice?: number; // Visible only after payment completion
  discountPercentage?: number;
  finalPrice: number; // After discount

  // Sizes (for land properties)
  availableSizes: PropertySize[];

  // Payment options
  paymentDurations: number[]; // In months, e.g., [6, 12, 18, 24]
  interestRate: number; // Percentage
  overduepenaltyRate: number; // Percentage

  // Media
  images: PropertyMedia[];
  videos: PropertyMedia[];
  primaryImageId: string;

  // Plots
  totalPlots: number;
  availablePlots: number;
  allocatedPlots: number;

  // Stats
  views: number;
  interests: number;
  enrollments: number;
  sold: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastUpdatedBy: string;
}

export interface PropertySize {
  id: string;
  propertyId: string;
  size: number; // In square meters
  unit: "sqm" | "sqft" | "acres" | "hectares";
  price: number;
  isAvailable: boolean;
  displayOrder: number;
}

export interface PropertyMedia {
  id: string;
  propertyId: string;
  type: "image" | "video" | "youtube" | "instagram";
  url: string;
  file?: File | Blob;
  isUrl: boolean; // true if URL, false if blob/file
  isPrimary?: boolean;
  displayOrder: number;
  caption?: string;
  thumbnail?: string; // For video thumbnails and YouTube/Instagram previews
  createdAt: Date;
}

export interface Plot {
  id: string;
  plotId: string; // Unique plot identifier (e.g., "A-101")
  propertyId: string;
  propertyName: string;
  status: "Available" | "Allocated" | "Reserved";
  latitude?: number;
  longitude?: number;
  allocatedTo?: string; // Client ID
  allocatedToName?: string;
  enrollmentId?: string;
  allocatedAt?: Date;
  createdAt: Date;
}

export interface PlotAllocationHistory {
  id: string;
  plotId: string;
  propertyId: string;
  clientId: string;
  clientName: string;
  enrollmentId: string;
  allocatedAt: Date;
  deallocatedAt?: Date;
  reason?: string;
}

export interface PropertyFilters {
  type?: PropertyType[];
  status?: PropertyStatus[];
  stateId?: string;
  lgaId?: string;
  areaId?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sortBy?: "name" | "price" | "date" | "popularity";
  sortOrder?: "asc" | "desc";
}
