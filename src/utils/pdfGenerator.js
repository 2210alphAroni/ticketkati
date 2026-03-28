import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateTicketPDF = (ticketData) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const {
    user,
    bus,
    fromPlace,
    toPlace,
    journeyDate,
    journeyTime,
    seats,
    totalAmount,
    paymentMethod,
    transactionId,
    bookingId,
    bookedAt,
  } = ticketData;

  // Colors
  const RED = [232, 36, 42];
  const DARK = [13, 13, 13];
  const LIGHT_BG = [245, 245, 245];

  // Header background
  doc.setFillColor(...RED);
  doc.rect(0, 0, 210, 45, 'F');

  // App name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.text('TicketKati', 20, 22);

  // Tagline
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 200, 200);
  doc.text('Bangladesh Bus Ticket System', 20, 32);

  // Booking ID top right
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Booking ID: ${bookingId}`, 210 - 20, 22, { align: 'right' });
  doc.text(`Issued: ${new Date(bookedAt).toLocaleString('en-BD')}`, 210 - 20, 30, { align: 'right' });

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(15, 50, 195, 50);

  // Journey Section Title
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text('JOURNEY DETAILS', 15, 60);

  // Route Visual
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...RED);
  doc.text(fromPlace?.name?.toUpperCase() || 'FROM', 15, 75);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('→  →  →  →  →  →  →', 70, 75);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text(toPlace?.name?.toUpperCase() || 'TO', 155, 75);

  // Route details table
  autoTable(doc, {
    startY: 85,
    head: [['Bus Name', 'Type', 'Journey Date', 'Departure Time', 'Seats']],
    body: [[
      bus?.name || '-',
      bus?.type || '-',
      journeyDate || '-',
      journeyTime || '-',
      seats?.join(', ') || '-',
    ]],
    styles: {
      fontSize: 10,
      cellPadding: 5,
      textColor: DARK,
    },
    headStyles: {
      fillColor: DARK,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: LIGHT_BG },
    margin: { left: 15, right: 15 },
  });

  const afterTable = doc.lastAutoTable.finalY + 10;

  // Passenger Info
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text('PASSENGER INFORMATION', 15, afterTable);

  autoTable(doc, {
    startY: afterTable + 5,
    body: [
      ['Full Name', user?.name || '-'],
      ['Email', user?.email || '-'],
      ['Phone', user?.phone || '-'],
    ],
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: LIGHT_BG, textColor: [80, 80, 80], cellWidth: 50 },
      1: { textColor: DARK },
    },
    margin: { left: 15, right: 15 },
  });

  const afterPassenger = doc.lastAutoTable.finalY + 10;

  // Payment Info
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text('PAYMENT INFORMATION', 15, afterPassenger);

  autoTable(doc, {
    startY: afterPassenger + 5,
    body: [
      ['Payment Method', paymentMethod?.name || '-'],
      ['Transaction ID', transactionId || '-'],
      ['Total Paid', `BDT ${totalAmount?.toLocaleString() || '0'} /-`],
      ['Payment Status', 'CONFIRMED ✓'],
    ],
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: LIGHT_BG, textColor: [80, 80, 80], cellWidth: 50 },
      1: { textColor: DARK },
    },
    margin: { left: 15, right: 15 },
  });

  const afterPayment = doc.lastAutoTable.finalY + 15;

  // Instructions box
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(15, afterPayment, 180, 40, 4, 4, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...RED);
  doc.text('IMPORTANT INSTRUCTIONS', 20, afterPayment + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('• Please arrive at the terminal at least 30 minutes before departure.', 20, afterPayment + 16);
  doc.text('• Carry a valid National ID card or passport for verification.', 20, afterPayment + 22);
  doc.text('• This ticket is non-refundable within 2 hours of departure.', 20, afterPayment + 28);
  doc.text('• Contact: support@ticketkati.com | Hotline: 16XXX', 20, afterPayment + 34);

  // Footer
  doc.setFillColor(...DARK);
  doc.rect(0, 277, 210, 20, 'F');
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('TicketKati © 2024 | Bangladesh Bus Ticket System | www.ticketkati.com', 105, 288, { align: 'center' });

  // Save
  doc.save(`TicketKati_${bookingId}.pdf`);
};
