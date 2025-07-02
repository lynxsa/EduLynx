var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Card: () => Card,
  ChartWrapper: () => ChartWrapper,
  ErrorBoundary: () => ErrorBoundary,
  Modal: () => Modal,
  Table: () => Table,
  Tabs: () => Tabs,
  TabsContent: () => TabsContent,
  TabsList: () => TabsList,
  TabsTrigger: () => TabsTrigger
});
module.exports = __toCommonJS(src_exports);

// src/components/Card.tsx
var React = __toESM(require("react"));

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
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
var React2 = __toESM(require("react"));
var import_recharts = require("recharts");
var ChartWrapper = ({
  width = "100%",
  height = 300,
  children
}) => /* @__PURE__ */ React2.createElement("div", { style: { width, height } }, /* @__PURE__ */ React2.createElement(import_recharts.ResponsiveContainer, { width: "100%", height: "100%" }, children));

// src/components/ErrorBoundary.tsx
var import_react = __toESM(require("react"));
var ErrorBoundary = class extends import_react.default.Component {
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
      return this.props.fallback || /* @__PURE__ */ import_react.default.createElement("div", null, "Something went wrong.");
    }
    return this.props.children;
  }
};

// src/components/Modal.tsx
var Dialog = __toESM(require("@radix-ui/react-dialog"));
var React4 = __toESM(require("react"));
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
var React5 = __toESM(require("react"));
function Table({ columns, data, className, ...props }) {
  return /* @__PURE__ */ React5.createElement("table", { className: cn("min-w-full divide-y divide-border", className), ...props }, /* @__PURE__ */ React5.createElement("thead", { className: "bg-muted" }, /* @__PURE__ */ React5.createElement("tr", null, columns.map((col, idx) => /* @__PURE__ */ React5.createElement("th", { key: idx, className: "px-4 py-2 text-left text-sm font-medium text-foreground" }, col.header)))), /* @__PURE__ */ React5.createElement("tbody", { className: "divide-y divide-border" }, data.map((row, idx) => /* @__PURE__ */ React5.createElement("tr", { key: idx, className: "hover:bg-accent/10" }, columns.map((col, cidx) => /* @__PURE__ */ React5.createElement("td", { key: cidx, className: "px-4 py-2 text-sm text-foreground" }, String(row[col.accessor] ?? "")))))));
}

// src/components/Tabs.tsx
var TabsPrimitive = __toESM(require("@radix-ui/react-tabs"));
var React6 = __toESM(require("react"));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Card,
  ChartWrapper,
  ErrorBoundary,
  Modal,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
});
//# sourceMappingURL=index.js.map