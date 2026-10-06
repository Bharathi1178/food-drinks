import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category = null,
}) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: 'UtensilsCrossed',
    color: '#f97316',
    active: true,
  });

  const availableIcons = [
    'CupSoda',
    'Coffee',
    'GlassWater',
    'UtensilsCrossed',
    'Pizza',
    'Sandwich',
    'Flame',
    'Cookie',
    'Gift',
    'IceCream',
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        icon: category.icon || 'UtensilsCrossed',
        color: category.color || '#f97316',
        active: category.active !== false,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        icon: 'UtensilsCrossed',
        color: '#f97316',
        active: true,
      });
    }
  }, [category, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a category name');
      return;
    }

    const slug =
      formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-');
    onSubmit({ ...formData, slug });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add New Category'}
      subtitle="Organize items on the POS terminal"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => {
              const name = e.target.value;
              setFormData({
                ...formData,
                name,
                slug: !category ? name.toLowerCase().replace(/\s+/g, '-') : formData.slug,
              });
            }}
            placeholder="e.g. Milkshakes"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Category Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g. milkshakes"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Icon</label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
          >
            {availableIcons.map((ic) => (
              <option key={ic} value={ic}>
                {ic}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Accent Theme Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-10 h-10 p-0 rounded-lg border border-slate-200 cursor-pointer"
            />
            <span className="font-mono text-slate-600">{formData.color}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="cat-active"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
          />
          <label htmlFor="cat-active" className="font-bold text-slate-700">
            Visible on POS screen
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
          >
            {category ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
