import {
    Box,
    Grid,
    Text,
    Heading,
    Button,
    Badge,
    VStack,
  } from "@chakra-ui/react"
  import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
  } from "recharts"
  import { useMemo } from "react"
  
  type Item = {
    product: string
    quantity: number
    base_price: string
    total_price: string
    time: string
    promotion: boolean
    stock_available: boolean
    price_drop: boolean
    score: number
  }
  
  type DashboardProps = {
    cartData: Item[]
  }
  
  // ----------------------------
  // Helper: parse price strings
  // ----------------------------
  const parsePrice = (price: string | number | undefined) => {
    if (!price) return 0
    if (typeof price === "number") return price
    const cleaned = price.replace(/[$€¥₽,]/g, "")
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }
  
  // Color palette for pie chart
  const COLORS = ["#3182CE", "#38A169", "#DD6B20", "#805AD5", "#E53E3E", "#319795"]
  
  export default function Dashboard({ cartData }: DashboardProps) {
    // ----------------------------
    // 1️⃣ Compute KPIs
    // ----------------------------
    const kpis = useMemo(() => {
      const totalProducts = cartData.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      )
      const totalValue = cartData.reduce(
        (sum, item) => sum + parsePrice(item.total_price || item.base_price),
        0
      )
      const uniqueProducts = new Set(cartData.map((i) => i.product)).size
      const allProducts = Array.from(new Set(cartData.map((i) => i.product)))
  
      return { totalProducts, totalValue, uniqueProducts, allProducts }
    }, [cartData])
  
    // ----------------------------
    // 2️⃣ Monthly total value trend
    // ----------------------------
    const trendData = useMemo(() => {
      const months: Record<string, number> = {}
      cartData.forEach((item) => {
        const month = new Date(item.time).toLocaleString("default", { month: "short" })
        months[month] = (months[month] || 0) + parsePrice(item.total_price || item.base_price)
      })
      return Object.entries(months).map(([month, value]) => ({ month, value }))
    }, [cartData])
  
    // ----------------------------
    // 3️⃣ Products per month
    // ----------------------------
    const productsPerMonth = useMemo(() => {
      const counts: Record<string, number> = {}
      cartData.forEach((item) => {
        const month = new Date(item.time).toLocaleString("default", { month: "short" })
        counts[month] = (counts[month] || 0) + 1
      })
      return Object.entries(counts).map(([month, count]) => ({ month, count }))
    }, [cartData])
  
    // ----------------------------
    // 4️⃣ Product Distribution (Pie Chart)
    // ----------------------------
    const productDistribution = useMemo(() => {
      const counts: Record<string, number> = {}
      cartData.forEach((item) => {
        counts[item.product] = (counts[item.product] || 0) + item.quantity
      })
      return Object.entries(counts).map(([product, value]) => ({ product, value }))
    }, [cartData])
  
    // ----------------------------
    // 5️⃣ Generate Insights
    // ----------------------------
    const insights = useMemo(() => {
      // Top-selling product
      const topProduct = productDistribution.reduce(
        (prev, curr) => (curr.value > prev.value ? curr : prev),
        { product: "", value: 0 }
      )
  
      // Month with highest sales
      const topMonth = trendData.reduce(
        (prev, curr) => (curr.value > prev.value ? curr : prev),
        { month: "", value: 0 }
      )
  
      // Average cart value
      const avgCartValue = kpis.totalProducts ? kpis.totalValue / kpis.totalProducts : 0
  
      return { topProduct, topMonth, avgCartValue }
    }, [productDistribution, trendData, kpis])
  
    // ----------------------------
    // 6️⃣ Render Dashboard
    // ----------------------------
    if (cartData.length === 0) {
      return (
        <Box p={6}>
          <Heading size="md" mb={4}>Dashboard</Heading>
          <Text>No data available for the selected query.</Text>
        </Box>
      )
    }
  
    return (
      <Box p={6} bg="gray.100" minH="100vh">
        <Heading mb={6}>Dashboard</Heading>
  
        {/* KPI Cards */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6} mb={6}>
          <Box bgGradient="linear(to-r, teal.400, teal.300)" p={4} rounded="xl" shadow="md" color="white">
            <Text fontSize="sm">Total Products</Text>
            <Text fontSize="2xl" fontWeight="bold">{kpis.totalProducts}</Text>
          </Box>
  
          <Box bgGradient="linear(to-r, blue.400, blue.300)" p={4} rounded="xl" shadow="md" color="white">
            <Text fontSize="sm">Total Value</Text>
            <Text fontSize="2xl" fontWeight="bold">${kpis.totalValue.toFixed(2)}</Text>
          </Box>
  
          <Box bgGradient="linear(to-r, purple.400, purple.300)" p={4} rounded="xl" shadow="md" color="white">
            <Text fontSize="sm">Unique Products</Text>
            <Text fontSize="2xl" fontWeight="bold">{kpis.uniqueProducts}</Text>
          </Box>
  
          {/* Scrollable All Products */}
          <Box
            bgGradient="linear(to-r, orange.400, orange.300)"
            p={4}
            rounded="xl"
            shadow="md"
            color="white"
            maxH="200px"
            overflowY="auto"
          >
            <Text fontSize="sm" mb={2}>All Products</Text>
            <VStack spacing={1} align="start">
              {kpis.allProducts.map((p) => (
                <Badge key={p} colorScheme="yellow" fontSize="xs" px={2} py={1} w="full" textAlign="center">
                  {p}
                </Badge>
              ))}
            </VStack>
          </Box>
        </Grid>
  
        {/* Charts */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={6}>
          {/* Monthly Value Trend */}
          <Box bg="white" p={4} rounded="xl" shadow="md">
            <Text fontSize="sm" mb={2}>Monthly Value Trend</Text>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3182CE" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
  
          {/* Products per Month */}
          <Box bg="white" p={4} rounded="xl" shadow="md">
            <Text fontSize="sm" mb={2}>Products per Month</Text>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={productsPerMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#38A169" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
  
          {/* Product Distribution Pie Chart */}
          <Box
            bg="white"
            p={4}
            rounded="xl"
            shadow="md"
            // Dynamic height based on number of products
            height={Math.max(250, productDistribution.length * 40)}
          >
            <Text fontSize="sm" mb={2}>Product Distribution</Text>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productDistribution}
                  dataKey="value"
                  nameKey="product"
                  outerRadius={80}
                  labelLine={false}
                  label={false} // remove slice labels to reduce clutter
                >
                  {productDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
  
        {/* Insights Section */}
        <Box bg="white" p={4} rounded="xl" shadow="md" mb={6}>
          <Heading size="md" mb={3}>Insights</Heading>
          <Text>- Top-selling product: <b>{insights.topProduct.product}</b> ({insights.topProduct.value} units)</Text>
          <Text>- Month with highest sales: <b>{insights.topMonth.month}</b> (${insights.topMonth.value.toFixed(2)})</Text>
          <Text>- Average cart value per product: <b>${insights.avgCartValue.toFixed(2)}</b></Text>
        </Box>
  
        <Button colorScheme="blue">Download Report</Button>
      </Box>
    )
  }
  