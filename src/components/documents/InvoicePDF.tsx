import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { amountToWords } from "@/lib/number-to-words";
import { CompanySettings, DocSettings, Invoice } from "@/types";
import path from "path";

Font.register({
  family: "Roboto",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf"), fontWeight: 400 },
    { src: path.join(process.cwd(), "public/fonts/Roboto-Bold.ttf"), fontWeight: 700 },
  ],
});

const C = {
  dark:      "#1A1A1A",
  red:       "#DC2626",
  lightGray: "#F3F4F6",
  border:    "#D1D5DB",
  muted:     "#6B7280",
  mutedDark: "#AAAAAA",
  white:     "#FFFFFF",
  green:     "#16A34A",
};

function fmt(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

const styles = StyleSheet.create({
  /* ── PAGE (flex column so body fills gap between header & footer) ── */
  page: {
    fontFamily: "Roboto",
    backgroundColor: C.white,
    fontSize: 9,
    color: C.dark,
    flexDirection: "column",
  },

  /* ── HEADER ── */
  header: {
    backgroundColor: C.dark,
    paddingHorizontal: 32,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  /* White badge so logo (white background) shows clearly on dark header */
  logoBadge: {
    width: 62,
    height: 62,
    backgroundColor: C.white,
    borderRadius: 6,
    marginRight: 14,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  logoImg: { width: 54, height: 54, objectFit: "contain" },
  companyBlock: { flex: 1 },
  companyName: {
    color: C.white,
    fontSize: 13,
    fontFamily: "Roboto",
    fontWeight: 700,
    marginBottom: 4,
  },
  companyLine: {
    color: C.mutedDark,
    fontSize: 7.5,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  headerRight: {
    alignItems: "flex-end",
    flexShrink: 0,
    width: 100,
  },
  invoiceLabel: {
    color: C.white,
    fontSize: 26,
    fontFamily: "Roboto",
    fontWeight: 700,
    letterSpacing: 2,
  },
  invoiceSubLabel: {
    color: C.red,
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: 700,
    letterSpacing: 1,
    marginTop: 2,
    textAlign: "right",
  },

  /* ── BODY (flex: 1 so it stretches to fill page between header & footer) ── */
  body: {
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 16,
    flex: 1,
  },

  /* ── BILL TO / INVOICE DETAILS ── */
  infoRow: { flexDirection: "row", marginBottom: 20 },
  infoBoxLeft: {
    width: "52%",
    marginRight: 12,
    backgroundColor: C.lightGray,
    borderLeftWidth: 3,
    borderLeftColor: C.red,
    borderRadius: 4,
    padding: 12,
  },
  infoBoxRight: {
    width: "46%",
    backgroundColor: C.lightGray,
    borderRadius: 4,
    padding: 12,
  },
  infoBoxLabel: {
    color: C.muted,
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  infoName: {
    color: C.dark,
    fontSize: 11,
    fontFamily: "Roboto",
    fontWeight: 700,
    marginBottom: 3,
  },
  infoLine: { color: C.muted, fontSize: 8, marginBottom: 2, lineHeight: 1.4 },
  metaRow: { flexDirection: "row", marginBottom: 5 },
  metaKey: { color: C.muted, fontSize: 8, width: 72 },
  metaVal: {
    color: C.dark,
    fontSize: 8.5,
    fontFamily: "Roboto",
    fontWeight: 700,
    flex: 1,
  },

  /* ── ITEMS TABLE ── */
  tableWrap: { marginBottom: 0 },
  tableHeader: {
    backgroundColor: C.dark,
    flexDirection: "row",
    paddingVertical: 7,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableRowAlt: { backgroundColor: C.lightGray },

  /* columns — identical between header & data rows */
  cNo:   { width: 24, paddingLeft: 10, fontSize: 7.5 },
  cDesc: { flex: 1, paddingLeft: 6 },
  cHsn:  { width: 48, textAlign: "center" },
  cQty:  { width: 32, textAlign: "right" },
  cRate: { width: 65, textAlign: "right" },
  cDisc: { width: 36, textAlign: "right" },
  cGst:  { width: 36, textAlign: "right" },
  cAmt:  { width: 70, paddingRight: 10, textAlign: "right" },

  thCell: {
    color: C.white,
    fontSize: 7.5,
    fontFamily: "Roboto",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tdCell: { fontSize: 8.5, color: C.dark },
  tdBold: { fontFamily: "Roboto", fontWeight: 700 },

  /* ── TOTALS ── */
  totalsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
    marginBottom: 14,
  },
  totalsBox: { width: 240 },
  tRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  tDivider: { height: 1, backgroundColor: C.border, marginVertical: 5 },
  tLabel: { color: C.muted, fontSize: 8.5 },
  tValue: { color: C.dark, fontSize: 8.5, textAlign: "right" },
  grandRow: {
    backgroundColor: C.dark,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 2,
  },
  grandLabel: { color: C.white, fontSize: 10, fontFamily: "Roboto", fontWeight: 700 },
  grandValue: { color: C.red, fontSize: 14, fontFamily: "Roboto", fontWeight: 700 },
  paidRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
    paddingHorizontal: 2,
  },
  balRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    paddingTop: 3,
  },
  balLabel: { color: C.red, fontSize: 8.5, fontFamily: "Roboto", fontWeight: 700 },
  balValue: { color: C.red, fontSize: 8.5, fontFamily: "Roboto", fontWeight: 700 },

  /* ── AMOUNT IN WORDS ── */
  wordsBox: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  wordsLabel: {
    color: C.muted,
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  wordsText: {
    color: C.dark,
    fontSize: 9.5,
    fontFamily: "Roboto",
    fontWeight: 700,
    lineHeight: 1.4,
  },

  /* ── BANK / NOTES / TERMS ── */
  twoCol: { flexDirection: "row", marginBottom: 16 },
  twoColLeft: { flex: 1, marginRight: 20 },
  twoColRight: { flex: 1 },
  sectionTitle: {
    color: C.dark,
    fontSize: 7.5,
    fontFamily: "Roboto",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingBottom: 5,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  bankGrid: { flexDirection: "row", flexWrap: "wrap" },
  bankItem: { width: "50%", marginBottom: 7 },
  bankItemFull: { width: "100%", marginBottom: 7 },
  bankLabel: { color: C.muted, fontSize: 7, marginBottom: 2 },
  bankValue: { color: C.dark, fontSize: 8.5, fontFamily: "Roboto", fontWeight: 700 },
  notesText: { color: C.dark, fontSize: 8, lineHeight: 1.5 },

  /* ── SIGNATURE ── */
  sigSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
  },
  sigBox: { alignItems: "center", width: 150 },
  sigLine: { height: 1, backgroundColor: C.border, width: 130, marginBottom: 5 },
  sigLabel: { color: C.muted, fontSize: 7.5 },
  sigName: {
    color: C.dark,
    fontSize: 8.5,
    fontFamily: "Roboto",
    fontWeight: 700,
    marginTop: 2,
  },

  /* ── DARK FOOTER STRIP (mirrors header, fills bottom) ── */
  footer: {
    backgroundColor: C.dark,
    paddingHorizontal: 32,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {},
  footerThank: {
    color: C.red,
    fontSize: 9,
    fontFamily: "Roboto",
    fontWeight: 700,
    marginBottom: 3,
  },
  footerAddr: { color: C.mutedDark, fontSize: 7, lineHeight: 1.4 },
  footerRight: { alignItems: "flex-end" },
  footerBrand: {
    color: C.white,
    fontSize: 9,
    fontFamily: "Roboto",
    fontWeight: 700,
    marginBottom: 3,
  },
  footerContact: { color: C.mutedDark, fontSize: 7 },
  pageNum: {
    position: "absolute",
    bottom: 6,
    right: 32,
    color: "#555555",
    fontSize: 7,
  },
});

interface Props {
  invoice: Invoice & { invoice_items: any[]; customers: any };
  company: CompanySettings | null;
  docSettings: DocSettings | null;
  logoBase64?: string | null;
}

const FALLBACK_COMPANY = "Shiv Car Detailing Studio";
const FALLBACK_ADDRESS = "Shop No. 1, Silver Habitat, Opposite Karnavati Industrial Estate, Near Royal Restaurant & Banquet, Adinath Nagar, Vastral, Ahmedabad, Gujarat – 382415";
const FALLBACK_PHONE = "09913092599";

export function InvoicePDF({ invoice, company, docSettings, logoBase64 }: Props) {
  const customer = invoice.customers;
  const items = invoice.invoice_items ?? [];
  const hasBankDetails = !!(docSettings?.bank_account_number || docSettings?.bank_upi);
  const hasNotes = !!(invoice.notes?.trim());
  const hasTerms = !!(invoice.terms?.trim());

  const companyName    = company?.company_name || FALLBACK_COMPANY;
  const companyAddress = company?.address      || FALLBACK_ADDRESS;
  const companyPhone   = company?.phone        || FALLBACK_PHONE;
  const companyEmail   = company?.email        || "";
  const companyGstin   = company?.gstin        || "";

  return (
    <Document title={invoice.invoice_number} author={companyName}>
      <Page size="A4" style={styles.page} wrap>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* White badge box so logo's white bg blends, red elements visible */}
            {logoBase64 && (
              <View style={styles.logoBadge}>
                <Image src={logoBase64} style={styles.logoImg} />
              </View>
            )}
            <View style={styles.companyBlock}>
              <Text style={styles.companyName}>{companyName.toUpperCase()}</Text>
              {companyAddress ? <Text style={styles.companyLine}>{companyAddress}</Text> : null}
              {companyPhone   ? <Text style={styles.companyLine}>Tel: {companyPhone}</Text>   : null}
              {companyEmail   ? <Text style={styles.companyLine}>Email: {companyEmail}</Text> : null}
              {companyGstin   ? <Text style={styles.companyLine}>GSTIN: {companyGstin}</Text> : null}
            </View>
          </View>
          {/* Fixed-width right block so INVOICE never crowds the address */}
          <View style={styles.headerRight}>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceSubLabel}>TAX INVOICE</Text>
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={styles.body}>

          {/* Bill To + Invoice Details */}
          <View style={styles.infoRow}>
            <View style={styles.infoBoxLeft}>
              <Text style={styles.infoBoxLabel}>Bill To</Text>
              <Text style={styles.infoName}>{customer?.name ?? "—"}</Text>
              {customer?.company_name ? <Text style={styles.infoLine}>{customer.company_name}</Text> : null}
              {customer?.address      ? <Text style={styles.infoLine}>{customer.address}</Text>      : null}
              {customer?.phone        ? <Text style={styles.infoLine}>Tel: {customer.phone}</Text>   : null}
              {customer?.email        ? <Text style={styles.infoLine}>{customer.email}</Text>        : null}
              {customer?.gstin        ? <Text style={styles.infoLine}>GSTIN: {customer.gstin}</Text> : null}
            </View>

            <View style={styles.infoBoxRight}>
              <Text style={styles.infoBoxLabel}>Invoice Details</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Invoice No</Text>
                <Text style={styles.metaVal}>{invoice.invoice_number}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Date</Text>
                <Text style={styles.metaVal}>{fmtDate(invoice.date)}</Text>
              </View>
              {invoice.due_date && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Due Date</Text>
                  <Text style={styles.metaVal}>{fmtDate(invoice.due_date)}</Text>
                </View>
              )}
              {invoice.prepared_by && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Prepared By</Text>
                  <Text style={styles.metaVal}>{invoice.prepared_by}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.tableWrap}>
            <View style={styles.tableHeader}>
              <Text style={[styles.thCell, styles.cNo]}>#</Text>
              <Text style={[styles.thCell, styles.cDesc]}>Description</Text>
              <Text style={[styles.thCell, styles.cHsn]}>HSN</Text>
              <Text style={[styles.thCell, styles.cQty]}>Qty</Text>
              <Text style={[styles.thCell, styles.cRate]}>Rate</Text>
              <Text style={[styles.thCell, styles.cDisc]}>Disc%</Text>
              <Text style={[styles.thCell, styles.cGst]}>GST%</Text>
              <Text style={[styles.thCell, styles.cAmt]}>Amount</Text>
            </View>

            {items.map((item: any, idx: number) => (
              <View
                key={item.id ?? idx}
                style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
                wrap={false}
              >
                <Text style={[styles.tdCell, styles.cNo]}>{idx + 1}</Text>
                <Text style={[styles.tdCell, styles.cDesc]}>{item.description}</Text>
                <Text style={[styles.tdCell, styles.cHsn]}>{item.hsn_code || "—"}</Text>
                <Text style={[styles.tdCell, styles.cQty]}>{Number(item.quantity)}</Text>
                <Text style={[styles.tdCell, styles.cRate]}>{fmt(Number(item.rate))}</Text>
                <Text style={[styles.tdCell, styles.cDisc]}>{Number(item.discount_percent)}%</Text>
                <Text style={[styles.tdCell, styles.cGst]}>{Number(item.gst_percent)}%</Text>
                <Text style={[styles.tdCell, styles.tdBold, styles.cAmt]}>
                  {fmt(Number(item.amount))}
                </Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.totalsSection}>
            <View style={styles.totalsBox}>
              <View style={styles.tRow}>
                <Text style={styles.tLabel}>Subtotal</Text>
                <Text style={styles.tValue}>{fmt(Number(invoice.subtotal))}</Text>
              </View>
              {Number(invoice.discount_amount) > 0 && (
                <View style={styles.tRow}>
                  <Text style={styles.tLabel}>Discount</Text>
                  <Text style={[styles.tValue, { color: C.green }]}>
                    -{fmt(Number(invoice.discount_amount))}
                  </Text>
                </View>
              )}
              {Number(invoice.taxable_amount) > 0 &&
               Number(invoice.taxable_amount) !== Number(invoice.subtotal) && (
                <View style={styles.tRow}>
                  <Text style={styles.tLabel}>Taxable Amount</Text>
                  <Text style={styles.tValue}>{fmt(Number(invoice.taxable_amount))}</Text>
                </View>
              )}
              <View style={styles.tRow}>
                <Text style={styles.tLabel}>GST</Text>
                <Text style={styles.tValue}>{fmt(Number(invoice.gst_amount))}</Text>
              </View>
              <View style={styles.tDivider} />
              <View style={styles.grandRow}>
                <Text style={styles.grandLabel}>GRAND TOTAL</Text>
                <Text style={styles.grandValue}>{fmt(Number(invoice.grand_total))}</Text>
              </View>
              {Number(invoice.amount_paid) > 0 && (
                <>
                  <View style={styles.paidRow}>
                    <Text style={[styles.tLabel, { color: C.green }]}>Amount Paid</Text>
                    <Text style={[styles.tValue, { color: C.green }]}>
                      {fmt(Number(invoice.amount_paid))}
                    </Text>
                  </View>
                  <View style={styles.balRow}>
                    <Text style={styles.balLabel}>Balance Due</Text>
                    <Text style={styles.balValue}>{fmt(Number(invoice.balance_due))}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Amount in Words */}
          <View style={styles.wordsBox}>
            <Text style={styles.wordsLabel}>Amount in Words</Text>
            <Text style={styles.wordsText}>{amountToWords(Number(invoice.grand_total))}</Text>
          </View>

          {/* Bank + Notes/Terms */}
          {(hasBankDetails || hasNotes || hasTerms) && (
            <View style={styles.twoCol}>
              {hasBankDetails && (
                <View style={styles.twoColLeft}>
                  <Text style={styles.sectionTitle}>Bank Details</Text>
                  <View style={styles.bankGrid}>
                    {docSettings?.bank_account_name && (
                      <View style={styles.bankItem}>
                        <Text style={styles.bankLabel}>Account Name</Text>
                        <Text style={styles.bankValue}>{docSettings.bank_account_name}</Text>
                      </View>
                    )}
                    {docSettings?.bank_name && (
                      <View style={styles.bankItem}>
                        <Text style={styles.bankLabel}>Bank</Text>
                        <Text style={styles.bankValue}>{docSettings.bank_name}</Text>
                      </View>
                    )}
                    {docSettings?.bank_account_number && (
                      <View style={styles.bankItem}>
                        <Text style={styles.bankLabel}>Account Number</Text>
                        <Text style={styles.bankValue}>{docSettings.bank_account_number}</Text>
                      </View>
                    )}
                    {docSettings?.bank_ifsc && (
                      <View style={styles.bankItem}>
                        <Text style={styles.bankLabel}>IFSC Code</Text>
                        <Text style={styles.bankValue}>{docSettings.bank_ifsc}</Text>
                      </View>
                    )}
                    {docSettings?.bank_upi && (
                      <View style={styles.bankItemFull}>
                        <Text style={styles.bankLabel}>UPI ID</Text>
                        <Text style={styles.bankValue}>{docSettings.bank_upi}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
              {(hasNotes || hasTerms) && (
                <View style={hasBankDetails ? styles.twoColRight : styles.twoColLeft}>
                  {hasNotes && (
                    <View style={{ marginBottom: hasTerms ? 10 : 0 }}>
                      <Text style={styles.sectionTitle}>Notes</Text>
                      <Text style={styles.notesText}>{invoice.notes}</Text>
                    </View>
                  )}
                  {hasTerms && (
                    <View>
                      <Text style={styles.sectionTitle}>Terms & Conditions</Text>
                      <Text style={styles.notesText}>{invoice.terms}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Signature */}
          <View style={styles.sigSection}>
            <View style={styles.sigBox}>
              <View style={styles.sigLine} />
              <Text style={styles.sigLabel}>Authorized Signatory</Text>
              <Text style={styles.sigName}>{companyName}</Text>
            </View>
          </View>

        </View>

        {/* ── DARK FOOTER STRIP (mirrors header, anchors the bottom) ── */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerThank}>Thank you for your business!</Text>
            <Text style={styles.footerAddr}>{companyAddress}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerBrand}>{companyName.toUpperCase()}</Text>
            {companyPhone ? <Text style={styles.footerContact}>Tel: {companyPhone}</Text> : null}
          </View>
        </View>

        <Text
          style={styles.pageNum}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
