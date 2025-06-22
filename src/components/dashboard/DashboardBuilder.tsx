'use client';

import { useTheme } from '@/styles/theme';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';

interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'heatmap' | 'treemap';
  title: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  config: any;
  position: { x: number; y: number };
}

interface DashboardBuilderProps {
  className?: string;
  onSave?: (layout: DashboardWidget[]) => void;
}

const availableWidgets = [
  {
    id: 'performance-chart',
    type: 'chart' as const,
    title: 'Performance Chart',
    size: 'large' as const,
    icon: '📊',
    description: 'Student performance over time',
  },
  {
    id: 'attendance-metric',
    type: 'metric' as const,
    title: 'Attendance Rate',
    size: 'small' as const,
    icon: '✅',
    description: 'Current attendance percentage',
  },
  {
    id: 'grade-heatmap',
    type: 'heatmap' as const,
    title: 'Grade Distribution',
    size: 'medium' as const,
    icon: '🔥',
    description: 'Grades by subject and class',
  },
  {
    id: 'subject-treemap',
    type: 'treemap' as const,
    title: 'Subject Enrollment',
    size: 'large' as const,
    icon: '🌳',
    description: 'Student distribution by subject',
  },
  {
    id: 'student-table',
    type: 'table' as const,
    title: 'Student List',
    size: 'xlarge' as const,
    icon: '📋',
    description: 'Detailed student information',
  },
];

const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-2 row-span-2',
  large: 'col-span-3 row-span-2',
  xlarge: 'col-span-4 row-span-3',
};

export function DashboardBuilder({ className = '', onSave }: DashboardBuilderProps) {
  const { actualTheme } = useTheme();
  const [isBuilding, setIsBuilding] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;

      // Adding new widget from palette
      if (source.droppableId === 'widget-palette' && destination.droppableId === 'dashboard-grid') {
        const widgetTemplate = availableWidgets[source.index];
        const newWidget: DashboardWidget = {
          id: `${widgetTemplate.id}-${Date.now()}`,
          type: widgetTemplate.type,
          title: widgetTemplate.title,
          size: widgetTemplate.size,
          config: {},
          position: { x: 0, y: 0 },
        };

        setWidgets(prev => [...prev, newWidget]);
        return;
      }

      // Reordering widgets in dashboard
      if (source.droppableId === 'dashboard-grid' && destination.droppableId === 'dashboard-grid') {
        const items = Array.from(widgets);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);
        setWidgets(items);
      }
    },
    [widgets]
  );

  const removeWidget = useCallback(
    (widgetId: string) => {
      setWidgets(prev => prev.filter(w => w.id !== widgetId));
      if (selectedWidget === widgetId) {
        setSelectedWidget(null);
      }
    },
    [selectedWidget]
  );

  const updateWidgetSize = useCallback((widgetId: string, newSize: DashboardWidget['size']) => {
    setWidgets(prev => prev.map(w => (w.id === widgetId ? { ...w, size: newSize } : w)));
  }, []);

  const toggleBuildMode = () => {
    setIsBuilding(!isBuilding);
    if (!isBuilding) {
      setSelectedWidget(null);
    }
  };

  const saveDashboard = () => {
    onSave?.(widgets);
    setIsBuilding(false);
    setSelectedWidget(null);
  };

  const clearDashboard = () => {
    setWidgets([]);
    setSelectedWidget(null);
  };

  const renderWidget = (widget: DashboardWidget, index: number) => {
    const isSelected = selectedWidget === widget.id;

    return (
      <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!isBuilding}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => isBuilding && setSelectedWidget(widget.id)}
            className={`
              ${sizeClasses[widget.size]}
              bg-white dark:bg-gray-800 rounded-xl shadow-sm border 
              ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                  : 'border-gray-200 dark:border-gray-700'
              }
              ${isBuilding ? 'cursor-move' : ''}
              ${snapshot.isDragging ? 'shadow-lg' : ''}
              overflow-hidden relative
            `}
          >
            {/* Widget content */}
            <div className="p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {widget.title}
                </h3>
                {isBuilding && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removeWidget(widget.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Mock widget content */}
              <div className="h-full bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">
                    {availableWidgets.find(w => w.type === widget.type)?.icon || '📊'}
                  </div>
                  <div className="text-sm">{widget.type.toUpperCase()} Widget</div>
                </div>
              </div>
            </div>

            {/* Build mode overlay */}
            {isBuilding && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-500 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="text-blue-600 font-medium">Drag to reorder</div>
              </div>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Builder</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isBuilding ? 'Drag widgets to customize your dashboard' : 'View your custom dashboard'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isBuilding && (
            <>
              <button
                onClick={clearDashboard}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Clear All
              </button>
              <button
                onClick={saveDashboard}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Save Layout
              </button>
            </>
          )}
          <button
            onClick={toggleBuildMode}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              isBuilding
                ? 'text-white bg-blue-600 hover:bg-blue-700'
                : 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40'
            }`}
          >
            {isBuilding ? 'Exit Builder' : 'Customize Dashboard'}
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6">
          {/* Widget Palette */}
          <AnimatePresence>
            {isBuilding && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-fit"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Widget Palette
                </h3>

                <Droppable droppableId="widget-palette" isDropDisabled>
                  {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                      {availableWidgets.map((widget, index) => (
                        <Draggable
                          key={widget.id}
                          draggableId={`palette-${widget.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-move
                                ${
                                  snapshot.isDragging
                                    ? 'shadow-lg bg-blue-50 dark:bg-blue-900/20'
                                    : 'bg-gray-50 dark:bg-gray-700'
                                }
                              `}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{widget.icon}</span>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {widget.title}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {widget.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard Grid */}
          <div className="flex-1">
            <Droppable droppableId="dashboard-grid">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`
                    grid grid-cols-4 gap-4 min-h-96 p-4 rounded-xl border-2 border-dashed
                    ${
                      snapshot.isDraggingOver
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                        : 'border-gray-300 dark:border-gray-600'
                    }
                  `}
                >
                  {widgets.length === 0 ? (
                    <div className="col-span-4 flex items-center justify-center py-16">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="text-6xl mb-4">📊</div>
                        <div className="text-xl font-medium mb-2">
                          {isBuilding ? 'Start Building Your Dashboard' : 'No Widgets Added'}
                        </div>
                        <div className="text-sm">
                          {isBuilding
                            ? 'Drag widgets from the palette to get started'
                            : 'Click "Customize Dashboard" to add widgets'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    widgets.map((widget, index) => renderWidget(widget, index))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Widget Configuration Panel */}
      <AnimatePresence>
        {selectedWidget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Widget Settings</h4>
              <button
                onClick={() => setSelectedWidget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size
                </label>
                <select
                  value={widgets.find(w => w.id === selectedWidget)?.size}
                  onChange={e =>
                    updateWidgetSize(selectedWidget, e.target.value as DashboardWidget['size'])
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="small">Small (1x1)</option>
                  <option value="medium">Medium (2x2)</option>
                  <option value="large">Large (3x2)</option>
                  <option value="xlarge">Extra Large (4x3)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
