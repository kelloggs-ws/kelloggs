import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import { Input, Button, Box } from "@chakra-ui/react";
export default function App() {
    const [user, setUser] = useState("Darren@apparel.com");
    const [query, setQuery] = useState("Products from last 2 months");
    const [cartData, setCartData] = useState([]);
    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:8000/check_cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user, query }),
            });
            const json = await res.json();
            if (json.results) {
                setCartData(json.results);
            }
            else {
                setCartData([]);
            }
        }
        catch (err) {
            console.error(err);
            setCartData([]);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (_jsxs(Box, { p: 6, children: [_jsxs(Box, { mb: 4, display: "flex", gap: 2, children: [_jsx(Input, { placeholder: "Type your query", value: query, onChange: (e) => setQuery(e.target.value) }), _jsx(Button, { colorScheme: "blue", onClick: fetchData, children: "Generate Report" })] }), _jsx(Dashboard, { cartData: cartData })] }));
}
