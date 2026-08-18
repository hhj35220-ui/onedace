from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

root = Path(".")
output = root / "OnePlace-Enterprise-Full.pdf"

extensions = {
    ".html", ".css", ".js", ".json", ".md",
    ".txt", ".py", ".rules", ".bat", ".xml", ".svg"
}

files = []

for p in root.rglob("*"):
    if not p.is_file():
        continue

    if "node_modules" in p.parts:
        continue
    if ".git" in p.parts:
        continue
    if ".venv" in p.parts:
        continue

    # Exclude WhatsApp session/authentication data
    if "sessions" in p.parts and "whatsapp-service" in p.parts:
        continue

    if p.suffix.lower() in extensions:
        files.append(p)

files.sort()

pdf = canvas.Canvas(str(output), pagesize=A4)
width, height = A4

y = height - 40

for file in files:
    title = f"===== {file.relative_to(root)} ====="

    pdf.setFont("Courier-Bold", 9)
    pdf.drawString(35, y, title[:110])
    y -= 16

    try:
        text = file.read_text(encoding="utf-8", errors="replace")
    except Exception:
        text = "[Unable to read this file]"

    pdf.setFont("Courier", 7)

    for line in text.splitlines():
        if y < 35:
            pdf.showPage()
            pdf.setFont("Courier", 7)
            y = height - 40

        # Keep long lines from running off the page
        pdf.drawString(35, y, line[:115])
        y -= 9

    y -= 12

pdf.save()

print()
print("========================================")
print("PDF CREATED SUCCESSFULLY")
print(output.resolve())
print("========================================")