import jsPDF from "jspdf";

import autoTable
    from "jspdf-autotable";


// ======================================================
// MONEY FORMAT
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
// DATE FORMAT
// ======================================================

const prettyDate = (value) => {

    if (!value) {
        return "";
    }


    const [
        year,
        month,
        day
    ] = value.split("-");


    return `${day}/${month}/${year}`;

};


// ======================================================
// TYPE TITLE
// ======================================================

const getStatementTitle = (
    type
) => {

    if (type === "in") {

        return "Donation / IN Statement";

    }


    if (type === "out") {

        return "Expense / OUT Statement";

    }


    return "Complete IN / OUT Statement";

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
                type === "all"
                    ? "landscape"
                    : "portrait",

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

    doc.setFontSize(19);

    doc.text(
        "AFBROS Finance System",
        14,
        16
    );


    doc.setFontSize(14);

    doc.text(
        getStatementTitle(
            type
        ),
        14,
        24
    );


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(9);


    const rangeText =
        range.complete
            ? "Complete Statement: Beginning of records to today"
            : `Statement Period: ${prettyDate(
                range.from
            )} to ${prettyDate(
                range.to
            )}`;


    doc.text(
        rangeText,
        14,
        31
    );


    const generatedAt =
        new Date()
            .toLocaleString();


    doc.text(
        `Generated: ${generatedAt}`,
        14,
        36
    );


    // ==================================================
    // SUMMARY
    // ==================================================

    let summaryY = 44;


    if (
        type === "all"
    ) {

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.text(
            `Total IN: Rs. ${money(
                totals.totalIn
            )}`,
            14,
            summaryY
        );


        doc.text(
            `Total OUT: Rs. ${money(
                totals.totalOut
            )}`,
            75,
            summaryY
        );


        doc.text(
            `Net Balance: Rs. ${money(
                totals.balance
            )}`,
            140,
            summaryY
        );

    }


    if (
        type === "in"
    ) {

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.text(
            `Total Donations: Rs. ${money(
                totals.totalIn
            )}`,
            14,
            summaryY
        );

    }


    if (
        type === "out"
    ) {

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.text(
            `Total Expenses: Rs. ${money(
                totals.totalOut
            )}`,
            14,
            summaryY
        );

    }


    // ==================================================
    // COMPLETE IN / OUT TABLE
    // ==================================================

    if (
        type === "all"
    ) {

        let runningBalance =
            0;


        const rows =
            records.map(
                (record) => {

                    const amount =
                        Number(
                            record.amount
                        );


                    if (
                        record.transaction_type ===
                        "IN"
                    ) {

                        runningBalance +=
                            amount;

                    } else {

                        runningBalance -=
                            amount;

                    }


                    return [

                        prettyDate(
                            record.record_date
                        ),

                        record.transaction_type,

                        record.full_name,

                        record.details || "—",

                        record.transaction_type ===
                        "IN"
                            ? money(amount)
                            : "—",

                        record.transaction_type ===
                        "OUT"
                            ? money(amount)
                            : "—",

                        money(
                            runningBalance
                        )

                    ];

                }
            );


        autoTable(
            doc,
            {

                startY:
                    50,

                head: [[
                    "Date",
                    "Type",
                    "Name",
                    "Phone / Description",
                    "IN (Rs.)",
                    "OUT (Rs.)",
                    "Balance (Rs.)"
                ]],

                body:
                    rows.length
                        ? rows
                        : [[
                            "No records found",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]],

                styles: {
                    fontSize: 8,
                    cellPadding: 2.5
                },

                headStyles: {
                    fontStyle: "bold"
                },

                didDrawPage: (
                    data
                ) => {

                    addFooter(
                        doc,
                        data.pageNumber
                    );

                }

            }
        );

    }


    // ==================================================
    // IN STATEMENT
    // ==================================================

    if (
        type === "in"
    ) {

        const rows =
            records.map(
                (record) => [

                    prettyDate(
                        record.record_date
                    ),

                    record.full_name,

                    record.details || "—",

                    `Rs. ${money(
                        record.amount
                    )}`

                ]
            );


        autoTable(
            doc,
            {

                startY:
                    50,

                head: [[
                    "Date",
                    "Donor Name",
                    "Phone",
                    "Amount"
                ]],

                body:
                    rows.length
                        ? rows
                        : [[
                            "No records found",
                            "",
                            "",
                            ""
                        ]],

                styles: {
                    fontSize: 9,
                    cellPadding: 3
                },

                headStyles: {
                    fontStyle: "bold"
                },

                didDrawPage: (
                    data
                ) => {

                    addFooter(
                        doc,
                        data.pageNumber
                    );

                }

            }
        );

    }


    // ==================================================
    // OUT STATEMENT
    // ==================================================

    if (
        type === "out"
    ) {

        const rows =
            records.map(
                (record) => [

                    prettyDate(
                        record.record_date
                    ),

                    record.full_name,

                    record.details || "—",

                    `Rs. ${money(
                        record.amount
                    )}`

                ]
            );


        autoTable(
            doc,
            {

                startY:
                    50,

                head: [[
                    "Date",
                    "Name",
                    "Description",
                    "Amount"
                ]],

                body:
                    rows.length
                        ? rows
                        : [[
                            "No records found",
                            "",
                            "",
                            ""
                        ]],

                styles: {
                    fontSize: 9,
                    cellPadding: 3
                },

                headStyles: {
                    fontStyle: "bold"
                },

                didDrawPage: (
                    data
                ) => {

                    addFooter(
                        doc,
                        data.pageNumber
                    );

                }

            }
        );

    }


    // ==================================================
    // FILE NAME
    // ==================================================

    const reportName = {

        all:
            "Complete_Statement",

        in:
            "Donation_Statement",

        out:
            "Expense_Statement"

    }[type];


    const rangeName =
        range.complete
            ? "Complete"
            : `${range.from}_to_${range.to}`;


    doc.save(
        `AFBROS_${reportName}_${rangeName}.pdf`
    );

};


// ======================================================
// FOOTER
// ======================================================

const addFooter = (
    doc,
    pageNumber
) => {

    const pageHeight =
        doc.internal.pageSize.height;


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.setFontSize(
        8
    );


    doc.text(
        "AFBROS Finance System",
        14,
        pageHeight - 8
    );


    doc.text(
        `Page ${pageNumber}`,
        doc.internal.pageSize.width - 28,
        pageHeight - 8
    );

};


export default generateStatementPdf;