import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Stack,
  Group,
  Text,
  Paper,
  Button,
  Badge,
  ScrollArea,
  Divider,
  SimpleGrid,
  Card,
  Alert,
  Box,
  Image,
  ActionIcon,
  Menu,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconBuilding,
  IconMail,
  IconPhone,
  IconBrandWhatsapp,
  IconUsers,
  IconWorld,
  IconMapPin,
  IconCoin,
  IconDots,
  IconPhoto,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import {
  getSuppliers,
  deleteSupplier,
  getProcurementProductsBySupplier,
  type Supplier
} from '@/utils/api'

export default function SupplierDetailsPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchSupplier(id)
    }
  }, [id])

  useEffect(() => {
    if (supplier?.id) {
      fetchProducts(supplier.id)
    }
  }, [supplier])

  const fetchProducts = async (supplierId: number) => {
    try {
      setProductsLoading(true)
      const response: any = await getProcurementProductsBySupplier(supplierId, { per_page: 50 })
      const productsData = response?.data?.data || response?.data || []
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setProductsLoading(false)
    }
  }

  const fetchSupplier = async (supplierId: string) => {
    try {
      setLoading(true)
      const response = await getSuppliers({ per_page: 1 })
      let supplierData: Supplier[] = []

      // Handle response structure
      if (response && typeof response === 'object' && 'status' in response) {
        if (response.status && response.data) {
          const data = response.data
          if (typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
            supplierData = data.data
          } else if (Array.isArray(data)) {
            supplierData = data
          }
        }
      } else if (Array.isArray(response)) {
        supplierData = response
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        supplierData = response.data
      }

      const found = supplierData.find((s) => s.id === parseInt(supplierId))
      if (found) {
        setSupplier(found)
      } else {
        notifications.show({
          title: 'Supplier not found',
          message: 'The requested supplier could not be found',
          color: 'red',
        })
        navigate('/procurement/suppliers')
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to load supplier',
        color: 'red',
      })
      navigate('/procurement/suppliers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    if (!supplier) return

    modals.openConfirmModal({
      title: t('procurement.suppliersPage.notifications.deleteConfirm'),
      children: (
        <Text className="text-sm md:text-base">
          {t('procurement.suppliersPage.notifications.deleteConfirmMessage', { name: supplier.name })}
        </Text>
      ),
      labels: {
        confirm: t('common.delete'),
        cancel: t('common.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteSupplier(supplier.id)
          notifications.show({
            title: t('procurement.suppliersPage.notifications.deleted'),
            message: t('procurement.suppliersPage.notifications.deletedMessage', { name: supplier.name }),
            color: 'green',
          })
          navigate('/procurement/suppliers')
        } catch (error) {
          notifications.show({
            title: t('procurement.suppliersPage.notifications.errorDeleting'),
            message: error instanceof Error ? error.message : t('common.somethingWentWrong'),
            color: 'red',
          })
        }
      },
    })
  }

  if (loading) {
    return (
      <Stack p="xl" gap="md">
        <Text className="text-lg md:text-xl lg:text-2xl">Loading...</Text>
      </Stack>
    )
  }

  if (!supplier) {
    return (
      <Stack p="xl" gap="md">
        <Alert variant="light" color="red">
          Supplier not found
        </Alert>
      </Stack>
    )
  }

  const baseUrl = window.location.origin

  return (
    <Stack p="xl" gap="md">
      {/* Header */}
      <div>
        <Text className="text-lg md:text-xl lg:text-2xl" fw={700}>
          {supplier.name}
        </Text>
        {supplier.shopName && (
          <Text className="text-sm md:text-base" c="dimmed">
            {supplier.shopName}
          </Text>
        )}
      </div>

      {/* Status Badge */}
      <Group>
        <Badge
          color={supplier.isActive ? 'green' : 'gray'}
          variant="light"
          size="lg"
          className="text-sm md:text-base"
        >
          {supplier.isActive ? t('procurement.suppliersPage.active') : t('procurement.suppliersPage.inactive')}
        </Badge>
      </Group>

      {/* Main Content */}
      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        {/* Left Column */}
        <Stack gap="md">
          {/* Basic Information */}
          <Paper withBorder p="md" radius="md">
            <Group gap="sm" mb="md">
              <IconBuilding size={20} c="blue" />
              <Text fw={600} className="text-base md:text-lg">Basic Information</Text>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Stack gap="xs">
                <Text className="text-xs md:text-sm" c="dimmed">Company Name</Text>
                <Text className="text-sm md:text-base">{supplier.name}</Text>
              </Stack>
              <Stack gap="xs">
                <Text className="text-xs md:text-sm" c="dimmed">Shop Name</Text>
                <Text className="text-sm md:text-base">{supplier.shopName || '-'}</Text>
              </Stack>
              {supplier.shopUrl && (
                <Stack gap="xs">
                  <Text className="text-xs md:text-sm" c="dimmed">Website</Text>
                  <Text
                    className="text-sm md:text-base"
                    component="a"
                    href={supplier.shopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--mantine-color-blue-filled)' }}
                  >
                    {supplier.shopUrl}
                  </Text>
                </Stack>
              )}
              {supplier.address && (
                <Stack gap="xs" style={{ gridColumn: '1 / -1' }}>
                  <Text className="text-xs md:text-sm" c="dimmed">Address</Text>
                  <Text className="text-sm md:text-base">{supplier.address}</Text>
                </Stack>
              )}
            </SimpleGrid>
          </Paper>

          {/* Contact Information */}
          <Paper withBorder p="md" radius="md">
            <Group gap="sm" mb="md">
              <IconUsers size={20} c="blue" />
              <Text fw={600} className="text-base md:text-lg">Contact Information</Text>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Stack gap="xs">
                <Text className="text-xs md:text-sm" c="dimmed">Email</Text>
                <Group gap="xs">
                  <IconMail size={14} c="dimmed" />
                  <Text className="text-sm md:text-base">{supplier.email}</Text>
                </Group>
              </Stack>
              <Stack gap="xs">
                <Text className="text-xs md:text-sm" c="dimmed">Phone</Text>
                <Group gap="xs">
                  <IconPhone size={14} c="dimmed" />
                  <Text className="text-sm md:text-base">{supplier.phone || '-'}</Text>
                </Group>
              </Stack>
              <Stack gap="xs">
                <Text className="text-xs md:text-sm" c="dimmed">WhatsApp</Text>
                <Group gap="xs">
                  <IconBrandWhatsapp size={14} c="dimmed" />
                  <Text className="text-sm md:text-base">{supplier.whatsapp || '-'}</Text>
                </Group>
              </Stack>
              <Stack gap="xs">
                <Text className="text-xs md:text-sm" c="dimmed">Contact Person</Text>
                <Group gap="xs">
                  <IconUsers size={14} c="dimmed" />
                  <Text className="text-sm md:text-base">{supplier.contactPerson || '-'}</Text>
                </Group>
              </Stack>
            </SimpleGrid>
          </Paper>

          {/* Wallet Balance */}
          <Paper withBorder p="md" radius="md">
            <Group gap="sm" mb="md">
              <IconCoin size={20} c="green" />
              <Text fw={600} className="text-base md:text-lg">Wallet Balance</Text>
            </Group>
            <Stack gap="sm">
              <Stack gap="xs">
                <Text className="text-xs md:text-sm" c="dimmed">Current Balance</Text>
                <Text
                  className="text-xl md:text-2xl lg:text-3xl"
                  fw={700}
                  c={(Number(supplier.walletBalance) ?? 0) > 0 ? 'green' : (Number(supplier.walletBalance) ?? 0) < 0 ? 'red' : 'gray'}
                >
                  ৳{(Number(supplier.walletBalance) ?? 0).toFixed(2)} BDT
                </Text>
              </Stack>
              <Stack gap="xs">
                <Text className="text-xs md:text-sm" c="dimmed">Credit Limit</Text>
                <Text className="text-sm md:text-base">
                  ৳{(Number(supplier.creditLimit) ?? 0).toFixed(2)} BDT
                </Text>
              </Stack>
              {(Number(supplier.walletBalance) ?? 0) !== 0 && (
                <Alert variant="light" color={(Number(supplier.walletBalance) ?? 0) > 0 ? 'green' : 'red'}>
                  <Text className="text-xs md:text-sm">
                    {(Number(supplier.walletBalance) ?? 0) > 0
                      ? `Supplier has credit balance of ৳${(Number(supplier.walletBalance) ?? 0).toFixed(2)} BDT`
                      : `Supplier has debit balance of ৳${Math.abs(Number(supplier.walletBalance) ?? 0).toFixed(2)} BDT`
                    }
                  </Text>
                </Alert>
              )}
              {supplier.walletNotes && (
                <Box>
                  <Text className="text-xs md:text-sm" c="dimmed" mb="xs">Recent Transactions</Text>
                  <ScrollArea h={200}>
                    <Stack gap="xs">
                      {(() => {
                        try {
                          const notes = JSON.parse(supplier.walletNotes)
                          return notes.slice(-5).reverse().map((note: any, index: number) => (
                        <Paper key={index} withBorder p="xs" radius="sm" bg={note.type === 'credit' ? 'green.0' : 'red.0'}>
                          <Group justify="space-between" wrap="nowrap">
                            <Stack gap={0}>
                              <Text className="text-xs" fw={500}>
                                {note.type === 'credit' ? 'Credit' : 'Debit'}
                              </Text>
                              <Text className="text-xs" c="dimmed">
                                {new Date(note.date).toLocaleDateString()} {new Date(note.date).toLocaleTimeString()}
                              </Text>
                            </Stack>
                            <Stack gap={0} align="flex-end">
                              <Text
                                className="text-sm"
                                fw={600}
                                c={note.type === 'credit' ? 'green' : 'red'}
                              >
                                {note.type === 'credit' ? '+' : '-'}৳{Number(note.amount).toFixed(2)}
                              </Text>
                              <Text className="text-xs" c="dimmed">
                                Balance: ৳{Number(note.balance_after).toFixed(2)}
                              </Text>
                            </Stack>
                          </Group>
                          <Text className="text-xs" mt="xs" c="dimmed" lineClamp={2}>
                            {note.note}
                          </Text>
                        </Paper>
                          ))
                        } catch (error) {
                          console.error('Failed to parse wallet notes:', error)
                          return <Text className="text-xs" c="dimmed">Unable to load transactions</Text>
                        }
                      })()}
                    </Stack>
                  </ScrollArea>
                </Box>
              )}
            </Stack>
          </Paper>
        </Stack>

        {/* Right Column - Payment Information */}
        {(supplier.wechatId || supplier.wechatQrFile || supplier.alipayId || supplier.alipayQrFile) && (
          <Paper withBorder p="md" radius="md">
            <Group gap="sm" mb="md">
              <IconCoin size={20} c="green" />
              <Text fw={600} className="text-base md:text-lg">Payment Information</Text>
            </Group>
            <Stack gap="md">
              {/* WeChat Pay and Alipay Side by Side */}
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                {/* WeChat Pay */}
                {(supplier.wechatId || supplier.wechatQrFile) && (
                  <Card withBorder p="sm" radius="sm" bg="gray.0">
                    <Text fw={500} className="text-sm md:text-base" mb="xs">WeChat Pay</Text>
                    {supplier.wechatId && (
                      <Text className="text-xs md:text-sm" c="dimmed" mb="xs">
                        WeChat ID: {supplier.wechatId}
                      </Text>
                    )}
                    {supplier.wechatQrFile && (
                      <Box>
                        <Text className="text-xs md:text-sm" c="dimmed" mb="xs">QR Code:</Text>
                        <Image
                          src={supplier.wechatQrFile.startsWith('http') ? supplier.wechatQrFile : `${baseUrl}/storage/${supplier.wechatQrFile}`}
                          alt="WeChat QR Code"
                          w={200}
                          h={200}
                          fit="contain"
                          radius="md"
                          withPlaceholder
                          fallbackSrc={<IconPhoto size={40} c="dimmed" />}
                        />
                      </Box>
                    )}
                  </Card>
                )}

                {/* Alipay */}
                {(supplier.alipayId || supplier.alipayQrFile) && (
                  <Card withBorder p="sm" radius="sm" bg="blue.0">
                    <Text fw={500} className="text-sm md:text-base" mb="xs">Alipay</Text>
                    {supplier.alipayId && (
                      <Text className="text-xs md:text-sm" c="dimmed" mb="xs">
                        Alipay ID: {supplier.alipayId}
                      </Text>
                    )}
                    {supplier.alipayQrFile && (
                      <Box>
                        <Text className="text-xs md:text-sm" c="dimmed" mb="xs">QR Code:</Text>
                        <Image
                          src={supplier.alipayQrFile.startsWith('http') ? supplier.alipayQrFile : `${baseUrl}/storage/${supplier.alipayQrFile}`}
                          alt="Alipay QR Code"
                          w={200}
                          h={200}
                          fit="contain"
                          radius="md"
                          withPlaceholder
                          fallbackSrc={<IconPhoto size={40} c="dimmed" />}
                        />
                      </Box>
                    )}
                  </Card>
                )}
              </SimpleGrid>
            </Stack>
          </Paper>
        )}
      </SimpleGrid>

      {/* Products Section */}
      <Paper withBorder p="md" radius="md">
        <Group gap="sm" mb="md">
          <IconPhoto size={20} c="blue" />
          <Text fw={600} className="text-base md:text-lg">
            {t('procurement.suppliersPage.products') || 'Products'}
          </Text>
          <Badge size="sm">{products.length}</Badge>
        </Group>

        {productsLoading ? (
          <Text className="text-sm md:text-base" c="dimmed">
            Loading products...
          </Text>
        ) : products.length === 0 ? (
          <Text className="text-sm md:text-base" c="dimmed">
            No products linked to this supplier yet
          </Text>
        ) : (
          <Stack gap="sm">
            {products.map((product) => (
              <Paper
                key={product.id}
                withBorder
                p="sm"
                radius="sm"
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/procurement/products/${product.id}`)}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm" flex="1">
                    {product.thumbnail && (
                      <Image
                        src={product.thumbnail.filePath}
                        alt={product.name}
                        w={50}
                        h={50}
                        radius="md"
                        fit="cover"
                        withPlaceholder
                      />
                    )}
                    <Stack gap={0} flex="1">
                      <Group gap="xs" align="center">
                        <Text fw={500} className="text-sm md:text-base">
                          {product.name}
                        </Text>
                        <Badge
                          size="xs"
                          color={product.status === 'published' ? 'green' : 'gray'}
                          variant="light"
                        >
                          {product.status}
                        </Badge>
                      </Group>
                      <Group gap="xs">
                        {product.category && (
                          <Text className="text-xs md:text-sm" c="dimmed">
                            {product.category.name}
                          </Text>
                        )}
                        {product.suppliers && product.suppliers.length > 0 && (
                          <>
                            <Text className="text-xs md:text-sm" c="dimmed">
                              •
                            </Text>
                            {product.suppliers[0].cost_price && (
                              <Text className="text-xs md:text-sm" c="dimmed">
                                Cost: {product.suppliers[0].cost_price}
                              </Text>
                            )}
                            {product.suppliers[0].supplier_sku && (
                              <Text className="text-xs md:text-sm" c="dimmed">
                                • SKU: {product.suppliers[0].supplier_sku}
                              </Text>
                            )}
                          </>
                        )}
                      </Group>
                    </Stack>
                  </Group>
                  <ActionIcon size="sm" variant="light">
                    <IconArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  )
}
