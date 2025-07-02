// src/components/Card.tsx
import * as React from "react";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/Card.tsx
var Card = ({ className, children, ...props }) => {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn("bg-card text-card-foreground rounded-lg border p-4 shadow-sm", className),
      ...props
    },
    children
  );
};

// src/components/ChartWrapper.tsx
import * as React2 from "react";
import { ResponsiveContainer } from "recharts";
var ChartWrapper = ({
  width = "100%",
  height = 300,
  children
}) => /* @__PURE__ */ React2.createElement("div", { style: { width, height } }, /* @__PURE__ */ React2.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, children));

// src/components/ErrorBoundary.tsx
import React3 from "react";
var ErrorBoundary = class extends React3.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || /* @__PURE__ */ React3.createElement("div", null, "Something went wrong.");
    }
    return this.props.children;
  }
};

// src/components/Modal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import * as React4 from "react";
var Modal = ({ open, onOpenChange, title, children }) => /* @__PURE__ */ React4.createElement(Dialog.Root, { open, onOpenChange }, /* @__PURE__ */ React4.createElement(Dialog.Overlay, { className: "fixed inset-0 bg-black/50" }), /* @__PURE__ */ React4.createElement(
  Dialog.Content,
  {
    className: cn(
      "fixed top-[50%] left-[50%] w-full max-w-md -translate-x-[50%] -translate-y-[50%] rounded-lg bg-white p-6 shadow-lg"
    )
  },
  title && /* @__PURE__ */ React4.createElement(Dialog.Title, { className: "text-lg font-semibold mb-4" }, title),
  children,
  /* @__PURE__ */ React4.createElement(Dialog.Close, { className: "absolute top-4 right-4" }, "\u2715")
));

// src/components/Table.tsx
import * as React5 from "react";
function Table({ columns, data, className, ...props }) {
  return /* @__PURE__ */ React5.createElement("table", { className: cn("min-w-full divide-y divide-border", className), ...props }, /* @__PURE__ */ React5.createElement("thead", { className: "bg-muted" }, /* @__PURE__ */ React5.createElement("tr", null, columns.map((col, idx) => /* @__PURE__ */ React5.createElement("th", { key: idx, className: "px-4 py-2 text-left text-sm font-medium text-foreground" }, col.header)))), /* @__PURE__ */ React5.createElement("tbody", { className: "divide-y divide-border" }, data.map((row, idx) => /* @__PURE__ */ React5.createElement("tr", { key: idx, className: "hover:bg-accent/10" }, columns.map((col, cidx) => /* @__PURE__ */ React5.createElement("td", { key: cidx, className: "px-4 py-2 text-sm text-foreground" }, String(row[col.accessor] ?? "")))))));
}

// src/components/Tabs.tsx
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React6 from "react";
var Tabs = ({ defaultValue, children }) => /* @__PURE__ */ React6.createElement(TabsPrimitive.Root, { defaultValue, className: "flex flex-col" }, children);
var TabsList = React6.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ React6.createElement(
    TabsPrimitive.List,
    {
      ref,
      className: cn("inline-flex border-b border-border", className),
      ...props
    }
  )
);
TabsList.displayName = "TabsList";
var TabsTrigger = React6.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ React6.createElement(
    TabsPrimitive.Trigger,
    {
      ref,
      className: cn(
        "px-4 py-2 text-sm font-medium text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary",
        className
      ),
      ...props
    }
  )
);
TabsTrigger.displayName = "TabsTrigger";
var TabsContent = React6.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ React6.createElement(
    TabsPrimitive.Content,
    {
      ref,
      className: cn("mt-2 focus:outline-none", className),
      ...props
    }
  )
);
TabsContent.displayName = "TabsContent";
export {
  Card,
  ChartWrapper,
  ErrorBoundary,
  Modal,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
};
//# sourceMappingURL=index.mjs.map