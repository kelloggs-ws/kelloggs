import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Grid, Text, Heading, Button, Badge, VStack, } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, } from "recharts";
import { useMemo } from "react";
// ----------------------------
// Helper: parse price strings
// ----------------------------
const parsePrice = (price) => {
    if (!price)
        return 0;
    if (typeof price === "number")
        return price;
    const cleaned = price.replace(/[$€¥₽,]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
};
// Color palette for pie chart
const COLORS = ["#3182CE", "#38A169", "#DD6B20", "#805AD5", "#E53E3E", "#319795"];
export default function Dashboard({ cartData }) {
    // ----------------------------
    // 1️⃣ Compute KPIs
    // ----------------------------
    const kpis = useMemo(() => {
        const totalProducts = cartData.reduce((sum, item) => sum + Number(item.quantity), 0);
        const totalValue = cartData.reduce((sum, item) => sum + parsePrice(item.total_price || item.base_price), 0);
        const uniqueProducts = new Set(cartData.map((i) => i.product)).size;
        const allProducts = Array.from(new Set(cartData.map((i) => i.product)));
        return { totalProducts, totalValue, uniqueProducts, allProducts };
    }, [cartData]);
    // ----------------------------
    // 2️⃣ Monthly total value trend
    // ----------------------------
    const trendData = useMemo(() => {
        const months = {};
        cartData.forEach((item) => {
            const month = new Date(item.time).toLocaleString("default", { month: "short" });
            months[month] = (months[month] || 0) + parsePrice(item.total_price || item.base_price);
        });
        return Object.entries(months).map(([month, value]) => ({ month, value }));
    }, [cartData]);
    // ----------------------------
    // 3️⃣ Products per month
    // ----------------------------
    const productsPerMonth = useMemo(() => {
        const counts = {};
        cartData.forEach((item) => {
            const month = new Date(item.time).toLocaleString("default", { month: "short" });
            counts[month] = (counts[month] || 0) + 1;
        });
        return Object.entries(counts).map(([month, count]) => ({ month, count }));
    }, [cartData]);
    // ----------------------------
    // 4️⃣ Product Distribution (Pie Chart)
    // ----------------------------
    const productDistribution = useMemo(() => {
        const counts = {};
        cartData.forEach((item) => {
            counts[item.product] = (counts[item.product] || 0) + item.quantity;
        });
        return Object.entries(counts).map(([product, value]) => ({ product, value }));
    }, [cartData]);
    // ----------------------------
    // 5️⃣ Generate Insights
    // ----------------------------
    const insights = useMemo(() => {
        // Top-selling product
        const topProduct = productDistribution.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), { product: "", value: 0 });
        // Month with highest sales
        const topMonth = trendData.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), { month: "", value: 0 });
        // Average cart value
        const avgCartValue = kpis.totalProducts ? kpis.totalValue / kpis.totalProducts : 0;
        return { topProduct, topMonth, avgCartValue };
    }, [productDistribution, trendData, kpis]);
    // ----------------------------
    // 6️⃣ Render Dashboard
    // ----------------------------
    if (cartData.length === 0) {
        return (_jsxs(Box, { p: 6, children: [_jsx(Heading, { size: "md", mb: 4, children: "Dashboard" }), _jsx(Text, { children: "No data available for the selected query." })] }));
    }
    return (_jsxs(Box, { p: 6, bg: "gray.100", minH: "100vh", children: [_jsx(Heading, { mb: 6, children: "Dashboard" }), _jsxs(Grid, { templateColumns: { base: "1fr", md: "repeat(4, 1fr)" }, gap: 6, mb: 6, children: [_jsxs(Box, { bgGradient: "linear(to-r, teal.400, teal.300)", p: 4, rounded: "xl", shadow: "md", color: "white", children: [_jsx(Text, { fontSize: "sm", children: "Total Products" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: kpis.totalProducts })] }), _jsxs(Box, { bgGradient: "linear(to-r, blue.400, blue.300)", p: 4, rounded: "xl", shadow: "md", color: "white", children: [_jsx(Text, { fontSize: "sm", children: "Total Value" }), _jsxs(Text, { fontSize: "2xl", fontWeight: "bold", children: ["$", kpis.totalValue.toFixed(2)] })] }), _jsxs(Box, { bgGradient: "linear(to-r, purple.400, purple.300)", p: 4, rounded: "xl", shadow: "md", color: "white", children: [_jsx(Text, { fontSize: "sm", children: "Unique Products" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: kpis.uniqueProducts })] }), _jsxs(Box, { bgGradient: "linear(to-r, orange.400, orange.300)", p: 4, rounded: "xl", shadow: "md", color: "white", maxH: "200px", overflowY: "auto", children: [_jsx(Text, { fontSize: "sm", mb: 2, children: "All Products" }), _jsx(VStack, { spacing: 1, align: "start", children: kpis.allProducts.map((p) => (_jsx(Badge, { colorScheme: "yellow", fontSize: "xs", px: 2, py: 1, w: "full", textAlign: "center", children: p }, p))) })] })] }), _jsxs(Grid, { templateColumns: { base: "1fr", md: "repeat(3, 1fr)" }, gap: 6, mb: 6, children: [_jsxs(Box, { bg: "white", p: 4, rounded: "xl", shadow: "md", children: [_jsx(Text, { fontSize: "sm", mb: 2, children: "Monthly Value Trend" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(LineChart, { data: trendData, children: [_jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "value", stroke: "#3182CE" })] }) })] }), _jsxs(Box, { bg: "white", p: 4, rounded: "xl", shadow: "md", children: [_jsx(Text, { fontSize: "sm", mb: 2, children: "Products per Month" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: productsPerMonth, children: [_jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "count", fill: "#38A169" })] }) })] }), _jsxs(Box, { bg: "white", p: 4, rounded: "xl", shadow: "md", 
                        // Dynamic height based on number of products
                        height: Math.max(250, productDistribution.length * 40), children: [_jsx(Text, { fontSize: "sm", mb: 2, children: "Product Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: productDistribution, dataKey: "value", nameKey: "product", outerRadius: 80, labelLine: false, label: false, children: productDistribution.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, { verticalAlign: "bottom", height: 36 })] }) })] })] }), _jsxs(Box, { bg: "white", p: 4, rounded: "xl", shadow: "md", mb: 6, children: [_jsx(Heading, { size: "md", mb: 3, children: "Insights" }), _jsxs(Text, { children: ["- Top-selling product: ", _jsx("b", { children: insights.topProduct.product }), " (", insights.topProduct.value, " units)"] }), _jsxs(Text, { children: ["- Month with highest sales: ", _jsx("b", { children: insights.topMonth.month }), " ($", insights.topMonth.value.toFixed(2), ")"] }), _jsxs(Text, { children: ["- Average cart value per product: ", _jsxs("b", { children: ["$", insights.avgCartValue.toFixed(2)] })] })] }), _jsx(Button, { colorScheme: "blue", children: "Download Report" })] }));
}
