'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Paper,
  Table,
  Badge,
  Button,
  ActionIcon,
  TextInput,
  Skeleton,
  Card,
  SimpleGrid,
  Flex,
  Tooltip,
  Menu,
} from '@mantine/core'
import {
  IconSearch,
  IconPlus,
  IconPhoto,
  IconDots,
  IconPackages,
  IconCube,
  IconTag,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useDebouncedValue } from '@mantine/hooks'
import { usePermissions } from '@/hooks/usePermissions'
import {
  getProducts,
  type Product,
  type ProductFilters,
} from '@/utils/api'

export default function VariantsPage() {
  const { hasPermission, isSuperAdmin } = usePermissions()

  // Permission check
  if (!isSuperAdmin() && !hasPermission('catalog.products.view')) {
    return (
      <Stack p="xl">
        <Paper withBorder p="xl" shadow="sm" ta="center">
          <Title order={3} className="text-xl md:text-2xl">Access Denied</Title>
          <Text c="dimmed" className="text-sm md:text-base">You do not have permission to view variants</Text>
        </Paper>
      </Stack>
    )
  }

  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300)
  const [pagination, setPagination] = useState({ page: 1, total: 0, perPage: 20 })

  // Fetch products with variants
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const filters: ProductFilters = {
        search: debouncedSearch || undefined,
        per_page: pagination.perPage,
        page: pagination.page,
      }

      const response = await getProducts(filters)

      // Handle paginated response
      if (response.data) {
        const productsData = response.data.data || response.data
        // Filter products that have variants
        const productsWithVariants = productsData.filter((p: Product) => p.variants && p.variants.length > 0)
        setProducts(productsWithVariants)
        if (response.data.total) {
          setPagination((prev) => ({ ...prev, total: response.data.total }))
        }
      } else {
        const productsData = response.data || []
        const productsWithVariants = productsData.filter((p: Product) => p.variants && p.variants.length > 0)
        setProducts(productsWithVariants)
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load variants',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, pagination.page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Handle add new variant
  const handleAddVariant = () => {
    window.location.href = '/admin/catalog/products/create'
  }

  // Calculate total variants for a product
  const getTotalVariants = useCallback((product: Product) => {
    return product.variants?.length || 0
  }, [])

  // Memoized product cards for mobile
  const productCards = useMemo(() => {
    return products.map((product) => (
      <Card key={product.id} withBorder p="md" shadow="sm">
        <Stack gap="sm">
          {/* Product Image & Basic Info */}
          <Group justify="space-between" align="flex-start">
            <Group gap="sm">
              <Box
                w={60}
                h={60}
                className="bg-gray-100 rounded-md flex items-center justify-center"
              >
                {product.thumbnail ? (
                  <Box
                    component="img"
                    src={product.thumbnail.filePath}
                    alt={product.name}
                    w={60}
                    h={60}
                    style={{ objectFit: 'cover', borderRadius: '6px' }}
                  />
                ) : (
                  <IconPhoto size={24} className="text-gray-400" />
                )}
              </Box>
              <Box>
                <Text className="text-sm md:text-base" fw={500} lineClamp={1}>
                  {product.name}
                </Text>
                {product.category && (
                  <Text className="text-xs md:text-sm" c="dimmed">
                    {product.category.name}
                  </Text>
                )}
              </Box>
            </Group>
          </Group>

          {/* Variants Count */}
          <Group justify="space-between">
            <Text className="text-xs md:text-sm" c="dimmed">
              Variants:
            </Text>
            <Badge
              leftSection={<IconCube size={12} />}
              className="text-sm md:text-base"
            >
              {getTotalVariants(product)}
            </Badge>
          </Group>

          {/* Actions */}
          <Group gap="xs">
            <Button
              variant="light"
              size="xs"
              radius="xl"
              leftSection={<IconTag size={14} />}
              onClick={() => window.location.href = `/admin/catalog/products/${product.id}/edit`}
              className="flex-1"
            >
              Manage
            </Button>
            <Menu shadow="md" width={160} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="light" size="lg">
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Actions</Menu.Label>
                <Menu.Item
                  leftSection={<IconTag size={16} />}
                  onClick={() => window.location.href = `/admin/catalog/products/${product.id}/edit`}
                >
                  Manage Variants
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconPackages size={16} />}
                  onClick={() => window.location.href = `/admin/catalog/products/${product.id}`}
                >
                  View Details
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Stack>
      </Card>
    ))
  }, [products, getTotalVariants])

  // Loading state
  if (loading) {
    return (
      <Box p={{ base: 'md', md: 'xl' }}>
        <Stack gap="md">
          {/* Header Skeleton */}
          <Group justify="space-between">
            <Skeleton height={40} width={200} />
            <Skeleton height={36} width={120} />
          </Group>

          {/* Filters Skeleton */}
          <Skeleton height={50} radius="md" />

          {/* Table Skeleton */}
          <Paper withBorder p="0">
            {[1, 2, 3, 4, 5].map((i) => (
              <Group key={i} p="md" gap="md">
                <Skeleton height={48} width={48} circle />
                <Skeleton height={16} flex={1} />
                <Skeleton height={16} width={100} />
                <Skeleton height={16} width={80} />
                <Skeleton height={30} width={30} />
              </Group>
            ))}
          </Paper>
        </Stack>
      </Box>
    )
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack gap="md">
        {/* Header */}
        <Flex justify="space-between" align="center" direction={{ base: 'column', sm: 'row' }} gap="sm">
          <Group>
            <IconTag size={32} className="text-blue-600" />
            <div>
              <Title order={1} className="text-lg md:text-xl lg:text-2xl">
                Product Variants
              </Title>
              <Text c="dimmed" className="text-sm md:text-base">
                Manage product variants and SKUs ({products.length} products)
              </Text>
            </div>
          </Group>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={handleAddVariant}
            className="text-sm md:text-base"
          >
            Add New Variant
          </Button>
        </Flex>

        {/* Filters */}
        <Paper withBorder p="md">
          <TextInput
            placeholder="Search products..."
            leftSection={<IconSearch size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />
        </Paper>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Paper withBorder p="0">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Variants</Table.Th>
                  <Table.Th ta="center">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {products.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4} ta="center">
                      <Stack py="xl" align="center" gap="sm">
                        <IconTag size={48} className="text-gray-300" />
                        <Text c="dimmed" className="text-sm md:text-base">
                          No variants found
                        </Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  products.map((product) => (
                    <Table.Tr key={product.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Box
                            w={40}
                            h={40}
                            className="bg-gray-100 rounded flex items-center justify-center"
                          >
                            {product.thumbnail ? (
                              <Box
                                component="img"
                                src={product.thumbnail.filePath}
                                alt={product.name}
                                w={40}
                                h={40}
                                style={{ objectFit: 'cover', borderRadius: '4px' }}
                              />
                            ) : (
                              <IconPhoto size={20} className="text-gray-400" />
                            )}
                          </Box>
                          <Box>
                            <Text className="text-sm md:text-base" fw={500} lineClamp={1}>
                              {product.name}
                            </Text>
                            {product.brand && (
                              <Text className="text-xs md:text-sm" c="dimmed">
                                {product.brand.name}
                              </Text>
                            )}
                          </Box>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        {product.category ? (
                          <Text className="text-sm md:text-base">{product.category.name}</Text>
                        ) : (
                          <Text className="text-sm md:text-base" c="dimmed">-</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          leftSection={<IconCube size={12} />}
                          className="text-sm md:text-base"
                        >
                          {getTotalVariants(product)}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Group gap="xs" justify="center" wrap="nowrap">
                          <Tooltip label="Manage Variants">
                            <ActionIcon
                              size="lg"
                              variant="light"
                              color="blue"
                              onClick={() => window.location.href = `/admin/catalog/products/${product.id}/edit`}
                            >
                              <IconTag size={18} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="View Details">
                            <ActionIcon
                              size="lg"
                              variant="light"
                              color="gray"
                              onClick={() => window.location.href = `/admin/catalog/products/${product.id}`}
                            >
                              <IconPackages size={18} />
                            </ActionIcon>
                          </Tooltip>
                          <Menu shadow="md" width={160} position="bottom-end">
                            <Menu.Target>
                              <ActionIcon size="lg" variant="light">
                                <IconDots size={18} />
                              </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                              <Menu.Label>Actions</Menu.Label>
                              <Menu.Item
                                leftSection={<IconTag size={16} />}
                                onClick={() => window.location.href = `/admin/catalog/products/${product.id}/edit`}
                              >
                                Manage Variants
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconPackages size={16} />}
                                onClick={() => window.location.href = `/admin/catalog/products/${product.id}`}
                              >
                                View Details
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Paper>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          <SimpleGrid cols={{ base: 1, xs: 2 }}>
            {productCards}
          </SimpleGrid>
        </div>

        {/* Empty state */}
        {products.length === 0 && !loading && (
          <Paper withBorder p="xl" ta="center">
            <Stack align="center" gap="sm">
              <IconTag size={64} className="text-gray-300" />
              <Text className="text-base md:text-lg" fw={500}>
                No variants found
              </Text>
              <Text className="text-sm md:text-base" c="dimmed">
                Products with variants will appear here
              </Text>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={handleAddVariant}
                mt="sm"
              >
                Add New Variant
              </Button>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  )
}
