const printHeader = ({ doc }, dataFormat, margin) => {
    doc.setFont("times", "bold");
    dataFormat.forEach(item => {
        doc.text(
            `${item.head}`, // Dynamic field value
            item.pos,              // X-position
            margin,                // Y-position
            item.aln               // Alignment
        );
    });
    doc.setFont("times", "normal");
}


// Function to print the first page
export const jsPDFPrintFirstPage = ({ doc }, data, dataFormat, margin) => {
    printHeader({ doc }, dataFormat, margin);
    let y = margin + 5
    doc.setFont("times", "normal");
    data.forEach(element => {
        dataFormat.forEach(item => {
            doc.text(
                `${element[item.fld]}`, // Dynamic field value
                item.pos,              // X-position
                y,                // Y-position
                item.aln               // Alignment
            );
        });
        y += 5; // Increment margin for next row
    });
};

// Function to print subsequent pages
export const jsPDFPrintOtherPage = ({ doc }, data, dataFormat, margin, linesPerPage) => {
    printHeader({ doc }, dataFormat, margin);
    let currentY = margin + 5;
    doc.setFont("times", "normal");
    data.forEach((element, index) => {
        dataFormat.forEach(item => {
            doc.text(
                `${element[item.fld]}`,
                item.pos,
                currentY,
                item.aln
            );
        });

        currentY += 5; // Increment for next row

        // Check if the current page limit is reached
        if ((index + 1) % linesPerPage === 0) {
            doc.addPage(); // Add a new page
            printHeader({ doc }, dataFormat, margin);
            currentY = margin + 5; // Reset Y-position for new page
        }
    });

    // Remove the last empty page if it was added unnecessarily
    const totalPages = doc.internal.getNumberOfPages();
    const remainingLines = data.length % linesPerPage;
    if (remainingLines === 0) {
        doc.deletePage(totalPages);
    }
};
