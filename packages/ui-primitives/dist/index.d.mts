import * as React from 'react';
import React__default from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
declare const Card: React.FC<CardProps>;

interface ChartWrapperProps {
    width?: number | string;
    height?: number | string;
    children: React.ReactElement;
}
declare const ChartWrapper: React.FC<ChartWrapperProps>;

interface ErrorBoundaryProps {
    fallback?: React__default.ReactNode;
    children: React__default.ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
}
declare class ErrorBoundary extends React__default.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React__default.ErrorInfo): void;
    render(): string | number | boolean | Iterable<React__default.ReactNode> | React__default.JSX.Element;
}

interface ModalProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    title?: string;
    children: React.ReactNode;
}
declare const Modal: React.FC<ModalProps>;

interface TableProps<T> extends React.TableHTMLAttributes<HTMLTableElement> {
    columns: {
        header: React.ReactNode;
        accessor: keyof T;
    }[];
    data: T[];
}
declare function Table<T>({ columns, data, className, ...props }: TableProps<T>): React.JSX.Element;

interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
}
declare const Tabs: React.FC<TabsProps>;
declare const TabsList: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const TabsTrigger: React.ForwardRefExoticComponent<TabsPrimitive.TabsTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const TabsContent: React.ForwardRefExoticComponent<TabsPrimitive.TabsContentProps & React.RefAttributes<HTMLDivElement>>;

export { Card, type CardProps, ChartWrapper, type ChartWrapperProps, ErrorBoundary, Modal, type ModalProps, Table, type TableProps, Tabs, TabsContent, TabsList, type TabsProps, TabsTrigger };
