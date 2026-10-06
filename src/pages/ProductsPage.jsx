import React, { useState, useEffect, useMemo } from 'react';
import { productService } from '../api/services/productService';
import { categoryService } from '../api/services/categoryService';
import ProductFormModal from '../components/products/ProductFormModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modals state
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingProduct) {
        const updated = await productService.update(editingProduct.id, formData);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updated : p))
        );
      } else {
        const created = await productService.create(formData);
        setProducts((prev) => [created, ...prev]);
      }
      setFormModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      alert('Failed to save product.');
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await productService.delete(deletingProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const updated = await productService.toggleStatus(
        product.id,
        !product.available
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, available: !product.available } : p
        )
      );
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const query = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900">Product Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage food catalog, prices, recipes, GST rates, and inventory thresholds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setFormModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search products by name or ingredient..."
          className="flex-1"
        />

        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none capitalize"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* View mode toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-400'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-400'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {loading ? (
        <LoadingSpinner size="lg" text="Loading products..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try selecting another category or add your first product."
          action={
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormModalOpen(true);
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Create Product
            </button>
          }
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price (₹)</th>
                  <th className="py-3.5 px-4">Cost Price</th>
                  <th className="py-3.5 px-4">GST Rate</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.stock <= (p.minStock || 10);
                  const isOut = p.stock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80';
                            }}
                          />
                          <div>
                            <p className="font-bold text-slate-900 leading-snug">{p.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[240px]">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 capitalize font-semibold text-slate-700">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                        ₹{p.price}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        ₹{p.costPrice || 0}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {p.gst || 5}% GST
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold ${
                              isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-800'
                            }`}
                          >
                            {p.stock}
                          </span>
                          {isOut ? (
                            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                              Out
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                              Low
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                              In Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            p.available
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {p.available ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p);
                              setFormModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-36 object-cover rounded-xl bg-slate-100 mb-3"
                />
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                  <span className="text-xs font-mono font-extrabold text-orange-600">
                    ₹{p.price}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  {p.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Stock: {p.stock}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(p);
                      setFormModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingProduct(p)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateOrUpdate}
        product={editingProduct}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        message={`Are you sure you want to remove "${deletingProduct?.name}" from your catalog?`}
      />
    </div>
  );
}
