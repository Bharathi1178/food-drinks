from pathlib import Path

modal_path = Path(__file__).resolve().parent.parent / "src" / "components" / "pos" / "PaymentModal.jsx"
content = modal_path.read_text(encoding="utf-8")

# Replace imports
old_import = "import { orderService } from '../../api/services/orderService';"
new_import = """import { orderApi } from '../../api/orderApi';
import { paymentApi } from '../../api/paymentApi';
import { orderService } from '../../api/services/orderService';"""

content = content.replace(old_import, new_import)

# Enhance handleCompletePayment with paymentApi
old_complete = """      const saved = await orderService.create(orderPayload);"""
new_complete = """      if (paymentMethod !== 'Cash') {
        try {
          await paymentApi.processPayment({
            payment_method: paymentMethod,
            amount: grandTotal,
            transaction_id: orderPayload.transactionId,
          });
        } catch (payErr) {
          console.warn('Payment transaction notice:', payErr);
        }
      }
      const saved = await orderApi.createOrder(orderPayload);"""

content = content.replace(old_complete, new_complete)

modal_path.write_text(content, encoding="utf-8")
print("PaymentModal.jsx updated successfully!")
