import jsPDF from "jspdf";

import autoTable
    from "jspdf-autotable";


// ======================================================
// COLORS
// ======================================================

const CREDIT_COLOR =
    [
        25,
        135,
        84
    ];


const DEBIT_COLOR =
    [
        220,
        53,
        69
    ];


const TEXT_COLOR =
    [
        38,
        55,
        46
    ];


// ======================================================
// MONEY
// ======================================================

const money = (
    value
) => {

    return Number(
        value ||
        0
    ).toLocaleString(
        "en-PK",
        {
            minimumFractionDigits:
                0,

            maximumFractionDigits:
                2
        }
    );

};


// ======================================================
// DATE
// ======================================================

const prettyDate = (
    value
) => {

    if (!value) {

        return "";

    }


    const datePart =
        String(
            value
        ).substring(
            0,
            10
        );


    const [
        year,
        month,
        day
    ] = datePart.split(
        "-"
    );


    return (
        `${day}/${month}/${year}`
    );

};


// ======================================================
// TITLE
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
// TABLE LAYOUTS
// ======================================================

const TABLE_LEFT =
    14;


const layouts = {

    all: {

        widths: {

            date:
                28,

            name:
                52,

            details:
                90,

            credit:
                32,

            debit:
                32,

            balance:
                35

        },

        order: [
            "date",
            "name",
            "details",
            "credit",
            "debit",
            "balance"
        ]

    },


    in: {

        widths: {

            date:
                34,

            name:
                80,

            details:
                95,

            credit:
                60

        },

        order: [
            "date",
            "name",
            "details",
            "credit"
        ]

    },


    out: {

        widths: {

            date:
                34,

            name:
                80,

            details:
                95,

            debit:
                60

        },

        order: [
            "date",
            "name",
            "details",
            "debit"
        ]

    }

};


// ======================================================
// GET COLUMN POSITIONS
// ======================================================

const getPositions = (
    type
) => {

    const layout =
        layouts[
            type
        ];


    let currentX =
        TABLE_LEFT;


    const positions =
        {};


    layout.order.forEach(
        (key) => {

            positions[
                key
            ] = {

                x:
                    currentX,

                width:
                    layout
                        .widths[
                            key
                        ]

            };


            currentX +=
                layout
                    .widths[
                        key
                    ];

        }
    );


    return positions;

};


// ======================================================
// PAGE TOTAL
// ======================================================

const drawPageTotal = (
    doc,
    type,
    totals,
    isLastPage
) => {

    const positions =
        getPositions(
            type
        );


    const pageHeight =
        doc.internal
            .pageSize
            .getHeight();


    const y =
        isLastPage
            ? pageHeight - 20
            : pageHeight - 13;


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(
        8
    );


    doc.setTextColor(
        ...TEXT_COLOR
    );


    // ==================================================
    // COMPLETE
    // ==================================================

    if (
        type === "all"
    ) {

        doc.text(
            "Page Total",
            positions.credit.x -
                3,
            y,
            {
                align:
                    "right"
            }
        );


        // CREDIT

        doc.setTextColor(
            ...CREDIT_COLOR
        );


        doc.text(
            money(
                totals.credit
            ),
            positions.credit.x +
                positions.credit.width -
                2,
            y,
            {
                align:
                    "right"
            }
        );


        // DEBIT

        doc.setTextColor(
            ...DEBIT_COLOR
        );


        doc.text(
            money(
                totals.debit
            ),
            positions.debit.x +
                positions.debit.width -
                2,
            y,
            {
                align:
                    "right"
            }
        );


        // BALANCE

        doc.setTextColor(
            ...TEXT_COLOR
        );


        doc.text(
            money(
                totals.balance
            ),
            positions.balance.x +
                positions.balance.width -
                2,
            y,
            {
                align:
                    "right"
            }
        );

    }


    // ==================================================
    // DONATION
    // ==================================================

    if (
        type === "in"
    ) {

        doc.text(
            "Page Total",
            positions.credit.x -
                3,
            y,
            {
                align:
                    "right"
            }
        );


        doc.setTextColor(
            ...CREDIT_COLOR
        );


        doc.text(
            money(
                totals.credit
            ),
            positions.credit.x +
                positions.credit.width -
                2,
            y,
            {
                align:
                    "right"
            }
        );

    }


    // ==================================================
    // EXPENSE
    // ==================================================

    if (
        type === "out"
    ) {

        doc.text(
            "Page Total",
            positions.debit.x -
                3,
            y,
            {
                align:
                    "right"
            }
        );


        doc.setTextColor(
            ...DEBIT_COLOR
        );


        doc.text(
            money(
                totals.debit
            ),
            positions.debit.x +
                positions.debit.width -
                2,
            y,
            {
                align:
                    "right"
            }
        );

    }


    doc.setTextColor(
        ...TEXT_COLOR
    );

};


// ======================================================
// GRAND TOTAL
// ======================================================

const drawGrandTotal = (
    doc,
    type,
    totals
) => {

    const positions =
        getPositions(
            type
        );


    const pageHeight =
        doc.internal
            .pageSize
            .getHeight();


    const y =
        pageHeight - 13;


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(
        8.5
    );


    doc.setTextColor(
        ...TEXT_COLOR
    );


    // ==================================================
    // COMPLETE
    // ==================================================

    if (
        type === "all"
    ) {

        doc.text(
            "Grand Total",
            positions.credit.x -
                3,
            y,
            {
                align:
                    "right"
            }
        );


        doc.setTextColor(
            ...CREDIT_COLOR
        );


        doc.text(
            money(
                totals.credit
            ),
            positions.credit.x +
                positions.credit.width -
                2,
            y,
            {
                align:
                    "right"
            }
        );


        doc.setTextColor(
            ...DEBIT_COLOR
        );


        doc.text(
            money(
                totals.debit
            ),
            positions.debit.x +
                positions.debit.width -
                2,
            y,
            {
                align:
                    "right"
            }
        );


        doc.setTextColor(
            ...TEXT_COLOR
        );


        doc.text(
            money(
                totals.balance
            ),
            positions.balance.x +
                positions.balance.width -
                2,
            y,
            {
                align:
                    "right"
            }
        );

    }


    // ==================================================
    // DONATION
    // ==================================================

    if (
        type === "in"
    ) {

        doc.text(
            "Grand Total",
            positions.credit.x -
                3,
            y,
            {
                align:
                    "right"
            }
        );


        doc.setTextColor(
            ...CREDIT_COLOR
        );


        doc.text(
            money(
                totals.credit
            ),
            positions.credit.x +
                positions.credit.width -
                2,
            y,
            {
                align:
                    "right"
            }
        );

    }


    // ==================================================
    // EXPENSE
    // ==================================================

    if (
        type === "out"
    ) {

        doc.text(
            "Grand Total",
            positions.debit.x -
                3,
            y,
            {
                align:
                    "right"
            }
        );


        doc.setTextColor(
            ...DEBIT_COLOR
        );


        doc.text(
            money(
                totals.debit
            ),
            positions.debit.x +
                positions.debit.width -
                2,
            y,
            {
                align:
                    "right"
            }
        );

    }


    doc.setTextColor(
        ...TEXT_COLOR
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
        7
    );


    doc.setTextColor(
        ...TEXT_COLOR
    );


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
            align:
                "right"
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
        records,
        filters

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

    doc.setTextColor(
        ...TEXT_COLOR
    );


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


    let headerBottom =
        35;


    // ==================================================
    // DONOR
    // ==================================================

    if (
        filters?.donor
    ) {

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.text(
            "Donor:",
            14,
            35
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.text(
            filters.donor,
            27,
            35
        );


        headerBottom =
            40;

    }


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        14,
        headerBottom
    );


    // ==================================================
    // BUILD BODY
    // ==================================================

    let runningBalance =
        0;


    const body =
        records.map(
            (
                record
            ) => {

                const amount =
                    Number(
                        record.amount ||
                        0
                    );


                // ==================================================
                // COMPLETE
                // ==================================================

                if (
                    type === "all"
                ) {

                    const credit =
                        record.transaction_type ===
                            "IN"
                            ? amount
                            : 0;


                    const debit =
                        record.transaction_type ===
                            "OUT"
                            ? amount
                            : 0;


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
                                : "",

                        debit:
                            debit
                                ? money(
                                    debit
                                )
                                : "",

                        balance:
                            money(
                                runningBalance
                            ),

                        _credit:
                            credit,

                        _debit:
                            debit

                    };

                }


                // ==================================================
                // DONATION
                // ==================================================

                if (
                    type === "in"
                ) {

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
                            money(
                                amount
                            ),

                        _credit:
                            amount,

                        _debit:
                            0

                    };

                }


                // ==================================================
                // EXPENSE
                // ==================================================

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

                    debit:
                        money(
                            amount
                        ),

                    _credit:
                        0,

                    _debit:
                        amount

                };

            }
        );


    // ==================================================
    // COLUMNS
    // ==================================================

    let columns;


    // COMPLETE

    if (
        type === "all"
    ) {

        columns = [

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
                    "Details",

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

        ];

    }


    // DONATION

    if (
        type === "in"
    ) {

        columns = [

            {
                header:
                    "Date",

                dataKey:
                    "date"
            },

            {
                header:
                    "Donor Name",

                dataKey:
                    "name"
            },

            {
                header:
                    "Phone",

                dataKey:
                    "details"
            },

            {
                header:
                    "Credit",

                dataKey:
                    "credit"
            }

        ];

    }


    // EXPENSE

    if (
        type === "out"
    ) {

        columns = [

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
                    "Description",

                dataKey:
                    "details"
            },

            {
                header:
                    "Debit",

                dataKey:
                    "debit"
            }

        ];

    }


    // ==================================================
    // COLUMN STYLES
    // ==================================================

    let columnStyles;


    if (
        type === "all"
    ) {

        columnStyles = {

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
                    90
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

        };

    }


    if (
        type === "in"
    ) {

        columnStyles = {

            date: {
                cellWidth:
                    34
            },

            name: {
                cellWidth:
                    80
            },

            details: {
                cellWidth:
                    95
            },

            credit: {

                cellWidth:
                    60,

                halign:
                    "right"

            }

        };

    }


    if (
        type === "out"
    ) {

        columnStyles = {

            date: {
                cellWidth:
                    34
            },

            name: {
                cellWidth:
                    80
            },

            details: {
                cellWidth:
                    95
            },

            debit: {

                cellWidth:
                    60,

                halign:
                    "right"

            }

        };

    }


    // ==================================================
    // PAGE TOTAL STORAGE
    // ==================================================

    const pageTotals =
        {};


    // ==================================================
    // TABLE
    // ==================================================

    autoTable(
        doc,
        {

            startY:
                headerBottom +
                7,


            margin: {

                top:
                    15,

                left:
                    14,

                right:
                    14,

                bottom:
                    29

            },


            rowPageBreak:
                "avoid",


            columns,


            body:
                body.length
                    ? body
                    : [],


            styles: {

                fontSize:
                    8.5,

                cellPadding:
                    2.8,

                lineColor: [
                    229,
                    235,
                    231
                ],

                lineWidth:
                    0.15,

                textColor:
                    TEXT_COLOR

            },


            headStyles: {

                fontStyle:
                    "bold",

                textColor:
                    TEXT_COLOR

            },


            columnStyles,


            // ==================================================
            // CREDIT GREEN
            // DEBIT RED
            // ==================================================

            didParseCell: (
                data
            ) => {

                const key =
                    data.column
                        .dataKey;


                if (
                    key ===
                    "credit"
                ) {

                    data.cell.styles.textColor =
                        CREDIT_COLOR;


                    data.cell.styles.fontStyle =
                        "bold";

                }


                if (
                    key ===
                    "debit"
                ) {

                    data.cell.styles.textColor =
                        DEBIT_COLOR;


                    data.cell.styles.fontStyle =
                        "bold";

                }

            },


            // ==================================================
            // PAGE TOTAL CALCULATION
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


                let markerColumn;


                if (
                    type ===
                    "all"
                ) {

                    markerColumn =
                        "balance";

                }


                if (
                    type ===
                    "in"
                ) {

                    markerColumn =
                        "credit";

                }


                if (
                    type ===
                    "out"
                ) {

                    markerColumn =
                        "debit";

                }


                if (
                    data.column
                        .dataKey !==
                    markerColumn
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
    // TOTAL PAGES
    // ==================================================

    const totalPages =
        doc.internal
            .getNumberOfPages();


    // ==================================================
    // PAGE TOTALS + GRAND TOTAL
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


        const lastPage =
            pageNumber ===
            totalPages;


        drawPageTotal(
            doc,
            type,
            pageTotal,
            lastPage
        );


        if (
            lastPage
        ) {

            drawGrandTotal(
                doc,
                type,
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
                            totals.balance ||
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
    // DOWNLOAD
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