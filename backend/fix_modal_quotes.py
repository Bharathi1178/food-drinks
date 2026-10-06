from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent
modal_path = FRONTEND_DIR / "src" / "components" / "auth" / "CustomerAuthModal.jsx"
content = modal_path.read_text(encoding="utf-8")

# Fix unescaped haven't
content = content.replace(
    "setErrorMsg('Account not found! You haven't signed up yet. Please complete sign up below to place your order.');",
    'setErrorMsg("Account not found! You have not signed up yet. Please complete sign up below to place your order.");'
)
content = content.replace(
    "setErrorMsg('You haven't signed up yet. Please complete signup to place your order.');",
    'setErrorMsg("You have not signed up yet. Please complete sign up below to place your order.");'
)

modal_path.write_text(content, encoding="utf-8")
print("Fixed CustomerAuthModal.jsx quotes!")
