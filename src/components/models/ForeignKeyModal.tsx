import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface ForeignKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedTable: string, selectedColumn: string, cascadeOptions: { onDelete: string; onUpdate: string }) => void;
  currentTable: string;
  initialValues?: {
    table: string;
    column: string;
    onDelete?: string;
    onUpdate?: string;
  };
}

interface Entity {
  name: string;
  numberofcolumn: string;
  columnname: string;
}

// Define the form data interface
interface FormData {
  selectedTable: string;
}

// Define the validation schema
const schema = yup.object().shape({
  selectedTable: yup.string().required('Please select a referenced table'),
});

const ForeignKeyModal: React.FC<ForeignKeyModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentTable,
  initialValues
}) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [cascadeOptions, setCascadeOptions] = useState({
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // Initialize form with react-hook-form and yup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  // API configuration
  const API_URL = process.env.NEXT_PUBLIC_API_URL_ENDPOINT;

  // Set initial values when modal opens
  useEffect(() => {
    if (isOpen && initialValues) {
      setSelectedTable(initialValues.table);
      setSelectedColumn(initialValues.column);
      setCascadeOptions({
        onDelete: initialValues.onDelete || 'CASCADE',
        onUpdate: initialValues.onUpdate || 'CASCADE'
      });
      setValue('selectedTable', initialValues.table, { shouldValidate: true });
    } else if (isOpen) {
      // When opening a new modal without initial values
      setCascadeOptions({
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }, [isOpen, initialValues, setValue]);

  // Reset values when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTable('');
      setSelectedColumn('');
      setCascadeOptions({
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/entity/all-entities`);
        const result = await response.json();
        
        if (result.success) {
          // Filter out the current table and system tables
          const filteredEntities = (result.success.data || []).filter((entity: Entity) => 
            entity.name !== currentTable && 
            !entity.name.startsWith('knex_') && 
            entity.name !== 'refresh_token'
          );
          setEntities(filteredEntities);
          setError('');
        } else {
          // Handle any error response
          const errorMessage = result.error?.message || 'Failed to fetch entities';
          setError(errorMessage);
        }
      } catch (err) {
        setError('Failed to connect to the server. Please try again.');
        console.error('Error fetching entities:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchEntities();
    }
  }, [isOpen, currentTable, API_URL]);

  const onSubmit = (data: FormData) => {
    onSelect(data.selectedTable, selectedColumn, cascadeOptions);
    onClose();
    reset();
  };

  // Handle table selection
  const handleTableSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tableName = e.target.value;
    setSelectedTable(tableName);
    setValue('selectedTable', tableName, { shouldValidate: true });

    // If a table is selected, automatically select the 'id' column
    if (tableName) {
      setSelectedColumn('id');
    } else {
      setSelectedColumn('');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">Select Foreign Key Reference</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Select Table <span className="text-meta-1">*</span>
              </label>
              <select
                {...register('selectedTable')}
                onChange={handleTableSelect}
                className={`w-full rounded border-[1.5px] ${
                  errors.selectedTable ? 'border-meta-1' : 'border-stroke'
                } bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              >
                <option value="">Select a table</option>
                {entities.map((entity) => (
                  <option key={entity.name} value={entity.name}>
                    {entity.name}
                  </option>
                ))}
              </select>
              {errors.selectedTable && (
                <p className="text-meta-1 text-sm mt-1">{errors.selectedTable.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Primary Key Column <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                value="id"
                disabled
                className="w-full rounded border-[1.5px] border-stroke bg-gray-50 dark:bg-boxdark-2 px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                The 'id' column is automatically selected as it is the primary key of the referenced table.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-black dark:text-white">
                Cascade Options
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={cascadeOptions.onDelete === 'CASCADE'}
                    onChange={(e) => setCascadeOptions(prev => ({
                      ...prev,
                      onDelete: e.target.checked ? 'CASCADE' : ''
                    }))}
                    className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">Cascade on Delete</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={cascadeOptions.onUpdate === 'CASCADE'}
                    onChange={(e) => setCascadeOptions(prev => ({
                      ...prev,
                      onUpdate: e.target.checked ? 'CASCADE' : ''
                    }))}
                    className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">Cascade on Update</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-stroke pt-4 dark:border-strokedark">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
              >
                Select
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForeignKeyModal; 