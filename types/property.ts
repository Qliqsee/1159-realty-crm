// Property Type Constants
export const PROPERTY_TYPES = ["Land", "Apartment"] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

// Property Status Constants
export const PROPERTY_STATUS = ["Available", "Pre-launch", "Sold Out", "Reserved", "Disabled"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUS)[number];

// Land Subtype Constants
export const LAND_SUBTYPES = ["Industrial", "Commercial", "Residential", "Farmland", "Mixed"] as const;
export type LandSubtype = (typeof LAND_SUBTYPES)[number];

// Country Constants
export const COUNTRIES = ["Nigeria", "Others"] as const;
export type Country = (typeof COUNTRIES)[number];

// Property Feature Icons - Curated list for real estate
export const PROPERTY_FEATURE_ICONS = [
  // Buildings & Property
  { value: "Home", label: "Home" },
  { value: "Building", label: "Building" },
  { value: "Building2", label: "Building 2" },
  { value: "Warehouse", label: "Warehouse" },
  { value: "Hotel", label: "Hotel" },
  { value: "Store", label: "Store/Shop" },

  // Amenities
  { value: "Wifi", label: "WiFi" },
  { value: "Car", label: "Parking" },
  { value: "Droplets", label: "Pool/Water" },
  { value: "Dumbbell", label: "Gym" },
  { value: "Bath", label: "Bathroom" },
  { value: "Bed", label: "Bedroom" },

  // Security & Access
  { value: "Shield", label: "Security" },
  { value: "ShieldCheck", label: "Secure" },
  { value: "Camera", label: "CCTV" },
  { value: "Lock", label: "Lock" },
  { value: "Key", label: "Key Access" },
  { value: "DoorOpen", label: "Door" },

  // Outdoor & Nature
  { value: "Trees", label: "Trees/Garden" },
  { value: "TreePine", label: "Pine Trees" },
  { value: "Flower", label: "Flowers" },
  { value: "Waves", label: "Water/River" },
  { value: "Mountain", label: "Mountain View" },
  { value: "Sun", label: "Sunlight" },

  // Utilities & Services
  { value: "Zap", label: "Power/Electric" },
  { value: "Wind", label: "AC/Ventilation" },
  { value: "Flame", label: "Heating/Gas" },
  { value: "Lightbulb", label: "Lighting" },
  { value: "Radio", label: "Internet" },
  { value: "Tv", label: "TV/Cable" },

  // Facilities
  { value: "Users", label: "Personnel/Staff" },
  { value: "Utensils", label: "Kitchen" },
  { value: "ShoppingCart", label: "Convenience Store" },
  { value: "GraduationCap", label: "School Nearby" },
  { value: "Heart", label: "Hospital Nearby" },
  { value: "Plane", label: "Airport Nearby" },

  // Features
  { value: "Fence", label: "Fence/Gate" },
  { value: "Sofa", label: "Furnished" },
  { value: "Armchair", label: "Seating Area" },
  { value: "Fan", label: "Ceiling Fan" },
  { value: "Bell", label: "Doorbell" },
  { value: "Accessibility", label: "Accessible" },
] as const;

export interface Property {
  id: string;

  // Basic Information
  name: string;
  type: PropertyType;
  subtype: string;
  status: PropertyStatus;
  description: string;

  // Conditional Fields
  agriculturalFee?: {
    amount: number;
    isActive: boolean;
  };
  requiredDocuments: string[];

  // Location
  country: Country;
  state?: string;
  address: string;
  nearbyLandmark: string;

  // Features
  features: PropertyFeature[];

  // Unit Pricing
  unitPricing: PropertyUnitPricing[];

  // Discount
  salesDiscount?: {
    percentage: number;
    isActive: boolean;
  };

  // Payment Terms
  overdueInterestRate: number;
  paymentCycle: number; // In days

  // Payment Plans
  paymentPlans: PropertyPaymentPlan[];

  // Map Configuration
  mapConfig?: {
    src: string;
    width: string;
    height: string;
  };

  // Media
  media: PropertyMedia[];

  // Stats (not part of form)
  views?: number;
  interests?: number;
  enrollments?: number;
  sold?: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastUpdatedBy: string;
}

export interface PropertyUnitPricing {
  id?: string;
  unit: string;
  regularPrice: number;
  prelaunchPrice: number;
}

export interface PropertyPaymentPlan {
  id?: string;
  durationMonths: number;
  interestRate: number;
}

export interface PropertyFeature {
  id?: string;
  name: string;
  icon: string;
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
