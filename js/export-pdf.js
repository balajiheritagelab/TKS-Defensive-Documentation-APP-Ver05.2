function exportPDF(record) {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("TKS Defensive Documentation Report", 10, 10);

  doc.setFontSize(12);
  doc.text(`Craft: ${record.craft.name}`, 10, 20);
  doc.text(`Domain: ${record.ontology.domain}`, 10, 30);
  doc.text(`Function: ${record.ontology.function}`, 10, 40);

  let y = 50;

  record.process_steps.forEach(step => {
    doc.text(`Step ${step.step_no}: ${step.description}`, 10, y);
    y += 10;

    if (step.image) {
      doc.addImage(step.image, 'JPEG', 10, y, 60, 40);
      y += 50;
    }
  });

  y += 10;
  doc.text(`Hash: ${record.record_hash}`, 10, y);

  doc.save(`TKS_${record.uuid}.pdf`);
}