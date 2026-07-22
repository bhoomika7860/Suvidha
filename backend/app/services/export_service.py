from io import BytesIO

from openpyxl import Workbook
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, A4
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
)


def generate_excel_report(reports):
    wb = Workbook()
    ws = wb.active
    ws.title = "Daily Reports"

    ws.append([
        "Date",
        "Store",
        "Bills",
        "Cash",
        "UPI",
        "Card",
        "Udhaar",
        "Expenses",
        "Purchases",
        "Deliveries",
        "Status",
    ])

    total_bills = 0
    total_cash = 0
    total_upi = 0
    total_card = 0
    total_udhaar = 0
    total_expenses = 0
    total_purchases = 0
    total_deliveries = 0

    for report in reports:

        ws.append([
            report.report_date,
            report.store_id,
            report.total_bills,
            report.cash_sales,
            report.upi_sales,
            report.card_sales,
            report.udhaar_sales,
            report.total_expenses,
            report.total_purchases,
            report.deliveries,
            "Locked" if report.is_locked else "Open",
        ])

        total_bills += report.total_bills or 0
        total_cash += report.cash_sales or 0
        total_upi += report.upi_sales or 0
        total_card += report.card_sales or 0
        total_udhaar += report.udhaar_sales or 0
        total_expenses += report.total_expenses or 0
        total_purchases += report.total_purchases or 0
        total_deliveries += report.deliveries or 0

    ws.append([])

    ws.append([
        "TOTAL",
        "",
        total_bills,
        total_cash,
        total_upi,
        total_card,
        total_udhaar,
        total_expenses,
        total_purchases,
        total_deliveries,
        "",
    ])

    output = BytesIO()
    wb.save(output)
    output.seek(0)

    return output


def generate_pdf_report(reports):

    output = BytesIO()

    doc = SimpleDocTemplate(
        output,
        pagesize=landscape(A4),
    )

    data = [[
        "Date",
        "Store",
        "Bills",
        "Cash",
        "UPI",
        "Card",
        "Udhaar",
        "Expenses",
        "Purchases",
        "Deliveries",
        "Status",
    ]]

    for report in reports:

        data.append([
            str(report.report_date),
            str(report.store_id),
            report.total_bills,
            report.cash_sales,
            report.upi_sales,
            report.card_sales,
            report.udhaar_sales,
            report.total_expenses,
            report.total_purchases,
            report.deliveries,
            "Locked" if report.is_locked else "Open",
        ])

    table = Table(data)

    table.setStyle(

        TableStyle([

            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),

            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),

            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),

            ("BOTTOMPADDING", (0, 0), (-1, 0), 10),

            ("BACKGROUND", (0, 1), (-1, -1), colors.white),

        ])

    )

    doc.build([table])

    output.seek(0)

    return output