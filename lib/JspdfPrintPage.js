
export const jsPDFPrintOnePage = ({ doc }, data, colsObject, margin) => {
    let y = margin;
    data.forEach(element => {
        colsObject.forEach(item => {
            doc.text(`${element[item.fld]}`, item.pos, y, item.aln);
        })
        y += 5;
    });

}

export const jsPDFPrintMultiPage = ({ doc }, data, colsObject, margin, linePerPage) => {
    let y = margin;
    data.forEach((element, i) => {
        colsObject.forEach(item => {
            doc.text(`${element[item.fld]}`, item.pos, y, item.aln);
        })
        y += 5;
        if ((i + 1) % linePerPage === 0) {
            if (i !== data.length - 1) {
                doc.addPage();
                y = margin;
            }
        }
    });
}
