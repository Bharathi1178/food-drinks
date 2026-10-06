import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}) {
  const isDanger = type === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm" showClose={false}>
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 mt-1">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm transition-all ${
            isDanger
              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
              : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
