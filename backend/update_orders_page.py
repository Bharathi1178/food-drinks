from pathlib import Path

orders_path = Path(__file__).resolve().parent.parent / "src" / "pages" / "OrdersPage.jsx"
content = orders_path.read_text(encoding="utf-8")

old_import = "import { orderService } from '../api/services/orderService';"
new_import = "import { orderApi } from '../api/orderApi';\nimport { orderService } from '../api/services/orderService';"

old_load = """  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };"""

new_load = """  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getOrders();
      const orderList = Array.isArray(data) ? data : (data?.results || []);
      setOrders(orderList);
    } catch (err) {
      console.error('Failed to load orders from backend:', err);
    } finally {
      setLoading(false);
    }
  };"""

content = content.replace(old_import, new_import)
content = content.replace(old_load, new_load)

orders_path.write_text(content, encoding="utf-8")
print("OrdersPage.jsx updated successfully!")
