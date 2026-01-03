"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/buttons/button"
import { Plus, Upload, Download, Filter, FileText, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getInvoices } from "@/lib/api/invoices"
import type { Invoice } from "@/types"
import { toast } from "sonner"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      setIsLoading(true)
      const data = await getInvoices()
      setInvoices(data)
    } catch (error) {
      toast.error("Failed to load invoices")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const paidInvoices = invoices.filter(i => i.status === "Paid")
  const overdueInvoices = invoices.filter(i => i.status === "Overdue")
  const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.total, 0)
  const outstandingAmount = invoices.filter(i => i.status !== "Paid" && i.status !== "Cancelled").reduce((sum, i) => sum + i.amountDue, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage invoices for property payments
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="shadow-soft">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="shadow-soft">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="shadow-soft">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button className="shadow-soft">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold">{invoices.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold">{paidInvoices.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">From paid invoices</p>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold">{overdueInvoices.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">Total Revenue</p>
          </div>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
            {formatCurrency(totalRevenue)}
          </p>
          <div className="flex items-center justify-between text-xs mt-4">
            <span className="text-green-600 dark:text-green-400">Outstanding</span>
            <span className="font-medium text-green-700 dark:text-green-300">{formatCurrency(outstandingAmount)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Draft</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {invoices.filter(i => i.status === "Draft").length}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Not sent</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Sent</p>
            <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
              {invoices.filter(i => i.status === "Sent").length}
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Awaiting payment</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Partial</p>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {invoices.filter(i => i.status === "Partially Paid").length}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Part payment</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Cancelled</p>
            <p className="text-3xl font-bold text-red-900 dark:text-red-100">
              {invoices.filter(i => i.status === "Cancelled").length}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Voided</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading invoices...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={invoices}
          searchKey="invoiceNumber"
          searchPlaceholder="Search by invoice number, client, or property..."
        />
      )}
    </div>
  )
}
