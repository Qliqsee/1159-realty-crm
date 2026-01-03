export type LocationStatus = "Active" | "Inactive";

export interface State {
  id: string;
  name: string;
  code: string; // e.g., "LA" for Lagos
  status: LocationStatus;
  lgas: LGA[];
  totalProperties: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LGA {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  status: LocationStatus;
  areas: Area[];
  totalProperties: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Area {
  id: string;
  name: string;
  lgaId: string;
  lgaName: string;
  stateId: string;
  stateName: string;
  status: LocationStatus;
  totalProperties: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationHierarchy {
  state: State;
  lgas: LGA[];
  areas: Area[];
}

export interface LocationFilters {
  status?: LocationStatus[];
  stateId?: string;
  search?: string;
}
