import { jsPDF } from 'jspdf';
import { ContentItem, PdfPageContent } from '../types/content';
import { YUVASETU_WATERMARK_LOGO_BASE64 } from './watermarkLogoBase64';

/**
 * Converts a Base64 data URL to a binary Blob
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Triggers a native browser file download on PC or mobile devices
 */
export function triggerBrowserDownload(blobOrUrl: Blob | string, fileName: string): void {
  const link = document.createElement('a');
  let blobUrl: string | null = null;

  if (typeof blobOrUrl === 'string') {
    if (blobOrUrl.startsWith('data:')) {
      const blob = dataUrlToBlob(blobOrUrl);
      blobUrl = URL.createObjectURL(blob);
      link.href = blobUrl;
    } else {
      link.href = blobOrUrl;
    }
  } else {
    blobUrl = URL.createObjectURL(blobOrUrl);
    link.href = blobUrl;
  }

  link.setAttribute('download', fileName);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }
  }, 1000);
}

/**
 * Synthesizes dynamic pages if an item does not have pre-parsed pages
 */
export function synthesizePagesForContent(content: ContentItem): PdfPageContent[] {
  if (content.pdf_data?.pages && content.pdf_data.pages.length > 0) {
    return content.pdf_data.pages;
  }

  const topic = content.topic || content.title;
  const subject = content.subject_name || 'Academic Course';
  const desc = content.description || 'Comprehensive study handout.';
  const body = content.content_body || '';

  const generatedPages: PdfPageContent[] = [
    {
      pageNumber: 1,
      title: `${topic}: Core Fundamentals & Architecture`,
      heading: `${topic}: Core Fundamentals & Architecture`,
      topicBadge: subject,
      content: `${topic} is a critical building block within ${subject}.\n\nOverview:\n${desc}\n\nKey Concepts:\n1. Foundational Architecture & Mathematical Modeling\n2. Memory, Time, and Algorithmic Complexity\n3. Practical Implementation Guidelines and Edge Cases.`,
      keyPoints: [
        `Primary Objective: Master ${topic} for semester exams and technical interviews`,
        'High-yield conceptual definitions and systematic proofs',
        'Optimized data structures and architectural trade-offs',
      ],
      contentNotes: [
        `Primary Objective: Master ${topic} for semester exams and technical interviews`,
        'High-yield conceptual definitions and systematic proofs',
        'Optimized data structures and architectural trade-offs',
      ],
      diagramText: `[ Input Data / Problem Statement ]\n       │\n       ▼\n[ ${topic} Processing Engine ] ──(Verification)──> [ Optimal Output Solution ]`,
      diagramAscii: `[ Input Data / Problem Statement ]\n       │\n       ▼\n[ ${topic} Processing Engine ] ──(Verification)──> [ Optimal Output Solution ]`,
      keyFormulas: [
        'Time Complexity: O(log n) to O(n log n)',
        'Space Complexity: O(1) Auxiliary or O(n) Storage',
      ],
      examTips: `Focus on step-by-step state tracing and edge conditions (empty inputs, single element, negative keys) during exams.`,
    },
    {
      pageNumber: 2,
      title: `${topic}: In-Depth Analysis & Proofs`,
      heading: `${topic}: In-Depth Analysis & Proofs`,
      topicBadge: 'Derivations & Mechanics',
      content: body
        ? body.slice(0, 800)
        : `Detailed analysis of operations, runtime invariance, and algebraic proofs for ${topic}.\n\nWhen evaluating real-world performance, consider both worst-case and amortized guarantees. Memory layouts affect hardware cache locality and overall execution throughput.`,
      keyPoints: [
        'Rigorous algorithmic invariant proofs',
        'State transitions across consecutive iterations',
        'Corner cases and boundary limits',
      ],
      contentNotes: [
        'Rigorous algorithmic invariant proofs',
        'State transitions across consecutive iterations',
        'Corner cases and boundary limits',
      ],
      diagramText: `State[i] ──(Step Transition)──> State[i+1] ──(Convergence)──> Verified Invariant`,
      diagramAscii: `State[i] ──(Step Transition)──> State[i+1] ──(Convergence)──> Verified Invariant`,
      keyFormulas: ['Recurrence: T(n) = aT(n/b) + f(n)', 'Amortized Cost: Φ(D_i) - Φ(D_{i-1}) + c_i'],
      examTips: `In university examinations, always state assumptions clearly before sketching state transitions.`,
    },
    {
      pageNumber: 3,
      title: `${topic}: Code Implementation & Solved Cases`,
      heading: `${topic}: Code Implementation & Solved Cases`,
      topicBadge: 'Code & Applications',
      content: `Implementation patterns in standard systems languages (C++, Java, Python).\n\nKey Best Practices:\n- Guard against out-of-bounds index exceptions\n- Validate pointer nullability and empty collections\n- Avoid redundant reallocations inside nested loops.`,
      codeSnippet: `// Standard optimal implementation for ${topic}\nvoid executeOperation(const vector<int>& input) {\n    int n = input.size();\n    for (int i = 0; i < n; ++i) {\n        // Process elements with optimal bounds\n    }\n}`,
      keyPoints: [
        'Modular, maintainable code structure',
        'Zero memory leaks and safe pointer references',
        'Benchmarked execution profiles',
      ],
      contentNotes: [
        'Modular, maintainable code structure',
        'Zero memory leaks and safe pointer references',
        'Benchmarked execution profiles',
      ],
      examTips: `Write comments indicating variable roles (e.g. low, mid, high) to secure full partial marking.`,
    },
    {
      pageNumber: 4,
      title: `${topic}: Summary & Practice Problems`,
      heading: `${topic}: Summary & Practice Problems`,
      topicBadge: 'Revision & Checklist',
      content: `Quick Revision Summary for ${topic}:\n\nReview this checklist 24 hours prior to exams:\n✓ Definition and primary application domains\n✓ Step-by-step dry run on at least 2 distinct sample inputs\n✓ Complexity comparison against alternative techniques\n✓ Typical interview trap questions and counterexamples.`,
      keyPoints: [
        'Consolidated high-frequency viva questions',
        'Common student pitfalls and misconceptions',
        'Reference problems with verified solutions',
      ],
      contentNotes: [
        'Consolidated high-frequency viva questions',
        'Common student pitfalls and misconceptions',
        'Reference problems with verified solutions',
      ],
      diagramText: `[ Practice Problem ] ──> [ Identify Pattern ] ──> [ Optimal Strategy ] ──> [ 100% Score ]`,
      diagramAscii: `[ Practice Problem ] ──> [ Identify Pattern ] ──> [ Optimal Strategy ] ──> [ 100% Score ]`,
      examTips: `Re-check time allocation during exams; never spend more than 15 minutes on a 5-mark derivation.`,
    },
  ];

  return generatedPages;
}

/**
 * Draws an official, elegant academic watermark positioned precisely in the middle
 * (vertically and horizontally centered) on every page of the downloaded PDF.
 * Prominently features the official YuvaSetu emblem logo (bridge, graduation cap,
 * sunburst rays, rising pathways, open book, and "Samajh Se Safalta Tak" motto).
 */
export function drawPageMiddleWatermark(
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  brandText = 'YuvaSetu',
  subText = 'Samajh Se Safalta Tak  •  Verified Academic Platform'
): void {
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  if (typeof doc.saveGraphicsState === 'function') {
    doc.saveGraphicsState();
  }

  // 1. Set low opacity for background watermark effect if supported by jsPDF
  try {
    if (typeof (doc as any).setGState === 'function' && (doc as any).GState) {
      doc.setGState(new (doc as any).GState({ opacity: 0.14 }));
    }
  } catch {
    // Graceful fallback to soft color
  }

  // 2. Embed the official YuvaSetu logo emblem precisely in the center of the page
  const logoSize = 84; // 84mm x 84mm diameter crest
  const logoX = centerX - logoSize / 2;
  const logoY = centerY - logoSize / 2;

  try {
    doc.addImage(
      YUVASETU_WATERMARK_LOGO_BASE64,
      'PNG',
      logoX,
      logoY,
      logoSize,
      logoSize,
      'YUVASETU_WATERMARK_LOGO',
      'FAST'
    );
  } catch (err) {
    console.warn('Fallback: drawing vector watermark fallback', err);
    // Fallback if image rasterization was restricted
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(148, 163, 184);
    doc.text(brandText, centerX, centerY, { align: 'center' });
  }

  // 3. Concentric Watermark Security Rings around the Logo
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.4);
  doc.circle(centerX, centerY, 46, 'S');
  doc.circle(centerX, centerY, 48.5, 'S');

  // 4. Top Official Arch Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('★  OFFICIAL VERIFIED ACADEMIC LEARNING RESOURCE  ★', centerX, centerY - 52, {
    align: 'center',
  });

  // 5. Verification Mark & Domain
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('VERIFIED PEER NOTES  •  yuvasetu.edu  •  NOT FOR SALE', centerX, centerY + 53, {
    align: 'center',
  });

  // 6. Faint diagonal security watermark text across page background
  try {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(226, 232, 240); // slate-200
    (doc as any).text('YuvaSetu  •  Samajh Se Safalta Tak', centerX, centerY, {
      align: 'center',
      angle: 32,
    });
  } catch {
    // If angle not supported
  }

  // Restore graphics state so subsequent text renders normally
  if (typeof doc.restoreGraphicsState === 'function') {
    doc.restoreGraphicsState();
  }
}

/**
 * Generates a valid multi-page PDF document using jsPDF and triggers browser download
 */
export function generateAndDownloadPdf(content: ContentItem, fileName?: string): void {
  const pages = synthesizePagesForContent(content);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const downloadName =
    fileName ||
    content.pdf_data?.fileName ||
    `${content.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_YuvaSetu.pdf`;

  // === COVER / FIRST PAGE ===
  // Draw Middle Center Watermark for Cover Page (behind text)
  drawPageMiddleWatermark(doc, pageWidth, pageHeight);

  // Background Header Banner
  doc.setFillColor(12, 18, 36);
  doc.rect(0, 0, pageWidth, 48, 'F');

  // Official Logo Crest in Top Right of Header
  try {
    doc.addImage(
      YUVASETU_WATERMARK_LOGO_BASE64,
      'PNG',
      pageWidth - margin - 35,
      6.5,
      35,
      35,
      'YUVASETU_WATERMARK_LOGO',
      'FAST'
    );
  } catch {
    // Graceful fallback
  }

  // Brand Name
  doc.setTextColor(34, 211, 238); // cyan-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('YuvaSetu', margin, 20);

  // Tagline
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Samajh Se Safalta Tak  •  Verified Academic Learning Platform', margin, 27);

  // Subject Badge
  doc.setFillColor(6, 78, 59); // emerald-900
  doc.roundedRect(margin, 34, 70, 7, 2, 2, 'F');
  doc.setTextColor(110, 231, 183);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(content.subject_name.toUpperCase(), margin + 4, 39);

  // Title
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(content.title, contentWidth);
  doc.text(titleLines, margin, 62);

  let currentY = 62 + titleLines.length * 8;

  // Metadata block
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'F');
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Topic: ${content.topic || content.title}`, margin + 4, currentY + 6);
  doc.text(
    `Publisher: ${content.creator.name} (${content.creator.college || 'YuvaSetu Academic Lead'})`,
    margin + 4,
    currentY + 12
  );
  doc.text(
    `Pages: ${pages.length} Detailed Pages  •  Status: Verified 100% Free Peer Resource`,
    margin + 4,
    currentY + 17
  );

  currentY += 26;

  // Overview
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Resource Overview & Syllabus Scope:', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const descLines = doc.splitTextToSize(content.description, contentWidth);
  doc.text(descLines, margin, currentY);
  currentY += descLines.length * 5.5 + 8;

  // Table of Contents Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, pages.length * 9 + 14, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Table of Contents & Page Index:', margin + 4, currentY + 7);
  let tocY = currentY + 14;

  pages.forEach((p, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(14, 165, 233);
    doc.text(`Page ${p.pageNumber || idx + 1}:`, margin + 4, tocY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const pageTitle = p.heading || p.title || `Section ${idx + 1}`;
    doc.text(pageTitle, margin + 22, tocY);
    tocY += 9;
  });

  // Footer Cover Page
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'YuvaSetu  •  Samajh Se Safalta Tak  •  Downloaded for Personal Academic Revision',
    margin,
    pageHeight - 10
  );

  // === SUBSEQUENT PAGES ===
  pages.forEach((p, index) => {
    doc.addPage();

    // Draw Middle Center Watermark for this page (behind text & content)
    drawPageMiddleWatermark(doc, pageWidth, pageHeight);

    // Top Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 22, 'F');

    // Mini Logo Crest in header
    try {
      doc.addImage(
        YUVASETU_WATERMARK_LOGO_BASE64,
        'PNG',
        margin,
        3.5,
        14,
        14,
        'YUVASETU_WATERMARK_LOGO',
        'FAST'
      );
    } catch {
      // fallback
    }

    doc.setTextColor(34, 211, 238);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('YuvaSetu', margin + 17, 11.5);

    doc.setTextColor(203, 213, 225);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`•  ${content.subject_name}  •  ${content.topic || content.title}`, margin + 41, 11.5);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`Page ${p.pageNumber || index + 1} of ${pages.length}`, pageWidth - margin - 22, 11);

    let pageY = 32;

    // Heading
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const heading = p.heading || p.title || `Topic Notes — Part ${index + 1}`;
    const headingLines = doc.splitTextToSize(heading, contentWidth);
    doc.text(headingLines, margin, pageY);
    pageY += headingLines.length * 6 + 4;

    // Content body
    if (p.content) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const textLines = doc.splitTextToSize(p.content, contentWidth);
      doc.text(textLines, margin, pageY);
      pageY += textLines.length * 5.2 + 6;
    }

    // Key points
    const points = p.keyPoints || p.contentNotes;
    if (points && points.length > 0 && pageY < pageHeight - 65) {
      doc.setFillColor(240, 253, 250);
      doc.setDrawColor(153, 246, 228);
      const pointsBoxHeight = Math.min(50, points.length * 6.5 + 8);
      doc.roundedRect(margin, pageY, contentWidth, pointsBoxHeight, 2, 2, 'FD');

      doc.setTextColor(13, 148, 136);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('KEY TAKEAWAYS & CORE CONCEPTS:', margin + 4, pageY + 6);

      let ptY = pageY + 12;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      points.slice(0, 5).forEach((pt) => {
        doc.text(`• ${pt}`, margin + 6, ptY);
        ptY += 6;
      });

      pageY += pointsBoxHeight + 6;
    }

    // Code Snippet or Diagram
    const diagram = p.diagramText || p.diagramAscii;
    if (diagram && pageY < pageHeight - 50) {
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, pageY, contentWidth, 24, 2, 2, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(52, 211, 153);
      const diagLines = doc.splitTextToSize(diagram, contentWidth - 8);
      doc.text(diagLines.slice(0, 3), margin + 4, pageY + 7);
      pageY += 28;
    }

    // Formulas
    if (p.keyFormulas && p.keyFormulas.length > 0 && pageY < pageHeight - 45) {
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(margin, pageY, contentWidth, 14, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(180, 83, 9);
      doc.text('EXAM FORMULAS: ' + p.keyFormulas.join('  |  '), margin + 4, pageY + 9);
      pageY += 18;
    }

    // Exam Tips
    if (p.examTips && pageY < pageHeight - 35) {
      doc.setFillColor(238, 242, 255);
      doc.roundedRect(margin, pageY, contentWidth, 14, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(67, 56, 202);
      doc.text('EXAM & INTERVIEW TIP: ' + p.examTips, margin + 4, pageY + 9);
    }

    // Footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `YuvaSetu  •  Samajh Se Safalta Tak  •  Page ${p.pageNumber || index + 1} of ${pages.length}`,
      margin,
      pageHeight - 10
    );
  });

  // Save to disk (PC or Mobile)
  doc.save(downloadName);
}

/**
 * Generates a Word-compatible .doc / .docx formatted file and triggers download
 */
export function generateAndDownloadDocx(content: ContentItem, fileName?: string): void {
  const pages = synthesizePagesForContent(content);
  const downloadName =
    fileName ||
    content.pdf_data?.fileName?.replace(/\.pdf$/i, '.docx') ||
    `${content.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_YuvaSetu.docx`;

  const htmlDoc = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>${content.title}</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 20px; position: relative; }
      .watermark-center {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-30deg);
        -webkit-transform: translate(-50%, -50%) rotate(-30deg);
        opacity: 0.12;
        filter: alpha(opacity=12);
        text-align: center;
        z-index: -1;
        pointer-events: none;
        width: 100%;
      }
      .watermark-title {
        font-size: 60pt;
        font-weight: 900;
        color: #64748b;
        letter-spacing: 6pt;
        text-transform: uppercase;
        margin: 0;
      }
      .watermark-subtitle {
        font-size: 15pt;
        font-weight: bold;
        color: #0284c7;
        letter-spacing: 2pt;
        margin-top: 6pt;
      }
      .watermark-tag {
        font-size: 10pt;
        color: #94a3b8;
        letter-spacing: 1.5pt;
        margin-top: 6pt;
        font-weight: bold;
      }
      h1 { color: #0f172a; font-size: 24pt; margin-bottom: 4pt; border-bottom: 2pt solid #0284c7; padding-bottom: 6pt; }
      h2 { color: #0284c7; font-size: 16pt; margin-top: 18pt; margin-bottom: 6pt; }
      h3 { color: #334155; font-size: 13pt; margin-top: 12pt; }
      .brand { font-size: 14pt; font-weight: bold; color: #0ea5e9; text-transform: uppercase; }
      .tagline { color: #64748b; font-size: 10pt; font-style: italic; margin-bottom: 16pt; }
      .meta-box { background: #f1f5f9; padding: 12pt; border-radius: 6pt; margin-bottom: 16pt; }
      .key-points { background: #f0fdfa; border-left: 4pt solid #14b8a6; padding: 8pt 12pt; margin: 10pt 0; }
      .exam-tip { background: #eff6ff; border-left: 4pt solid #3b82f6; padding: 8pt 12pt; margin: 10pt 0; font-weight: bold; }
      .code-box { background: #0f172a; color: #38bdf8; padding: 10pt; font-family: Consolas, monospace; border-radius: 4pt; }
      .page-break { page-break-after: always; }
      footer { margin-top: 30pt; font-size: 9pt; color: #94a3b8; text-align: center; }
    </style>
  </head>
  <body>
    <!-- Center-Aligned Watermark at the Middle of Page -->
    <div class="watermark-center">
      <img src="${YUVASETU_WATERMARK_LOGO_BASE64}" width="200" height="200" style="opacity: 0.12; display: block; margin: 0 auto 10px auto;" />
      <div class="watermark-title">YuvaSetu</div>
      <div class="watermark-subtitle">Samajh Se Safalta Tak • Verified Learning Material</div>
      <div class="watermark-tag">★ OFFICIAL STUDY MATERIAL ★ NOT FOR RESALE ★</div>
    </div>

    <div class="brand">YuvaSetu</div>
    <div class="tagline">Samajh Se Safalta Tak — Verified Academic Learning Platform</div>

    <h1>${content.title}</h1>
    <div class="meta-box">
      <strong>Subject:</strong> ${content.subject_name} | <strong>Topic:</strong> ${content.topic || content.title}<br/>
      <strong>Publisher:</strong> ${content.creator.name} (${content.creator.college || 'YuvaSetu Academic Lead'})<br/>
      <strong>Pages:</strong> ${pages.length} Pages | <strong>Format:</strong> Microsoft Word / Structured Document
    </div>

    <h2>Overview & Syllabus Scope</h2>
    <p>${content.description}</p>

    <div class="page-break"></div>

    ${pages
      .map(
        (p, idx) => `
      <h2>Page ${p.pageNumber || idx + 1}: ${p.heading || p.title}</h2>
      ${p.content ? `<p>${p.content.replace(/\n/g, '<br/>')}</p>` : ''}

      ${
        p.keyPoints && p.keyPoints.length > 0
          ? `
        <div class="key-points">
          <strong>Key Concepts & Takeaways:</strong>
          <ul>
            ${p.keyPoints.map((pt) => `<li>${pt}</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }

      ${
        p.diagramText || p.diagramAscii
          ? `
        <div class="code-box">
          <pre>${p.diagramText || p.diagramAscii}</pre>
        </div>
      `
          : ''
      }

      ${
        p.codeSnippet
          ? `
        <div class="code-box">
          <pre>${p.codeSnippet}</pre>
        </div>
      `
          : ''
      }

      ${
        p.examTips
          ? `
        <div class="exam-tip">
          Exam & Interview Tip: ${p.examTips}
        </div>
      `
          : ''
      }

      <div class="page-break"></div>
    `
      )
      .join('')}

    <footer>
      YuvaSetu  •  Samajh Se Safalta Tak  •  Free Academic Handout
    </footer>
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff', htmlDoc], {
    type: 'application/msword',
  });
  triggerBrowserDownload(blob, downloadName);
}

/**
 * Triggers raw file download if user specifically requests original uploaded file
 */
export function downloadRawUploadedFile(content: ContentItem): boolean {
  if (content.pdf_data?.fileDataUrl) {
    const fileName = content.pdf_data?.fileName || `${content.title.replace(/\s+/g, '_')}.pdf`;
    triggerBrowserDownload(content.pdf_data.fileDataUrl, fileName);
    return true;
  }
  return false;
}

/**
 * Master download function that handles PDF, DOCX, or direct file download.
 * Guarantees that every page of downloaded PDF and Word documents contains
 * the official YuvaSetu watermark positioned precisely at the middle, aligned center.
 */
export function downloadContentItem(
  content: ContentItem,
  format: 'pdf' | 'docx' | 'txt' | 'auto' = 'auto'
): void {
  const baseName = (content.pdf_data?.fileName || `${content.title}`).replace(/\.[^/.]+$/, '');
  const cleanBaseName = baseName.replace(/[^a-zA-Z0-9_\- ]/g, '_').trim() || 'YuvaSetu_Study_Material';

  // 1. If explicitly DOCX or file is docx
  if (format === 'docx' || (format === 'auto' && content.pdf_data?.fileName?.toLowerCase().endsWith('.docx'))) {
    generateAndDownloadDocx(content, `${cleanBaseName}_YuvaSetu.docx`);
    return;
  }

  // 2. Default & PDF download: Always generate the official document with the middle-aligned center watermark on every page
  generateAndDownloadPdf(content, `${cleanBaseName}_YuvaSetu.pdf`);
}
