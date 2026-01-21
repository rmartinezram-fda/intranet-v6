import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarAnexoII = (datos: any) => {
  const doc = new jsPDF();
  const hoy = new Date();

  // Helper para validar datos: Si no existe o está vacío, pone línea de puntos
  const check = (valor: any) => (valor && valor !== "" ? valor : "_____________________________");

  // --- CONFIGURACIÓN DE DATOS ---
  // Usamos la función 'check' para garantizar que nunca salgan huecos en blanco
  const representante = check(datos.representante);
  const direccion = check(datos.situacion); // Asumo que 'situacion' es la dirección
  const localidad = datos.localidad || "Zaragoza"; // Valor por defecto del documento
  const nombreAlumno = check(datos.alumno); 
  const centroEducativo = check(datos.centro);
  const nSerie = datos.n_serie || "________________";

  // --- FUNCIÓN CABECERA (Se repite en ambas páginas) ---
  const pintarEncabezado = () => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("GOBIERNO DE ARAGON", 20, 15);
    doc.setFont("helvetica", "normal");
    doc.text("Departamento de Educación, Cultura y Deporte", 20, 20);
  };

  // ================= PÁGINA 1 =================
  pintarEncabezado();

  // Título
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const titulo = "ANEXO II ACEPTACIÓN DEL 'PUESTO EDUCATIVO EN EL HOGAR' DERIVADO DEL PROGRAMA 'EDUCA EN DIGITAL' Y DECLARACIÓN RESPONSABLE SOBRE SU USO Y CONSERVACIÓN.";
  doc.text(titulo, 20, 30, { maxWidth: 170 });

  // Cuerpo del texto
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  // Nota: Ajustamos el texto para que fluya natural con los datos
  const textoAceptacion = `D/Dña. ${representante}, con domicilio en la siguiente dirección postal ${direccion}, de ${localidad}, como representante legal de ${nombreAlumno}, matriculado en el centro ${centroEducativo}, acepto el préstamo temporal del "puesto educativo en el hogar" que se identifica en este documento.`;
  
  doc.text(textoAceptacion, 20, 50, { maxWidth: 170, align: 'justify', lineHeightFactor: 1.5 });

  // Tabla
  doc.text("Los componentes recibidos en préstamo son los que constan en la siguiente tabla:", 20, 80);
  
  autoTable(doc, {
    startY: 85,
    head: [['Componentes recibidos en préstamo', 'Nº serie / ICC', 'Si', 'No']],
    body: [
      ['Equipo informático (portátil/convertible)', nSerie, 'X', ''],
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [255, 255, 255], // Fondo blanco como el original
      textColor: [0, 0, 0],       // Texto negro
      fontStyle: 'bold',
      lineWidth: 0.1,             // Bordes finos
      lineColor: [0, 0, 0]
    },
    styles: { 
      fontSize: 10,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 90 }, // Columna ancha para descripción
      1: { cellWidth: 40, halign: 'center' }, // Serie
      2: { cellWidth: 20, halign: 'center' }, // Si
      3: { cellWidth: 20, halign: 'center' }  // No
    }
  });

  // Cláusulas Página 1
  let yPos = (doc as any).lastAutoTable.finalY + 15;
  
  const clausulasP1 = [
    "• Declaro que el centro docente nos ha entregado el \"puesto educativo en el hogar\" así como copia del documento titulado \"Anexo I\".",
    "• Declaro que entiendo las normas de uso, asistencia técnica y correcta conservación del \"Puesto educativo en el hogar\" y nos comprometemos a cumplirlas hasta la devolución, incluida la caja.",
    "• Así mismo, declaro que, en caso de deterioro, pérdida o robo, nos comprometemos a informar al centro docente en el plazo máximo de 48 horas mediante correo electrónico."
  ];

  clausulasP1.forEach(txt => {
    const lines = doc.splitTextToSize(txt, 170);
    // Verificamos si cabe en la página, si no, salto forzado (aunque aquí forzamos página 2 siempre)
    doc.text(lines, 20, yPos);
    yPos += (lines.length * 5) + 4; // Espaciado entre párrafos
  });

  // ================= PÁGINA 2 =================
  doc.addPage(); 
  pintarEncabezado();

  // Cláusula final y Fechas
  doc.setFontSize(10);
  const clausulaFinal = "• Finalmente, declaro que me comprometo a devolver en perfecto estado de conservación y funcionamiento todos los componentes del \"puesto educativo en el hogar\", en sus cajas de embalaje, cuando así lo indique el centro.";
  doc.text(doc.splitTextToSize(clausulaFinal, 170), 20, 40);

  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const fechaTexto = `En ${localidad}, a ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}.`;
  doc.text(fechaTexto, 20, 65);
  
  // Firmas
  const yFirmas = 90;
  doc.text("El director/directora del centro docente.", 30, yFirmas);
  doc.setFont("helvetica", "bold");
  doc.text("Francisco Luis Alda Bueno", 30, yFirmas + 15);
  
  doc.setFont("helvetica", "normal");
  doc.text("El responsable legal", 120, yFirmas);
  // Firma del padre (placeholder si quieres)
  // doc.text("Fdo: ____________________", 120, yFirmas + 15);

  // Pie legal
  doc.setFontSize(8);
  const legal = "El responsable del tratamiento es la Dirección General de Planificación y Equidad del Departamento de Educación, Cultura y Deporte del Gobierno de Aragón. La finalidad de este tratamiento es la gestión de procedimientos de escolarización. La legitimación para realizar el tratamiento nos la da el cumplimiento de una obligación legal. No vamos a comunicar tus datos personales a terceros salvo obligación legal. Podrás ejercer tus derechos de acceso, rectificación, supresión y portabilidad a través de la sede electrónica de la Administración de la Comunidad Autónoma de Aragón.";
  
  doc.text(legal, 20, 250, { maxWidth: 170, align: 'justify' });
  
  doc.setTextColor(0, 0, 255); // Azul para el link
  doc.textWithLink("Más información en: http://aplicaciones.aragon.es/notif_lopd_pub/details.action?fileId=59", 20, 275, { url: "http://aplicaciones.aragon.es/notif_lopd_pub/details.action?fileId=59" });
  doc.setTextColor(0, 0, 0); // Volver a negro

  doc.save(`AnexoII_${nSerie}.pdf`);
};