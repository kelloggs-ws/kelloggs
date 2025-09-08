import { useEffect, useState } from "react"
import Dashboard from "./components/Dashboard"
import { Input, Button, Box } from "@chakra-ui/react"

export default function App() {
  const [user, setUser] = useState("Darren@apparel.com")
  const [query, setQuery] = useState("Products from last 2 months")
  const [cartData, setCartData] = useState<any[]>([])

  const fetchData = async () => {
    try {
      const res = await fetch("https://ddc66e7c4a0c.ngrok-free.app/check_cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, query }),
      })
      const json = await res.json()
      if (json.results) {
        setCartData(json.results)
      } else {
        setCartData([])
      }
    } catch (err) {
      console.error(err)
      setCartData([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box p={6}>
      <Box mb={4} display="flex" gap={2}>
        <Input
          placeholder="Type your query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button colorScheme="blue" onClick={fetchData}>
          Generate Report
        </Button>
      </Box>

      <Dashboard cartData={cartData} />
    </Box>
  )
}
