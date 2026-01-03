"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserCheck, DollarSign, Users, Link as LinkIcon } from "lucide-react";
import type { Partner } from "@/types";
import { Button } from "@/components/buttons/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/overlays/dropdown-menu";
import { StatusBadge } from "@/components/badges/status-badge";
import { DataTableColumnHeader } from "@/components/data/data-table-column-header";
import { format } from "date-fns";
import Link from "next/link";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const columns: ColumnDef<Partner>[] = [
  {
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Partner" />,
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <div className="flex flex-col gap-1 min-w-[250px]">
          <Link href={`/clients/${partner.clientId}`} className="font-medium text-primary hover:underline" target="_blank">
            {partner.clientName}
          </Link>
          <span className="text-sm text-muted-foreground">{partner.clientEmail}</span>
          <span className="text-sm text-muted-foreground">{partner.clientPhone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "referralCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Referral Code" />,
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <div className="flex items-center gap-2">
          <LinkIcon className="h-3 w-3 text-muted-foreground" />
          <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{partner.referralCode}</code>
        </div>
      );
    },
  },
  {
    accessorKey: "linkedAgentName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Linked Agent" />,
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <Link href={`/team/${partner.linkedAgentId}`} className="font-medium hover:underline" target="_blank">
            {partner.linkedAgentName}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors = {
        Active: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        Inactive: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300",
        Suspended: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
      };
      return <StatusBadge status={status} className={statusColors[status]} />;
    },
  },
  {
    accessorKey: "totalReferrals",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Referrals" />,
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{partner.totalReferrals}</span>
            <span className="text-xs text-muted-foreground">{partner.activeReferrals} active</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalCommissionEarned",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Commission" />,
    cell: ({ row }) => {
      const amount = row.original.totalCommissionEarned;
      return (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="font-medium">{formatCurrency(amount)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "pendingCommission",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pending" />,
    cell: ({ row }) => {
      const amount = row.original.pendingCommission;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">{formatCurrency(amount)}</span>
          <span className="text-xs text-muted-foreground">Unpaid</span>
        </div>
      );
    },
  },
  {
    accessorKey: "paidCommission",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Paid" />,
    cell: ({ row }) => {
      const amount = row.original.paidCommission;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-green-700 dark:text-green-300">{formatCurrency(amount)}</span>
          <span className="text-xs text-muted-foreground">Paid out</span>
        </div>
      );
    },
  },
  {
    accessorKey: "approvedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Approved On" />,
    cell: ({ row }) => {
      const date = row.original.approvedAt;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{format(new Date(date), "MMM dd, yyyy")}</span>
          <span className="text-xs text-muted-foreground">{format(new Date(date), "hh:mm a")}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const partner = row.original;

      const copyReferralLink = () => {
        navigator.clipboard.writeText(partner.referralLink);
        // Note: toast will need to be imported if you want to show success message
      };

      const suspendPartner = () => {
        // TODO: Implement suspend partner functionality
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={copyReferralLink}>Copy Referral Link</DropdownMenuItem>
            <DropdownMenuItem
              onClick={suspendPartner}
              className="text-red-600 dark:text-red-400"
              disabled={partner.status === "Suspended"}
            >
              Suspend Partner
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
