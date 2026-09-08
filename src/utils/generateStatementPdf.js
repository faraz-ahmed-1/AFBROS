import jsPDF
    from "jspdf";

import autoTable
    from "jspdf-autotable";


// ======================================================
// MONEY
// ======================================================

const money = (value) => {

    return Number(
        value || 0
    ).toLocaleString(
        "en-PK",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

};


// ======================================================
// DATE
// ======================================================

const prettyDate = (value) => {

    if (!value) {

        return "";

    }


    const datePart =
        String(value)
            .substring(
                0,
                10
            );


    const [
        year,
        month,
        day
    ] = datePart.split("-");


    return (
        `${day}/${month}/${year}`
    );

};


// ======================================================
// STATEMENT TITLE
// ======================================================

const getStatementTitle = (
    type
) => {

    if (
        type === "in"
    ) {

        return "Donation Statement";

    }


    if (
        type === "out"
    ) {

        return "Expenses Statement";

    }


    return "Complete Statement";

};


// ======================================================
// FILE NAME
// ======================================================

const getFileName = (
    type
) => {

    if (
        type === "in"
    ) {

        return "Donation_Statement";

    }


    if (
        type === "out"
    ) {

        return "Expenses_Statement";

    }


    return "Complete_Statement";

};


// ======================================================
// DRAW PAGE TOTALS
// ======================================================

const drawPageTotals = (
    doc,
    table,
    pageTotal
) => {

    if (
        !table ||
        !pageTotal
    ) {

        return;

    }


    const pageHeight =
        doc.internal
            .pageSize
            .getHeight();


    const columns =
        table.columns;


    const detailsColumn =
        columns.find(
            (column) =>
                column.dataKey ===
                "details"
        );


    const creditColumn =
        columns.find(
            (column) =>
                column.dataKey ===
                "credit"
        );


    const debitColumn =
        columns.find(
            (column) =>
                column.dataKey ===
                "debit"
        );


    const balanceColumn =
        columns.find(
            (column) =>
                column.dataKey ===
                "balance"
        );


    if (
        !creditColumn ||
        !debitColumn ||
        !balanceColumn
    ) {

        return;

    }


    const y =
        pageHeight - 20;


    doc.setDrawColor(
        210,
        218,
        213
    );


    doc.line(
        creditColumn.x,
        y - 4,
        balanceColumn.x +
            balanceColumn.width,
        y - 4
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(
        8
    );


    if (
        detailsColumn
    ) {

        doc.text(
            "Page Total",
            detailsColumn.x +
                detailsColumn.width -
                2,
            y,
            {
                align: "right"
            }
        );

    }


    doc.text(
        money(
            pageTotal.credit
        ),
        creditColumn.x +
            creditColumn.width -
            2,
        y,
        {
            align: "right"
        }
    );


    doc.text(
        money(
            pageTotal.debit
        ),
        debitColumn.x +
            debitColumn.width -
            2,
        y,
        {
            align: "right"
        }
    );


    doc.text(
        money(
            pageTotal.balance
        ),
        balanceColumn.x +
            balanceColumn.width -
            2,
        y,
        {
            align: "right"
        }
    );

};


// ======================================================
// DRAW GRAND TOTAL ON FINAL PAGE
// ======================================================

const drawGrandTotal = (
    doc,
    table,
    totals
) => {

    if (!table) {

        return;

    }


    const pageHeight =
        doc.internal
            .pageSize
            .getHeight();


    const columns =
        table.columns;


    const detailsColumn =
        columns.find(
            (column) =>
                column.dataKey ===
                "details"
        );


    const creditColumn =
        columns.find(
            (column) =>
                column.dataKey ===
                "credit"
        );


    const debitColumn =
        columns.find(
            (column) =>
                column.dataKey ===
                "debit"
        );


    const balanceColumn =
        columns.find(
            (column) =>
                column.dataKey ===
                "balance"
        );


    if (
        !creditColumn ||
        !debitColumn ||
        !balanceColumn
    ) {

        return;

    }


    const y =
        pageHeight - 13;


    doc.setDrawColor(
        170,
        183,
        176
    );


    doc.line(
        creditColumn.x,
        y - 4,
        balanceColumn.x +
            balanceColumn.width,
        y - 4
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(
        8.5
    );


    if (
        detailsColumn
    ) {

        doc.text(
            "Grand Total",
            detailsColumn.x +
                detailsColumn.width -
                2,
            y,
            {
                align: "right"
            }
        );

    }


    doc.text(
        money(
            totals.credit
        ),
        creditColumn.x +
            creditColumn.width -
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
        debitColumn.x +
            debitColumn.width -
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
        balanceColumn.x +
            balanceColumn.width -
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

const addFooter = (
    doc,
    pageNumber
) => {

    const pageWidth =
        doc.internal
            .pageSize
            .getWidth();


    const pageHeight =
        doc.internal
            .pageSize
            .getHeight();


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.setFontSize(
        7.5
    );


    doc.text(
        "AFBROS Finance System",
        14,
        pageHeight - 6
    );


    doc.text(
        `Page ${pageNumber}`,
        pageWidth - 14,
        pageHeight - 6,
        {
            align: "right"
        }
    );

};


// ======================================================
// PDF GENERATOR
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
    // HEADER
    // ==================================================

    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(
        19
    );


    doc.text(
        "AFBROS Finance System",
        14,
        15
    );


    doc.setFontSize(
        14
    );


    doc.text(
        getStatementTitle(
            type
        ),
        14,
        23
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.setFontSize(
        9
    );


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
    // BUILD TRANSACTIONS
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
                    credit -
                    debit;


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
                        credit
                            ? money(
                                credit
                            )
                            : "—",

                    debit:
                        debit
                            ? money(
                                debit
                            )
                            : "—",

                    balance:
                        money(
                            runningBalance
                        ),


                    // Hidden numeric values
                    // used only for page totals.

                    __credit:
                        credit,

                    __debit:
                        debit

                };

            }
        );


    // ==================================================
    // PAGE TOTAL TRACKING
    // ==================================================

    const pageTotals =
        {};


    autoTable(
        doc,
        {

            startY:
                42,


            margin: {

                top:
                    15,

                left:
                    14,

                right:
                    14,

                bottom:
                    28

            },


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
                body.length
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

                            __credit:
                                0,

                            __debit:
                                0

                        }

                    ],


            styles: {

                fontSize:
                    8.5,

                cellPadding:
                    2.8,

                lineColor:
                    [229, 235, 231],

                lineWidth:
                    .15

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
                        28

                },

                name: {

                    cellWidth:
                        52

                },

                details: {

                    cellWidth:
                        "auto"

                },

                credit: {

                    cellWidth:
                        32,

                    halign:
                        "right"

                },

                debit: {

                    cellWidth:
                        32,

                    halign:
                        "right"

                },

                balance: {

                    cellWidth:
                        35,

                    halign:
                        "right"

                }

            },


            // ==========================================
            // CALCULATE TOTAL OF RECORDS
            // ACTUALLY PRINTED ON EACH PAGE
            // ==========================================

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
                    Process once per row.
                    Balance column is used so the
                    same row is not counted 6 times.
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


                const row =
                    data.row.raw;


                pageTotals[
                    pageNumber
                ].credit +=
                    Number(
                        row.__credit ||
                        0
                    );


                pageTotals[
                    pageNumber
                ].debit +=
                    Number(
                        row.__debit ||
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

            },


            // ==========================================
            // EACH PAGE TOTAL
            // ==========================================

            didDrawPage: (
                data
            ) => {

                const pageNumber =
                    doc.internal
                        .getCurrentPageInfo()
                        .pageNumber;


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


                drawPageTotals(
                    doc,
                    data.table,
                    pageTotal
                );


                addFooter(
                    doc,
                    pageNumber
                );

            }

        }
    );


    // ==================================================
    // GRAND TOTAL
    // ONLY ON FINAL PDF PAGE
    // ==================================================

    const totalPages =
        doc.internal
            .getNumberOfPages();


    doc.setPage(
        totalPages
    );


    drawGrandTotal(
        doc,
        doc.lastAutoTable,
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


    // ==================================================
    // FILE NAME
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