import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


// ======================================================
// MONEY FORMAT
// ======================================================

const money = (value) => {

    const number =
        Number(value || 0);

    return number.toLocaleString(
        "en-PK",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

};


// ======================================================
// DATE FORMAT
// ======================================================

const prettyDate = (value) => {

    if (!value) {
        return "";
    }

    const datePart =
        String(value).substring(
            0,
            10
        );

    const [
        year,
        month,
        day
    ] = datePart.split("-");

    return `${day}/${month}/${year}`;

};


// ======================================================
// STATEMENT TITLE
// ======================================================

const getStatementTitle = (type) => {

    if (type === "in") {
        return "Donation Statement";
    }

    if (type === "out") {
        return "Expenses Statement";
    }

    return "Complete Statement";

};


// ======================================================
// FILE NAME
// ======================================================

const getFileName = (type) => {

    if (type === "in") {
        return "Donation_Statement";
    }

    if (type === "out") {
        return "Expenses_Statement";
    }

    return "Complete_Statement";

};


// ======================================================
// TABLE POSITION CONSTANTS
// ======================================================
//
// Landscape A4 = approximately 297mm wide.
//
// Left margin  = 14
// Right margin = 14
//
// Available table width = 269mm
//
// Date       28
// Name       52
// Details    90
// Credit     32
// Debit      32
// Balance    35
//
// Total = 269
// ======================================================

const TABLE = {

    left: 14,

    dateWidth: 28,

    nameWidth: 52,

    detailsWidth: 90,

    creditWidth: 32,

    debitWidth: 32,

    balanceWidth: 35

};


const getColumnPositions = () => {

    const dateX =
        TABLE.left;

    const nameX =
        dateX +
        TABLE.dateWidth;

    const detailsX =
        nameX +
        TABLE.nameWidth;

    const creditX =
        detailsX +
        TABLE.detailsWidth;

    const debitX =
        creditX +
        TABLE.creditWidth;

    const balanceX =
        debitX +
        TABLE.debitWidth;


    return {

        dateX,

        nameX,

        detailsX,

        creditX,

        debitX,

        balanceX,

        tableEnd:
            balanceX +
            TABLE.balanceWidth

    };

};


// ======================================================
// DRAW PAGE TOTAL
// ======================================================

const drawPageTotal = (
    doc,
    pageTotal,
    isLastPage
) => {

    const pageHeight =
        doc.internal.pageSize.getHeight();

    const {
        detailsX,
        creditX,
        debitX,
        balanceX
    } = getColumnPositions();


    /*
        Last page needs room for:
        Page Total
        Grand Total
        Footer
    */

    const y =
        isLastPage
            ? pageHeight - 20
            : pageHeight - 13;


    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(8);


    // PAGE TOTAL LABEL

    doc.text(
        "Page Total",
        creditX - 3,
        y,
        {
            align: "right"
        }
    );


    // CREDIT

    doc.text(
        money(
            pageTotal.credit
        ),
        creditX +
            TABLE.creditWidth -
            2,
        y,
        {
            align: "right"
        }
    );


    // DEBIT

    doc.text(
        money(
            pageTotal.debit
        ),
        debitX +
            TABLE.debitWidth -
            2,
        y,
        {
            align: "right"
        }
    );


    // BALANCE

    doc.text(
        money(
            pageTotal.balance
        ),
        balanceX +
            TABLE.balanceWidth -
            2,
        y,
        {
            align: "right"
        }
    );

};


// ======================================================
// GRAND TOTAL
// ======================================================

const drawGrandTotal = (
    doc,
    totals
) => {

    const pageHeight =
        doc.internal.pageSize.getHeight();


    const {
        creditX,
        debitX,
        balanceX
    } = getColumnPositions();


    const y =
        pageHeight - 13;


    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(8.5);


    doc.text(
        "Grand Total",
        creditX - 3,
        y,
        {
            align: "right"
        }
    );


    doc.text(
        money(
            totals.credit
        ),
        creditX +
            TABLE.creditWidth -
            2,
        y,
        {
            align: "right"
        }
    );


    doc.text(
        money(
            totals.debit
        ),
        debitX +
            TABLE.debitWidth -
            2,
        y,
        {
            align: "right"
        }
    );


    doc.text(
        money(
            totals.balance
        ),
        balanceX +
            TABLE.balanceWidth -
            2,
        y,
        {
            align: "right"
        }
    );

};


// ======================================================
// FOOTER
// ======================================================

const drawFooter = (
    doc,
    pageNumber,
    totalPages
) => {

    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(7);


    doc.text(
        "AFBROS Finance System",
        14,
        pageHeight - 5
    );


    doc.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageWidth - 14,
        pageHeight - 5,
        {
            align: "right"
        }
    );

};


// ======================================================
// GENERATE PDF
// ======================================================

const generateStatementPdf = (
    report
) => {

    const {
        type,
        range,
        totals,
        records
    } = report;


    const doc =
        new jsPDF({

            orientation:
                "landscape",

            unit:
                "mm",

            format:
                "a4"

        });


    // ==================================================
    // PDF HEADER
    // ==================================================

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(19);

    doc.text(
        "AFBROS Finance System",
        14,
        15
    );


    doc.setFontSize(14);

    doc.text(
        getStatementTitle(type),
        14,
        23
    );


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(9);


    const rangeText =
        range.complete
            ? "Statement Period: Beginning of records to today"
            : `Statement Period: ${prettyDate(
                range.from
            )} to ${prettyDate(
                range.to
            )}`;


    doc.text(
        rangeText,
        14,
        30
    );


    doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        14,
        35
    );


    // ==================================================
    // BUILD TABLE RECORDS
    // ==================================================

    let runningBalance =
        0;


    const body =
        records.map(
            (record) => {

                const amount =
                    Number(
                        record.amount ||
                        0
                    );


                const isCredit =
                    record.transaction_type ===
                    "IN";


                const credit =
                    isCredit
                        ? amount
                        : 0;


                const debit =
                    isCredit
                        ? 0
                        : amount;


                runningBalance +=
                    credit - debit;


                return {

                    date:
                        prettyDate(
                            record.record_date
                        ),

                    name:
                        record.full_name ||
                        "—",

                    details:
                        record.details ||
                        "—",

                    credit:
                        credit > 0
                            ? money(credit)
                            : "—",

                    debit:
                        debit > 0
                            ? money(debit)
                            : "—",

                    balance:
                        money(
                            runningBalance
                        ),


                    /*
                        Used internally for
                        calculating page totals.
                    */

                    _credit:
                        credit,

                    _debit:
                        debit

                };

            }
        );


    // ==================================================
    // PAGE TOTAL STORAGE
    // ==================================================

    const pageTotals =
        {};


    // ==================================================
    // GENERATE TABLE
    // ==================================================

    autoTable(
        doc,
        {

            startY:
                42,


            margin: {

                top: 15,

                left: 14,

                right: 14,

                /*
                    Reserve enough room for
                    page totals / grand total.
                */

                bottom: 29

            },


            rowPageBreak:
                "avoid",


            columns: [

                {
                    header:
                        "Date",

                    dataKey:
                        "date"
                },

                {
                    header:
                        "Name",

                    dataKey:
                        "name"
                },

                {
                    header:
                        type === "in"
                            ? "Phone"
                            : type === "out"
                                ? "Description"
                                : "Details",

                    dataKey:
                        "details"
                },

                {
                    header:
                        "Credit",

                    dataKey:
                        "credit"
                },

                {
                    header:
                        "Debit",

                    dataKey:
                        "debit"
                },

                {
                    header:
                        "Balance",

                    dataKey:
                        "balance"
                }

            ],


            body:
                body.length > 0
                    ? body
                    : [

                        {

                            date:
                                "No records found",

                            name:
                                "",

                            details:
                                "",

                            credit:
                                "",

                            debit:
                                "",

                            balance:
                                "",

                            _credit:
                                0,

                            _debit:
                                0

                        }

                    ],


            styles: {

                fontSize:
                    8.5,

                cellPadding:
                    2.8,

                lineColor:
                    [
                        229,
                        235,
                        231
                    ],

                lineWidth:
                    0.15

            },


            headStyles: {

                fontStyle:
                    "bold",

                halign:
                    "left"

            },


            columnStyles: {

                date: {

                    cellWidth:
                        TABLE.dateWidth

                },

                name: {

                    cellWidth:
                        TABLE.nameWidth

                },

                details: {

                    cellWidth:
                        TABLE.detailsWidth

                },

                credit: {

                    cellWidth:
                        TABLE.creditWidth,

                    halign:
                        "right"

                },

                debit: {

                    cellWidth:
                        TABLE.debitWidth,

                    halign:
                        "right"

                },

                balance: {

                    cellWidth:
                        TABLE.balanceWidth,

                    halign:
                        "right"

                }

            },


            // ==================================================
            // CALCULATE EACH PAGE TOTAL
            // ==================================================

            didDrawCell: (
                data
            ) => {

                if (
                    data.section !==
                    "body"
                ) {

                    return;

                }


                /*
                    Run exactly once for each row.
                    We use Balance column as marker.
                */

                if (
                    data.column.dataKey !==
                    "balance"
                ) {

                    return;

                }


                const pageNumber =
                    doc.internal
                        .getCurrentPageInfo()
                        .pageNumber;


                if (
                    !pageTotals[
                        pageNumber
                    ]
                ) {

                    pageTotals[
                        pageNumber
                    ] = {

                        credit:
                            0,

                        debit:
                            0,

                        balance:
                            0

                    };

                }


                const raw =
                    data.row.raw;


                pageTotals[
                    pageNumber
                ].credit +=
                    Number(
                        raw._credit ||
                        0
                    );


                pageTotals[
                    pageNumber
                ].debit +=
                    Number(
                        raw._debit ||
                        0
                    );


                pageTotals[
                    pageNumber
                ].balance =
                    pageTotals[
                        pageNumber
                    ].credit -
                    pageTotals[
                        pageNumber
                    ].debit;

            }

        }
    );


    // ==================================================
    // NUMBER OF PAGES
    // ==================================================

    const totalPages =
        doc.internal
            .getNumberOfPages();


    // ==================================================
    // DRAW TOTALS AFTER TABLE IS COMPLETE
    // ==================================================
    //
    // This avoids depending on AutoTable column
    // coordinates, which caused the jsPDF.line error.
    // ==================================================

    for (
        let pageNumber = 1;
        pageNumber <= totalPages;
        pageNumber++
    ) {

        doc.setPage(
            pageNumber
        );


        const pageTotal =
            pageTotals[
                pageNumber
            ] || {

                credit:
                    0,

                debit:
                    0,

                balance:
                    0

            };


        const isLastPage =
            pageNumber ===
            totalPages;


        drawPageTotal(
            doc,
            pageTotal,
            isLastPage
        );


        if (
            isLastPage
        ) {

            drawGrandTotal(
                doc,
                {

                    credit:
                        Number(
                            totals.totalIn ||
                            0
                        ),

                    debit:
                        Number(
                            totals.totalOut ||
                            0
                        ),

                    balance:
                        Number(
                            totals.totalIn ||
                            0
                        ) -
                        Number(
                            totals.totalOut ||
                            0
                        )

                }
            );

        }


        drawFooter(
            doc,
            pageNumber,
            totalPages
        );

    }


    // ==================================================
    // DOWNLOAD FILE
    // ==================================================

    const rangeName =
        range.complete
            ? "Complete"
            : `${range.from}_to_${range.to}`;


    doc.save(
        `AFBROS_${getFileName(
            type
        )}_${rangeName}.pdf`
    );

};


export default generateStatementPdf;