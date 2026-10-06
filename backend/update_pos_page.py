from pathlib import Path

pos_page_path = Path(__file__).resolve().parent.parent / "src" / "pages" / "POSPage.jsx"

code = """import React, { useState, useEffect, useMemo } from 'react';
import CategoryPills from '../components/pos/CategoryPills';
import ProductCard from '../components/pos/ProductCard';
import Cart from '../components/pos/Cart';
import PaymentModal from '../components/pos/PaymentModal';
import QuickCustomerModal from '../components/pos/QuickCustomerModal';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import { usePOS } from '../context/POSContext';
import { UtensilsCrossed, AlertTriangle, RefreshCw } from 'lucide-react';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cart, addToCart } = usePOS();

  // Load products and categories from backend REST API
  const loadMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        productApi.getProducts(),
        categoryApi.getCategories(),
      ]);
      const productList = Array.isArray(prods) ? prods : (prods?.results || []);
      const categoryList = Array.isArray(cats) ? cats : (cats?.results || []);
      setProducts(productList);
      setCategories(categoryList);
    } catch (err) {
      console.error('Failed to load POS data from backend API:', err);
      setError('Unable to load menu from backend API (http://127.0.0.1:8000/api). Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Compute product counts per category for the pills
  const productCounts = useMemo(() => {
    const counts = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter products by category & search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Map cart quantities by product id
  const cartQuantities = useMemo(() => {
    const map = {};
    cart.forEach((item) => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cart]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-100px)]">
      {/* LEFT SECTION: Products & Categories (65% on Desktop) */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-3xl border border-slate-200/80 p-4 lg:p-5 shadow-xs overflow-hidden">
        {/* Top Filter Bar: Search + Category Pills */}
        <div className="space-y-3 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search food by name, ingredients, or code..."
              className="flex-1"
            />
          </div>

          {/* Sticky Category Pills */}
          <CategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            productCounts={productCounts}
          />
        </div>

        {/* Backend Connection Error Banner (if any) */}
        {error && (
          <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-[11px] shadow-xs transition-colors shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Product Cards Grid Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <LoadingSpinner size="lg" text="Loading menu items from backend..." />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="No food items found"
              description={
                searchQuery
                  ? `No dishes matching "${searchQuery}".`
                  : 'No items in this category.'
              }
              action={
                searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3.5 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold"
                  >
                    Clear Search
                  </button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4 pb-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  cartQuantity={cartQuantities[product.id] || 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Cart & Billing Terminal (35% on Desktop) */}
      <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0 h-full flex flex-col">
        <Cart />
      </div>

      {/* Payment Screen Modal */}
      <PaymentModal />

      {/* Quick Customer Attach Modal */}
      <QuickCustomerModal />
    </div>
  );
}
"""

pos_page_path.write_text(code, encoding="utf-8")
print("POSPage.jsx updated successfully!")
