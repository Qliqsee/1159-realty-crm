import type { NavItem } from "@/types";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  CalendarClock,
  UserCheck,
  MessageSquare,
  Handshake,
  FileText,
  Receipt,
  CreditCard,
  BadgeCheck,
  DollarSign,
  Send,
  Megaphone,
  Bell,
  FileStack,
  Headphones,
  BarChart3,
  UsersRound,
  MapPin,
} from "lucide-react";

export interface NavCategory {
  label: string;
  items: NavItem[];
}

export const navigationCategories: NavCategory[] = [
  {
    label: "Dashboard",
    items: [
      {
        label: "Overview",
        href: "/",
        icon: "LayoutDashboard",
      },
    ],
  },
  {
    label: "Sales & Leads",
    items: [
      {
        label: "Leads",
        href: "/leads",
        icon: "Users",
        permission: "view:lead",
      },
      {
        label: "Properties",
        href: "/properties",
        icon: "Building2",
        permission: "view:property",
      },
      {
        label: "Appointments",
        href: "/appointments",
        icon: "Calendar",
        permission: "view:appointment",
      },
      {
        label: "Schedules",
        href: "/schedules",
        icon: "CalendarClock",
        permission: "view:appointment",
      },
      {
        label: "Clients",
        href: "/clients",
        icon: "UserCheck",
        permission: "view:client",
      },
      {
        label: "Client Interests",
        href: "/client-interests",
        icon: "MessageSquare",
        permission: "view:interest",
      },
      {
        label: "My Clients",
        href: "/my-clients",
        icon: "Users",
        permission: "view:client",
      },
    ],
  },
  {
    label: "Partnerships",
    items: [
      {
        label: "Applications",
        href: "/partnerships",
        icon: "Handshake",
        permission: "view:partnership",
      },
      {
        label: "Partners",
        href: "/partners",
        icon: "UsersRound",
        permission: "view:partner",
      },
      {
        label: "Agent Dashboard",
        href: "/agent",
        icon: "BarChart3",
        permission: "view:commission",
        roles: ["Agent"],
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Enrollments",
        href: "/enrollments",
        icon: "FileText",
        permission: "view:enrollment",
      },
      {
        label: "Invoices",
        href: "/invoices",
        icon: "Receipt",
        permission: "view:invoice",
      },
      {
        label: "Manual Payments",
        href: "/payments",
        icon: "CreditCard",
        permission: "view:payment",
      },
      {
        label: "KYC Review",
        href: "/kyc",
        icon: "BadgeCheck",
        permission: "view:kyc",
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        label: "Commissions",
        href: "/commissions",
        icon: "DollarSign",
        permission: "view:commission",
      },
      {
        label: "Releases",
        href: "/releases",
        icon: "Send",
        permission: "view:release",
      },
    ],
  },
  {
    label: "Marketing",
    items: [
      {
        label: "Campaigns",
        href: "/campaigns",
        icon: "Megaphone",
        permission: "view:campaign",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Documents",
        href: "/documents",
        icon: "FileStack",
        permission: "view:document",
      },
      {
        label: "Support",
        href: "/support",
        icon: "Headphones",
        permission: "view:support",
      },
      {
        label: "Analytics",
        href: "/analytics",
        icon: "BarChart3",
        permission: "view:analytics",
      },
      {
        label: "Team",
        href: "/team",
        icon: "UsersRound",
        permission: "view:team",
      },
      {
        label: "Locations",
        href: "/locations",
        icon: "MapPin",
        permission: "view:location",
      },
    ],
  },
];
