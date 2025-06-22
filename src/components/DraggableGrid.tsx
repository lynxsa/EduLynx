'use client';

import React, { useState, useCallback } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DraggableGridProps {
  children: React.ReactNode[];
  layouts?: { [key: string]: Layout[] };
  onLayoutChange?: (layout: Layout[], layouts: { [key: string]: Layout[] }) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
  rowHeight?: number;
}

const defaultLayouts = {
  lg: [
    { i: 'quick-actions', x: 0, y: 0, w: 12, h: 2, static: true },
    { i: 'total-students', x: 0, y: 2, w: 3, h: 3 },
    { i: 'active-teachers', x: 3, y: 2, w: 3, h: 3 },
    { i: 'attendance', x: 6, y: 2, w: 3, h: 3 },
    { i: 'assignments-due', x: 9, y: 2, w: 3, h: 3 },
    { i: 'insights', x: 0, y: 5, w: 6, h: 4 },
    { i: 'dropout-risk', x: 6, y: 5, w: 6, h: 4 },
    { i: 'prof-lynx', x: 0, y: 9, w: 4, h: 4 },
    { i: 'system-alerts', x: 4, y: 9, w: 4, h: 4 },
    { i: 'revenue', x: 8, y: 9, w: 4, h: 4 },
  ],
  md: [
    { i: 'quick-actions', x: 0, y: 0, w: 8, h: 2, static: true },
    { i: 'total-students', x: 0, y: 2, w: 4, h: 3 },
    { i: 'active-teachers', x: 4, y: 2, w: 4, h: 3 },
    { i: 'attendance', x: 0, y: 5, w: 4, h: 3 },
    { i: 'assignments-due', x: 4, y: 5, w: 4, h: 3 },
    { i: 'insights', x: 0, y: 8, w: 8, h: 4 },
    { i: 'dropout-risk', x: 0, y: 12, w: 8, h: 4 },
    { i: 'prof-lynx', x: 0, y: 16, w: 8, h: 4 },
    { i: 'system-alerts', x: 0, y: 20, w: 4, h: 4 },
    { i: 'revenue', x: 4, y: 20, w: 4, h: 4 },
  ],
  sm: [
    { i: 'quick-actions', x: 0, y: 0, w: 6, h: 2, static: true },
    { i: 'total-students', x: 0, y: 2, w: 6, h: 3 },
    { i: 'active-teachers', x: 0, y: 5, w: 6, h: 3 },
    { i: 'attendance', x: 0, y: 8, w: 6, h: 3 },
    { i: 'assignments-due', x: 0, y: 11, w: 6, h: 3 },
    { i: 'insights', x: 0, y: 14, w: 6, h: 4 },
    { i: 'dropout-risk', x: 0, y: 18, w: 6, h: 4 },
    { i: 'prof-lynx', x: 0, y: 22, w: 6, h: 4 },
    { i: 'system-alerts', x: 0, y: 26, w: 6, h: 4 },
    { i: 'revenue', x: 0, y: 30, w: 6, h: 4 },
  ],
};

export function DraggableGrid({
  children,
  layouts = defaultLayouts,
  onLayoutChange,
  isDraggable = true,
  isResizable = true,
  rowHeight = 60,
}: DraggableGridProps) {
  const [currentLayouts, setCurrentLayouts] = useState(layouts);

  const handleLayoutChange = useCallback(
    (layout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
      setCurrentLayouts(allLayouts);
      onLayoutChange?.(layout, allLayouts);
    },
    [onLayoutChange]
  );

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={currentLayouts}
      onLayoutChange={handleLayoutChange}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={rowHeight}
      isDraggable={isDraggable}
      isResizable={isResizable}
      margin={[16, 16]}
      containerPadding={[16, 16]}
      useCSSTransforms={true}
    >
      {children}
    </ResponsiveGridLayout>
  );
}
