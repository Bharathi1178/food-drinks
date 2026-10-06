import React, { useState, useEffect } from 'react';
import { categoryService } from '../api/services/categoryService';
import { productService } from '../api/services/productService';
import CategoryFormModal from '../components/categories/CategoryFormModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CupSoda,
  Coffee,
  GlassWater,
  UtensilsCrossed,
  Pizza,
  Flame,
  Cookie,
  Gift,
  IceCream,
  Sandwich,
} from 'lucide-react';

const iconMap = {
  CupSoda,
  Coffee,
  GlassWater,
  UtensilsCrossed,
  Pizza,
  Sandwich,
  Flame,
  Cookie,
  Gift,
  IceCream,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        categoryService.getAll(),
        productService.getAll(),
      ]);
      setCategories(cats || []);
      setProducts(prods || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingCategory) {
        const updated = await categoryService.update(editingCategory.id, formData);
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? updated : c))
        );
      } else {
        const created = await categoryService.create(formData);
        setCategories((prev) => [...prev, created]);
      }
      setFormOpen(false);
      setEditingCategory(null);
    } catch (e) {
      alert('Failed to save category');
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await categoryService.delete(deletingCategory.id);
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      setDeletingCategory(null);
    } catch (e) {
      alert('Failed to delete category');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900">Category Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize menu item categories for faster cashier billing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading categories..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || UtensilsCrossed;
            const itemCount = products.filter((p) => p.category === cat.slug).length;

            return (
              <div
                key={cat.id || cat.slug}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: cat.color || '#f97316' }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.active !== false
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.active !== false ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    slug: {cat.slug}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">
                    {itemCount} {itemCount === 1 ? 'Product' : 'Products'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(cat);
                        setFormOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCreateOrUpdate}
        category={editingCategory}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message={`Deleting "${deletingCategory?.name}" will unassign items from this category.`}
      />
    </div>
  );
}
