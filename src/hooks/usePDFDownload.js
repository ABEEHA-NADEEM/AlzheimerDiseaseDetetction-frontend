/**
 * usePDFDownload.js
 *
 * Drop-in hook that generates a styled diagnostic report PDF
 * client-side (no backend changes needed).
 *
 * Dependencies — add to package.json if not already present:
 *   npm install jspdf jspdf-autotable
 *
 * Usage:
 *   const { downloadPDF, downloading } = usePDFDownload()
 *   <button onClick={() => downloadPDF(result)} disabled={downloading}>
 *     {downloading ? 'Generating…' : 'Download PDF'}
 *   </button>
 */

import { useState, useCallback } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ─── Colour palette ───────────────────────────────────────────────────────────
const COLOURS = {
  primary:    [13,  148, 136],   // teal-600
  danger:     [225,  29,  72],   // rose-600
  warning:    [217, 119,   6],   // amber-600
  success:    [22,  163,  74],   // green-600
  dark:       [15,  23,  42],    // slate-900
  mid:        [100, 116, 139],   // slate-500
  light:      [241, 245, 249],   // slate-100
  white:      [255, 255, 255],
}

const DIAGNOSIS_COLOUR = {
  Alzheimer: COLOURS.danger,
  MCI:       COLOURS.warning,
  Normal:    COLOURS.success,
  CN:        COLOURS.success,
}

// ─── Helper: load a base64 image into an Image element ───────────────────────
function loadImage(base64, mime = 'image/png') {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src = `data:${mime};base64,${base64}`
  })
}

// ─── Helper: draw a rounded rect ─────────────────────────────────────────────
function roundedRect(doc, x, y, w, h, r, fillColor) {
  if (fillColor) doc.setFillColor(...fillColor)
  doc.roundedRect(x, y, w, h, r, r, fillColor ? 'F' : 'S')
}

// ─── Main builder ─────────────────────────────────────────────────────────────
async function buildPDF(result) {
  const { prediction, explanations, patient, scan_id, created_at, doctor_name } = result

  const doc  = new jsPDF({ unit: 'mm', format: 'a4' })
  const W    = 210   // A4 width
  const H    = 297   // A4 height
  const PAD  = 14    // left/right margin
  let   curY = 0

  // ─── Header bar ────────────────────────────────────────────────────────────
  doc.setFillColor(...COLOURS.primary)
  doc.rect(0, 0, W, 28, 'F')

  doc.setTextColor(...COLOURS.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('NeuroScan AI — Diagnostic Report', PAD, 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(`Generated: ${new Date().toLocaleString()}   |   Scan ID: ${scan_id ?? '—'}`, PAD, 20)

  curY = 36

  // ─── Section: Patient Info ──────────────────────────────────────────────────
  roundedRect(doc, PAD, curY, W - PAD * 2, 28, 3, COLOURS.light)

  doc.setTextColor(...COLOURS.mid)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.text('PATIENT DETAILS', PAD + 4, curY + 6)

  const patientFields = [
    ['Name',        patient?.name   || '—'],
    ['Age',         patient?.age    ? `${patient.age} yrs` : '—'],
    ['Gender',      patient?.gender || '—'],
    ['Scan Date',   created_at      || '—'],
    ['Ordered by',  doctor_name     || '—'],
  ]

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...COLOURS.dark)

  const colW = (W - PAD * 2 - 8) / patientFields.length
  patientFields.forEach(([label, value], i) => {
    const x = PAD + 4 + i * colW
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...COLOURS.mid)
    doc.text(label.toUpperCase(), x, curY + 13)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...COLOURS.dark)
    doc.text(String(value), x, curY + 20)
  })

  curY += 36

  // ─── Section: Diagnosis ─────────────────────────────────────────────────────
  const diagColour = DIAGNOSIS_COLOUR[prediction?.predicted_class] || COLOURS.primary

  roundedRect(doc, PAD, curY, W - PAD * 2, 32, 3, COLOURS.light)

  // Colour badge
  roundedRect(doc, PAD + 4, curY + 6, 50, 10, 2, diagColour)
  doc.setTextColor(...COLOURS.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(prediction?.predicted_class || '—', PAD + 29, curY + 12.5, { align: 'center' })

  // Confidence
  doc.setTextColor(...COLOURS.dark)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Confidence: ${prediction?.confidence ?? '—'}%`, PAD + 60, curY + 12.5)

  // Horizontal probability bars
  const probs = Object.entries(prediction?.all_probabilities || {})
  const barX  = W - PAD - 80
  const barW  = 76
  probs.forEach(([cls, pct], i) => {
    const rowY = curY + 8 + i * 7
    doc.setFontSize(7)
    doc.setTextColor(...COLOURS.mid)
    doc.text(cls, barX, rowY + 3)

    // Track
    doc.setFillColor(...COLOURS.white)
    doc.roundedRect(barX + 18, rowY, barW - 30, 4, 1, 1, 'F')

    // Fill
    const fill = cls === prediction?.predicted_class ? COLOURS.primary : [203, 213, 225]
    doc.setFillColor(...fill)
    doc.roundedRect(barX + 18, rowY, Math.max(1, (barW - 30) * pct / 100), 4, 1, 1, 'F')

    // Label
    doc.setTextColor(...COLOURS.dark)
    doc.setFont('helvetica', 'bold')
    doc.text(`${pct}%`, barX + barW - 8, rowY + 3, { align: 'right' })
    doc.setFont('helvetica', 'normal')
  })

  curY += 42

  // ─── Section: XAI Images ───────────────────────────────────────────────────
  const xaiItems = [
    { key: 'gradcam', label: 'Grad-CAM Heatmap',   description: 'Highlights MRI regions most influential to the prediction.' },
    { key: 'shap',    label: 'SHAP Analysis',       description: 'Shows per-region feature contribution scores.' },
    { key: 'lime',    label: 'LIME Explanation',    description: 'Local surrogate model highlighting positive/negative regions.' },
  ].filter(item => explanations?.[item.key])

  // Section heading
  doc.setFillColor(...COLOURS.primary)
  doc.setTextColor(...COLOURS.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  roundedRect(doc, PAD, curY, W - PAD * 2, 8, 2, COLOURS.primary)
  doc.text('EXPLAINABILITY MAPS', PAD + 4, curY + 5.5)
  curY += 12

  if (xaiItems.length === 0) {
    doc.setTextColor(...COLOURS.mid)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.text('No XAI images available.', PAD + 4, curY + 6)
    curY += 12
  } else {
    const imgW   = (W - PAD * 2 - 6 * (xaiItems.length - 1)) / xaiItems.length
    const imgH   = 55
    const labelH = 18

    for (let i = 0; i < xaiItems.length; i++) {
      const { key, label, description } = xaiItems[i]
      const x = PAD + i * (imgW + 6)

      // Card bg
      roundedRect(doc, x, curY, imgW, imgH + labelH, 3, COLOURS.light)

      // Image
      try {
        const imgData = `data:image/png;base64,${explanations[key]}`
        doc.addImage(imgData, 'PNG', x + 2, curY + 2, imgW - 4, imgH - 4, undefined, 'FAST')
      } catch {
        doc.setTextColor(...COLOURS.mid)
        doc.setFontSize(8)
        doc.text('Image unavailable', x + imgW / 2, curY + imgH / 2, { align: 'center' })
      }

      // Label below image
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(...COLOURS.dark)
      doc.text(label, x + imgW / 2, curY + imgH + 5, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.5)
      doc.setTextColor(...COLOURS.mid)
      const lines = doc.splitTextToSize(description, imgW - 4)
      doc.text(lines, x + imgW / 2, curY + imgH + 10, { align: 'center' })
    }

    curY += imgH + labelH + 10
  }

  // ─── Section: Interpretation note ─────────────────────────────────────────
  if (curY + 30 > H - 20) { doc.addPage(); curY = 14 }

  roundedRect(doc, PAD, curY, W - PAD * 2, 26, 3, [255, 251, 235]) // amber-50
  doc.setFillColor(217, 119, 6)
  doc.circle(PAD + 8, curY + 7, 3, 'F')
  doc.setTextColor(217, 119, 6)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('Clinical Disclaimer', PAD + 14, curY + 8)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOURS.dark)
  const disclaimer =
    'This AI-generated report is intended to assist clinicians and does not constitute a medical diagnosis. ' +
    'Results should be interpreted in conjunction with clinical history, symptoms, and other investigations ' +
    'by a qualified healthcare professional.'
  const dLines = doc.splitTextToSize(disclaimer, W - PAD * 2 - 10)
  doc.text(dLines, PAD + 6, curY + 15)

  curY += 32

  // ─── Footer ────────────────────────────────────────────────────────────────
  doc.setFillColor(...COLOURS.light)
  doc.rect(0, H - 12, W, 12, 'F')
  doc.setTextColor(...COLOURS.mid)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('NeuroScan AI  |  Confidential – For clinical use only', W / 2, H - 5, { align: 'center' })

  return doc
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePDFDownload() {
  const [downloading, setDownloading] = useState(false)

  const downloadPDF = useCallback(async (result) => {
    if (!result) return
    setDownloading(true)
    try {
      const doc      = await buildPDF(result)
      const filename = `NeuroScan_Report_${result.scan_id ?? 'scan'}_${
        (result.patient?.name || 'patient').replace(/\s+/g, '_')
      }.pdf`
      doc.save(filename)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Could not generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }, [])

  return { downloadPDF, downloading }
}