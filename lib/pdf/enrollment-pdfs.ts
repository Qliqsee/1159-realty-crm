import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { TDocumentDefinitions } from "pdfmake/interfaces"
import { format } from "date-fns"
import type { Enrollment } from "@/types"

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs

// Company branding
const COMPANY_NAME = "1159 REALTY"
const COMPANY_ADDRESS = "123 Business District, Lagos, Nigeria"
const COMPANY_PHONE = "+234-800-1159-REALTY"
const COMPANY_EMAIL = "info@1159realty.com"

/**
 * Generate Offer Letter PDF
 */
export function generateOfferLetter(enrollment: Enrollment) {
  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    content: [
      // Header
      {
        columns: [
          {
            width: "*",
            text: COMPANY_NAME,
            style: "companyName",
          },
          {
            width: "auto",
            text: format(new Date(), "PPP"),
            style: "date",
          },
        ],
        margin: [0, 0, 0, 20],
      },

      // Title
      {
        text: "PROPERTY OFFER LETTER",
        style: "title",
        margin: [0, 20, 0, 20],
      },

      // Reference Number
      {
        text: `Reference: ${enrollment.enrollmentNumber}`,
        style: "reference",
        margin: [0, 0, 0, 30],
      },

      // Recipient
      {
        text: [
          { text: "To:\n", bold: true },
          `${enrollment.clientName}\n`,
          `Client ID: ${enrollment.clientId}\n`,
        ],
        margin: [0, 0, 0, 20],
      },

      // Body
      {
        text: "Dear Valued Client,",
        margin: [0, 0, 0, 15],
      },
      {
        text: [
          "We are pleased to offer you the opportunity to acquire a property with ",
          COMPANY_NAME,
          ". This offer is subject to the terms and conditions outlined below:",
        ],
        margin: [0, 0, 0, 20],
      },

      // Property Details
      {
        text: "PROPERTY DETAILS",
        style: "sectionHeader",
        margin: [0, 10, 0, 10],
      },
      {
        table: {
          widths: [150, "*"],
          body: [
            [
              { text: "Property Name:", bold: true },
              enrollment.propertyName,
            ],
            [
              { text: "Property Type:", bold: true },
              enrollment.propertyType,
            ],
            ...(enrollment.plotNumber
              ? [[{ text: "Plot Number:", bold: true }, enrollment.plotNumber]]
              : []),
            ...(enrollment.selectedSize
              ? [
                  [
                    { text: "Land Size:", bold: true },
                    `${enrollment.selectedSize} ${enrollment.selectedSizeUnit}`,
                  ],
                ]
              : []),
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 20],
      },

      // Payment Details
      {
        text: "PAYMENT DETAILS",
        style: "sectionHeader",
        margin: [0, 10, 0, 10],
      },
      {
        table: {
          widths: [150, "*"],
          body: [
            [
              { text: "Total Amount:", bold: true },
              `₦${enrollment.totalAmount.toLocaleString()}`,
            ],
            [
              { text: "Payment Type:", bold: true },
              enrollment.paymentType,
            ],
            ...(enrollment.installmentDuration
              ? [
                  [
                    { text: "Installment Period:", bold: true },
                    `${enrollment.installmentDuration} months`,
                  ],
                  [
                    { text: "Monthly Payment:", bold: true },
                    `₦${enrollment.installmentMonthlyAmount?.toLocaleString() || "N/A"}`,
                  ],
                ]
              : []),
            ...(enrollment.discountAmount > 0
              ? [
                  [
                    { text: "Discount:", bold: true },
                    `₦${enrollment.discountAmount.toLocaleString()}`,
                  ],
                ]
              : []),
            [
              { text: "Final Amount:", bold: true },
              { text: `₦${enrollment.finalAmount.toLocaleString()}`, bold: true },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 20],
      },

      // Terms
      {
        text: "TERMS & CONDITIONS",
        style: "sectionHeader",
        margin: [0, 20, 0, 10],
      },
      {
        ol: [
          "This offer is valid for 14 days from the date of issue.",
          "Payment must be made according to the agreed schedule.",
          `Interest rate of ${enrollment.interestRate}% applies to installment payments.`,
          `Late payment penalty of ${enrollment.overduepenaltyRate}% applies to overdue installments.`,
          "Plot allocation is subject to full documentation and initial payment.",
          "All payments are non-refundable except as outlined in the purchase agreement.",
        ],
        margin: [20, 0, 0, 30],
      },

      // Closing
      {
        text: "We look forward to welcoming you as a property owner with 1159 REALTY.",
        margin: [0, 0, 0, 30],
      },

      // Signature
      {
        columns: [
          {
            width: "*",
            text: [
              "Best regards,\n\n\n",
              "_______________________\n",
              "Sales Manager\n",
              COMPANY_NAME,
            ],
          },
          {
            width: "*",
            text: "",
          },
        ],
      },
    ],

    // Footer
    footer: (currentPage, pageCount) => ({
      columns: [
        {
          text: `${COMPANY_NAME} | ${COMPANY_ADDRESS}`,
          alignment: "left",
          fontSize: 8,
          margin: [40, 0, 0, 0],
        },
        {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: "right",
          fontSize: 8,
          margin: [0, 0, 40, 0],
        },
      ],
      margin: [0, 10, 0, 0],
    }),

    // Styles
    styles: {
      companyName: {
        fontSize: 20,
        bold: true,
        color: "#FFD700",
      },
      date: {
        fontSize: 10,
        alignment: "right",
      },
      title: {
        fontSize: 16,
        bold: true,
        alignment: "center",
        decoration: "underline",
      },
      reference: {
        fontSize: 10,
        alignment: "center",
        color: "#666666",
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        color: "#FFD700",
      },
    },

    defaultStyle: {
      fontSize: 10,
      lineHeight: 1.3,
    },
  }

  pdfMake.createPdf(docDefinition).download(`Offer-Letter-${enrollment.enrollmentNumber}.pdf`)
}

/**
 * Generate Payment Receipt PDF
 */
export function generatePaymentReceipt(
  enrollment: Enrollment,
  paymentAmount: number,
  paymentDate: Date,
  paymentMethod: string,
  receiptNumber: string
) {
  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    content: [
      // Header
      {
        columns: [
          {
            width: "*",
            stack: [
              { text: COMPANY_NAME, style: "companyName" },
              { text: COMPANY_ADDRESS, fontSize: 8, margin: [0, 5, 0, 0] },
              { text: `Phone: ${COMPANY_PHONE}`, fontSize: 8 },
              { text: `Email: ${COMPANY_EMAIL}`, fontSize: 8 },
            ],
          },
          {
            width: "auto",
            stack: [
              { text: "PAYMENT RECEIPT", style: "receiptTitle" },
              { text: receiptNumber, style: "receiptNumber" },
            ],
          },
        ],
        margin: [0, 0, 0, 30],
      },

      // Date
      {
        text: `Date: ${format(paymentDate, "PPP")}`,
        alignment: "right",
        margin: [0, 0, 0, 20],
      },

      // Received From
      {
        text: "RECEIVED FROM",
        style: "sectionHeader",
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          widths: [120, "*"],
          body: [
            [{ text: "Name:", bold: true }, enrollment.clientName],
            [{ text: "Client ID:", bold: true }, enrollment.clientId],
            [{ text: "Enrollment No:", bold: true }, enrollment.enrollmentNumber],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 20],
      },

      // Payment Details
      {
        text: "PAYMENT DETAILS",
        style: "sectionHeader",
        margin: [0, 10, 0, 10],
      },
      {
        table: {
          widths: [120, "*"],
          body: [
            [{ text: "Property:", bold: true }, enrollment.propertyName],
            [{ text: "Payment Method:", bold: true }, paymentMethod],
            [{ text: "Payment Date:", bold: true }, format(paymentDate, "PPP")],
            [
              { text: "Amount Paid:", bold: true },
              {
                text: `₦${paymentAmount.toLocaleString()}`,
                fontSize: 14,
                bold: true,
                color: "#FFD700",
              },
            ],
            [
              { text: "Amount in Words:", bold: true },
              { text: numberToWords(paymentAmount), italics: true },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 20],
      },

      // Payment Summary
      {
        text: "PAYMENT SUMMARY",
        style: "sectionHeader",
        margin: [0, 20, 0, 10],
      },
      {
        table: {
          widths: [120, "*"],
          body: [
            [{ text: "Total Property Cost:", bold: true }, `₦${enrollment.totalAmount.toLocaleString()}`],
            [{ text: "Amount Paid to Date:", bold: true }, `₦${enrollment.amountPaid.toLocaleString()}`],
            [
              { text: "Balance Outstanding:", bold: true },
              {
                text: `₦${enrollment.amountPending.toLocaleString()}`,
                bold: true,
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 30],
      },

      // Signature
      {
        columns: [
          {
            width: "*",
            text: [
              "\n\n_______________________\n",
              "Received By\n",
              COMPANY_NAME,
            ],
            fontSize: 9,
          },
          {
            width: "*",
            text: [
              "\n\n_______________________\n",
              "Client Signature\n",
              enrollment.clientName,
            ],
            fontSize: 9,
            alignment: "right",
          },
        ],
        margin: [0, 30, 0, 0],
      },

      // Note
      {
        text: "This is a computer-generated receipt and is valid without signature.",
        fontSize: 8,
        italics: true,
        alignment: "center",
        margin: [0, 30, 0, 0],
        color: "#666666",
      },
    ],

    footer: (currentPage, pageCount) => ({
      text: `${COMPANY_NAME} - Official Payment Receipt | Page ${currentPage} of ${pageCount}`,
      alignment: "center",
      fontSize: 8,
      margin: [0, 10, 0, 0],
      color: "#999999",
    }),

    styles: {
      companyName: {
        fontSize: 18,
        bold: true,
        color: "#FFD700",
      },
      receiptTitle: {
        fontSize: 14,
        bold: true,
        alignment: "right",
      },
      receiptNumber: {
        fontSize: 10,
        alignment: "right",
        color: "#666666",
      },
      sectionHeader: {
        fontSize: 11,
        bold: true,
        color: "#FFD700",
        decoration: "underline",
      },
    },

    defaultStyle: {
      fontSize: 10,
      lineHeight: 1.3,
    },
  }

  pdfMake.createPdf(docDefinition).download(`Receipt-${receiptNumber}.pdf`)
}

/**
 * Generate Allocation Letter PDF
 */
export function generateAllocationLetter(enrollment: Enrollment) {
  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    content: [
      // Header
      {
        text: COMPANY_NAME,
        style: "companyName",
        alignment: "center",
        margin: [0, 0, 0, 5],
      },
      {
        text: COMPANY_ADDRESS,
        alignment: "center",
        fontSize: 9,
        margin: [0, 0, 0, 30],
      },

      // Title
      {
        text: "PLOT ALLOCATION LETTER",
        style: "title",
        margin: [0, 20, 0, 30],
      },

      // Date and Reference
      {
        columns: [
          { text: `Date: ${format(new Date(), "PPP")}`, width: "*" },
          { text: `Ref: ${enrollment.enrollmentNumber}`, width: "*", alignment: "right" },
        ],
        margin: [0, 0, 0, 30],
      },

      // Recipient
      {
        text: [
          { text: "Dear ", fontSize: 11 },
          { text: enrollment.clientName, bold: true, fontSize: 11 },
          { text: ",", fontSize: 11 },
        ],
        margin: [0, 0, 0, 20],
      },

      // Subject
      {
        text: `RE: ALLOCATION OF PLOT ${enrollment.plotNumber || "TBA"} AT ${enrollment.propertyName.toUpperCase()}`,
        bold: true,
        decoration: "underline",
        margin: [0, 0, 0, 20],
      },

      // Body
      {
        text: [
          "We are delighted to inform you that following your enrollment and payment, we have allocated ",
          { text: `Plot ${enrollment.plotNumber || "TBA"}`, bold: true },
          ` to you at ${enrollment.propertyName}.`,
        ],
        margin: [0, 0, 0, 15],
      },

      // Plot Details
      {
        text: "PLOT DETAILS",
        style: "sectionHeader",
        margin: [0, 20, 0, 10],
      },
      {
        table: {
          widths: [150, "*"],
          body: [
            [{ text: "Plot Number:", bold: true }, enrollment.plotNumber || "To Be Assigned"],
            [{ text: "Property Name:", bold: true }, enrollment.propertyName],
            [{ text: "Property Type:", bold: true }, enrollment.propertyType],
            ...(enrollment.selectedSize
              ? [[{ text: "Plot Size:", bold: true }, `${enrollment.selectedSize} ${enrollment.selectedSizeUnit}`]]
              : []),
            [{ text: "Enrollment Number:", bold: true }, enrollment.enrollmentNumber],
            [{ text: "Allocation Date:", bold: true }, format(new Date(), "PPP")],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 20],
      },

      // Important Notes
      {
        text: "IMPORTANT INFORMATION",
        style: "sectionHeader",
        margin: [0, 20, 0, 10],
      },
      {
        ul: [
          "This allocation is subject to full completion of payment as per your payment plan.",
          "The plot location and boundaries will be shown to you during the site inspection.",
          "Please ensure all payments are made on schedule to avoid penalties.",
          "Plot demarcation and documentation will commence upon 100% payment completion.",
          "Transfer of title documents will be processed within 90 days of full payment.",
        ],
        margin: [20, 0, 0, 30],
      },

      // Closing
      {
        text: "Congratulations on this important step towards property ownership. We remain committed to providing you with excellent service.",
        margin: [0, 0, 0, 30],
      },

      // Signature
      {
        text: [
          "Yours sincerely,\n\n\n",
          "_______________________\n",
          `${enrollment.agentName}\n`,
          "Sales Agent\n",
          COMPANY_NAME,
        ],
      },
    ],

    footer: {
      text: `${COMPANY_NAME} | ${COMPANY_PHONE} | ${COMPANY_EMAIL}`,
      alignment: "center",
      fontSize: 8,
      margin: [0, 10, 0, 0],
    },

    styles: {
      companyName: {
        fontSize: 20,
        bold: true,
        color: "#FFD700",
      },
      title: {
        fontSize: 14,
        bold: true,
        alignment: "center",
        decoration: "underline",
      },
      sectionHeader: {
        fontSize: 11,
        bold: true,
        color: "#FFD700",
      },
    },

    defaultStyle: {
      fontSize: 10,
      lineHeight: 1.3,
    },
  }

  pdfMake.createPdf(docDefinition).download(`Plot-Allocation-${enrollment.enrollmentNumber}.pdf`)
}

/**
 * Helper function to convert number to words (simplified)
 */
function numberToWords(num: number): string {
  const naira = Math.floor(num)
  const kobo = Math.round((num - naira) * 100)

  // Simplified - returns formatted text
  if (kobo > 0) {
    return `${naira.toLocaleString()} Naira and ${kobo} Kobo only`
  }
  return `${naira.toLocaleString()} Naira only`
}
