import React, { useState, useEffect } from 'react';
import { Template } from '../types';
import { CheckCircle, Edit, Trash, Save } from 'lucide-react';

interface TemplateManagerProps {
  onSelect: (template: Template) => void;
}

const DEFAULT_TEMPLATES: Template[] = [
  { id: 1, name: 'Template 1', subject: '', body: '' },
  { id: 2, name: 'Template 2', subject: '', body: '' },
  { id: 3, name: 'Template 3', subject: '', body: '' },
];

const TemplateManager: React.FC<TemplateManagerProps> = ({ onSelect }) => {
  const [templates, setTemplates] = useState<Template[]>(() => {
    const savedTemplates = localStorage.getItem('emailTemplates');
    return savedTemplates ? JSON.parse(savedTemplates) : DEFAULT_TEMPLATES;
  });
  
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ subject: string; body: string }>({ subject: '', body: '' });

  useEffect(() => {
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
  }, [templates]);

  const handleSelect = (template: Template) => {
    setSelectedId(template.id);
    onSelect(template);
  };

  const handleEdit = (template: Template) => {
    setEditingId(template.id);
    setEditForm({ subject: template.subject, body: template.body });
  };

  const handleSave = () => {
    if (editingId) {
      const updatedTemplates = templates.map(template => 
        template.id === editingId 
          ? { ...template, subject: editForm.subject, body: editForm.body } 
          : template
      );
      setTemplates(updatedTemplates);
      
      // If the edited template was selected, update the selection
      if (selectedId === editingId) {
        const updatedTemplate = updatedTemplates.find(t => t.id === editingId);
        if (updatedTemplate) {
          onSelect(updatedTemplate);
        }
      }
      
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleReset = (templateId: number) => {
    const confirmed = window.confirm('Are you sure you want to reset this template?');
    if (confirmed) {
      const defaultTemplate = DEFAULT_TEMPLATES.find(t => t.id === templateId);
      if (defaultTemplate) {
        const updatedTemplates = templates.map(template => 
          template.id === templateId ? { ...template, subject: '', body: '' } : template
        );
        setTemplates(updatedTemplates);
        
        // If the reset template was selected, update the selection
        if (selectedId === templateId) {
          const resetTemplate = updatedTemplates.find(t => t.id === templateId);
          if (resetTemplate) {
            onSelect(resetTemplate);
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map(template => (
          <div 
            key={template.id}
            className={`border rounded-lg p-4 transition-all ${
              selectedId === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">{template.name}</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(template)}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit template"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleReset(template.id)}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title="Reset template"
                >
                  <Trash size={18} />
                </button>
                <button 
                  onClick={() => handleSelect(template)}
                  className={`${
                    selectedId === template.id 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  } transition-colors`}
                  title="Select template"
                >
                  <CheckCircle size={18} />
                </button>
              </div>
            </div>
            
            {template.subject || template.body ? (
              <div className="space-y-2">
                {template.subject && (
                  <div>
                    <span className="text-xs font-medium text-gray-500">Subject:</span>
                    <p className="text-sm text-gray-700 truncate">{template.subject}</p>
                  </div>
                )}
                {template.body && (
                  <div>
                    <span className="text-xs font-medium text-gray-500">Body:</span>
                    <p className="text-sm text-gray-700 line-clamp-2">{template.body}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Empty template</p>
            )}
          </div>
        ))}
      </div>

      {editingId && (
        <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium mb-3">
            Edit {templates.find(t => t.id === editingId)?.name}
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="template-subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="template-subject"
                value={editForm.subject}
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Email subject line"
              />
            </div>
            
            <div>
              <label htmlFor="template-body" className="block text-sm font-medium text-gray-700 mb-1">
                Body
              </label>
              <textarea
                id="template-body"
                rows={6}
                value={editForm.body}
                onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Email body content (supports HTML)"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;