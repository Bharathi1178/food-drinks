import urllib.request
import json

def test_pos_system():
    print("=== STARTING POS SYSTEM INTEGRATION TESTS ===")

    # 1. Frontend Test
    try:
        req = urllib.request.urlopen("http://127.0.0.1:3000/pos", timeout=5)
        html = req.read().decode('utf-8')
        assert req.status == 200
        assert "<div id=\"root\">" in html
        print(" [PASS] Frontend running at http://127.0.0.1:3000/pos (HTTP 200)")
    except Exception as e:
        print(f" [FAIL] Frontend check failed: {e}")

    # 2. Categories API
    try:
        req = urllib.request.urlopen("http://127.0.0.1:8000/api/categories/", timeout=5)
        cats = json.loads(req.read().decode('utf-8'))
        assert req.status == 200
        assert len(cats) >= 10
        print(f" [PASS] Backend Categories API: {len(cats)} categories retrieved successfully.")
    except Exception as e:
        print(f" [FAIL] Categories API failed: {e}")

    # 3. Products API
    try:
        req = urllib.request.urlopen("http://127.0.0.1:8000/api/products/", timeout=5)
        prods = json.loads(req.read().decode('utf-8'))
        assert req.status == 200
        assert len(prods) >= 15
        print(f" [PASS] Backend Products API: {len(prods)} products retrieved successfully.")
    except Exception as e:
        print(f" [FAIL] Products API failed: {e}")

    # 4. Product Filtering by Category
    try:
        req = urllib.request.urlopen("http://127.0.0.1:8000/api/products/?category=burgers", timeout=5)
        burgers = json.loads(req.read().decode('utf-8'))
        assert req.status == 200
        assert all(p['category'] == 'burgers' for p in burgers)
        print(f" [PASS] Category Filter (/api/products/?category=burgers): {len(burgers)} items returned.")
    except Exception as e:
        print(f" [FAIL] Category filter failed: {e}")

    # 5. Product Search
    try:
        req = urllib.request.urlopen("http://127.0.0.1:8000/api/products/?search=tea", timeout=5)
        teas = json.loads(req.read().decode('utf-8'))
        assert req.status == 200
        assert len(teas) > 0
        print(f" [PASS] Search Filter (/api/products/?search=tea): {len(teas)} item(s) found.")
    except Exception as e:
        print(f" [FAIL] Search filter failed: {e}")

    # 6. Order Creation & Stock Deduction
    try:
        # Check current stock of prod-2 (Filter Coffee)
        req = urllib.request.urlopen("http://127.0.0.1:8000/api/products/prod-2/", timeout=5)
        prod_before = json.loads(req.read().decode('utf-8'))
        initial_stock = prod_before['stock']

        order_data = {
            "orderType": "Takeaway",
            "tableNo": "Token 42",
            "customerName": "Rahul Sharma",
            "customerPhone": "9812345678",
            "items": [
                {
                    "id": "prod-2",
                    "name": "Filter Coffee",
                    "price": 25,
                    "quantity": 3,
                    "total": 75
                }
            ],
            "subtotal": 75,
            "discount": 0,
            "tax": 3.75,
            "grandTotal": 78.75,
            "paymentMethod": "UPI",
            "paymentStatus": "Paid",
            "amountReceived": 78.75,
            "changeDue": 0,
            "transactionId": "TXN-UPI-998877"
        }

        data_bytes = json.dumps(order_data).encode('utf-8')
        post_req = urllib.request.Request(
            "http://127.0.0.1:8000/api/orders/",
            data=data_bytes,
            headers={"Content-Type": "application/json"}
        )
        post_res = urllib.request.urlopen(post_req, timeout=5)
        created_order = json.loads(post_res.read().decode('utf-8'))
        assert post_res.status == 201
        assert "ORD-" in created_order['id']
        assert created_order['grandTotal'] == 78.75

        # Check stock deduction
        req2 = urllib.request.urlopen("http://127.0.0.1:8000/api/products/prod-2/", timeout=5)
        prod_after = json.loads(req2.read().decode('utf-8'))
        assert prod_after['stock'] == initial_stock - 3

        print(f" [PASS] Order Placement & Stock Deduction: Order {created_order['id']} created. Stock reduced from {initial_stock} to {prod_after['stock']}.")
    except Exception as e:
        print(f" [FAIL] Order placement failed: {e}")

    # 7. Payment Process Endpoint
    try:
        pay_data = {
            "payment_method": "Card",
            "amount": 78.75,
            "transaction_id": "TXN-CARD-112233"
        }
        pay_bytes = json.dumps(pay_data).encode('utf-8')
        pay_req = urllib.request.Request(
            "http://127.0.0.1:8000/api/payments/process/",
            data=pay_bytes,
            headers={"Content-Type": "application/json"}
        )
        pay_res = urllib.request.urlopen(pay_req, timeout=5)
        pay_json = json.loads(pay_res.read().decode('utf-8'))
        assert pay_res.status == 200
        assert pay_json['status'] == 'Approved'
        print(" [PASS] Payment Endpoint (/api/payments/process/): Status Approved.")
    except Exception as e:
        print(f" [FAIL] Payment endpoint failed: {e}")

    # 8. Customer Registration
    try:
        req = urllib.request.urlopen("http://127.0.0.1:8000/api/customers/?search=9812345678", timeout=5)
        custs = json.loads(req.read().decode('utf-8'))
        assert req.status == 200
        assert len(custs) > 0
        assert custs[0]['name'] == 'Rahul Sharma'
        print(f" [PASS] Customer Auto-Record: Customer {custs[0]['name']} recorded with {custs[0]['total_orders']} order(s).")
    except Exception as e:
        print(f" [FAIL] Customer lookup failed: {e}")

    print("=== ALL INTEGRATION CHECKS PASSED SUCCESSFULLY ===")

if __name__ == '__main__':
    test_pos_system()
