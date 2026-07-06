from openpyxl import Workbook
from io import BytesIO


def generate_excel_report(reports):
    wb = Workbook()
    ws = wb.active
    ws.title = "Pharma Report"

    # Headers
    ws.append([
        "Store",
        "Bills",
        "Cash",
        "UPI",
        "Card",
        "Udhaar",
        "Expenses",
        "Purchases",
        "Deliveries",
        "Bounced Products"
    ])

    total_bills = 0
    total_cash = 0
    total_upi = 0
    total_card = 0
    total_udhaar = 0
    total_expenses = 0
    total_deliveries = 0
    total_bounced = 0

    for report in reports:
        ws.append([
    report.store_id,
            report.total_bills,
            report.cash_sales,
            report.upi_sales,
            report.card_sales,
            report.udhaar_sales,
            report.total_expenses,
            report.total_purchases,
            0,
0
        ])

        total_bills += report.total_bills
        total_cash += report.cash_sales
        total_upi += report.upi_sales
        total_card += report.card_sales
        total_udhaar += report.udhaar_sales
        total_expenses += report.daily_expenses
        total_purchases += report.total_purchases
        total_deliveries += report.deliveries_completed
        total_bounced += report.bounced_products

    ws.append([])
    ws.append([
        "CONSOLIDATED",
        total_bills,
        total_cash,
        total_upi,
        total_card,
        total_udhaar,
        total_expenses,
        total_deliveries,
        total_bounced
    ])

    output = BytesIO()
    wb.save(output)
    output.seek(0)

    return output