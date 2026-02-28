from PyPDF2 import PdfReader

reader = PdfReader("./data/hrpolicy.pdf")
page = reader.pages[1]
print(page.extract_text())
