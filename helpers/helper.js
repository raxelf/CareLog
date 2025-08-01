const { jsPDF } = require('jspdf');
const { autoTable, applyPlugin } = require('jspdf-autotable');

const getGreetingStatus = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) {
        return "Selamat Pagi";
    } else if (hour >= 11 && hour < 15) {
        return "Selamat Siang";
    } else if (hour >= 15 && hour < 18) {
        return "Selamat Sore";
    } else {
        return "Selamat Malam";
    }
}

const getFormattedDateTime = (date) => {
    const d = new Date(date);
    
    const tanggal = d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const jam = d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return `${tanggal} - ${jam}`;
}

const getFormattedDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}
const getFormmatedDateForInputDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const printEmrPdf = (patientProfile, doctorProfile, prescriptions, medicalRecord) => {
    applyPlugin(jsPDF);

    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(11, 44, 70);
    doc.text("CareLog", 15, 15);
    
    doc.setFontSize(14);
    doc.setTextColor(11, 44, 70);
    doc.text("Rekam Medis", 195, 15, { align: "right" });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(15, 20, 195, 20);
    
    // Nama Pasien & No. Rekam Medis
    doc.setFontSize(24);
    doc.setTextColor(11, 44, 70);
    doc.text(patientProfile.name, 15, 40);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`No. Rekam Medis:`, 15, 50);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 44, 70);
    doc.text(`${medicalRecord.emrCode}`, 15, 57);
    
    // Identitas Pasien
    let y = 70;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 44, 70);
    doc.text("Identitas Pasien", 15, y);
    
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Jenis Kelamin`, 15, y);
    doc.text(`: ${patientProfile.gender}`, 60, y);
    
    y += 7;
    doc.text(`Tanggal Lahir`, 15, y);
    doc.text(`: ${new Date(patientProfile.birthOfDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 60, y);
    
    y += 7;
    doc.text(`Nomor Telepon`, 15, y);
    doc.text(`: ${patientProfile.phoneNumber}`, 60, y);
    
    y += 7;
    doc.text(`Alamat`, 15, y);
    doc.text(`:`, 60, y);
    y += 7;
    doc.text(`${patientProfile.address}`, 15, y);

    // Anamnesis
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 44, 70);
    doc.text("Anamnesis", 15, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Keluhan Utama", 15, y);
    doc.text(`:`, 60, y);

    y += 7;
    doc.text(medicalRecord.anamnesis || '-', 15, y);

    // Diagnosis
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 44, 70);
    doc.text("Diagnosis", 15, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(medicalRecord.diagnosis || '-', 15, y);

    // Resep
    const prescriptionDetails = prescriptions?.prescriptionDetails || [];
    if (prescriptionDetails.length > 0) {
        y += 15;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(11, 44, 70);
        doc.text("Resep", 15, y);
        
        doc.autoTable({
            startY: y + 5,
            head: [["No.", "Nama Obat", "Dosis", "Jumlah", "Satuan", "Instruksi"]],
            body: prescriptionDetails.map((p, i) => [
                `${i + 1}.`,
                p.Medicine?.name || "-",
                p.Medicine.dosage || "-",
                p.quantity || "-",
                p.Medicine.unit || "-",
                p.instruction || "-"
            ]),
            styles: {
                fontSize: 10,
                halign: 'center'
            },
            headStyles: {
                fillColor: [52, 73, 94],
                textColor: [255, 255, 255],
                halign: 'center'
            },
            columnStyles: {
                1: { halign: 'center' }, // Nama Obat
                5: { halign: 'center' }, // Instruksi
            }
        });
    }

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : y + 30;

    // Catatan Dokter
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 44, 70);
    doc.text("Catatan Dokter", 15, finalY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(11);
    doc.text(medicalRecord.doctorNotes || "-", 15, finalY + 7);

    // Info Dokter Pemeriksa
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text("Dokter Pemeriksa", 15, finalY + 20);
    doc.text(`: dr. ${doctorProfile.name} - ${doctorProfile.specialization}`, 60, finalY + 20);

    doc.text("Tanggal Pemeriksaan", 15, finalY + 27);
    doc.text(`: ${new Date(medicalRecord.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 60, finalY + 27);

    // Output PDF
    const pdfOutput = doc.output("arraybuffer");

    return pdfOutput;
}

const printPrescriptionPdf = (patientProfile, doctorProfile, prescriptions, medicalRecord) => {
    applyPlugin(jsPDF);
    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(11, 44, 70);
    doc.text("CareLog", 15, 15);

    doc.setFontSize(14);
    doc.text("Resep Obat", 195, 15, { align: "right" });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(15, 20, 195, 20);

    // Nama Pasien
    doc.setFontSize(22);
    doc.setTextColor(11, 44, 70);
    doc.text(patientProfile.name || "-", 15, 35);

    // Dokter & Tanggal Resep
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Dokter", 15, 43);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 44, 70);
    doc.text(`dr. ${doctorProfile.name || "-" } - ${doctorProfile.specialization || "-"}`, 15, 48);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Tanggal Resep", 15, 55);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 44, 70);
    doc.text(`${prescriptions.formmatedDate || "-"}`, 15, 60);

    // No Resep
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("No. Resep Obat", 15, 67);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 44, 70);
    doc.text(`${prescriptions.prescriptionCode || "-"}`, 15, 72);

    // Judul Tabel
    let y = 85;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(11, 44, 70);
    doc.text("Daftar Obat", 15, y);

    // Data Resep
    const prescriptionDetails = prescriptions?.prescriptionDetails || [];
    if (prescriptionDetails.length > 0) {
        doc.autoTable({
            startY: y + 5,
            head: [["No.", "Nama Obat", "Dosis", "Jumlah", "Satuan", "Instruksi"]],
            body: prescriptionDetails.map((p, i) => [
                `${i + 1}.`,
                p.Medicine?.name || "-",
                p.Medicine?.dosage || "-",
                p.quantity || "-",
                p.Medicine?.unit || "-",
                p.instruction || "-"
            ]),
            styles: {
                fontSize: 10,
                cellPadding: 2,
                valign: 'middle',
                halign: 'center',
            },
            headStyles: {
                fillColor: [52, 73, 94],
                textColor: [255, 255, 255],
            },
            columnStyles: {
                1: { halign: 'center' },
                5: { halign: 'center' }
            }
        });
    }

    // Catatan
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : y + 40;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(11, 44, 70);
    doc.text("Catatan", 15, finalY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text("Harap mengikuti instruksi pemakaian sesuai petunjuk dokter.", 15, finalY + 7);

    return doc.output("arraybuffer");
};

module.exports = {
    getGreetingStatus,
    getFormattedDateTime,
    getFormattedDate,
    getFormmatedDateForInputDate,
    printEmrPdf,
    printPrescriptionPdf
}