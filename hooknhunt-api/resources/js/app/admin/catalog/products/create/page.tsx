'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Stack, Group, Title, Text, Paper, Button, TextInput, Textarea, Select, NumberInput, Breadcrumbs, Anchor, Card, SimpleGrid, Divider, ActionIcon, MultiSelect, Modal, Image } from '@mantine/core'
import { IconPhoto, IconX, IconPackages, IconTrash, IconDeviceFloppy, IconPlus, IconUsers, IconUpload, IconFolder } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { getSuppliers, getMediaFiles, uploadMediaFiles, type Supplier, type MediaFile } from '@/utils/api'

export default function CreateProductPage() {
  const { t } = useTranslation()

  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [brand, setBrand] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('draft')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [supplierUrl, setSupplierUrl] = useState('')
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [suppliersLoading, setSuppliersLoading] = useState(true)

  // Media library state
  const [mediaModalOpened, setMediaModalOpened] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [variants, setVariants] = useState([
    { id: '1', sku: '', customSku: '', variantName: '', size: '', color: '', unit: '', retailPrice: 0, wholesalePrice: 0, purchaseCost: 0, alertQty: 5 }
  ])

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setSuppliersLoading(true)
        const response = await getSuppliers({ is_active: true, per_page: 100 })
        const suppliersData = Array.isArray(response) ? response : (response?.data || [])
        setSuppliers(suppliersData)
      } catch (error) {
        console.error('Failed to fetch suppliers:', error)
        notifications.show({
          title: t('common.error') || 'Error',
          message: 'Failed to load suppliers',
          color: 'red'
        })
      } finally {
        setSuppliersLoading(false)
      }
    }
    fetchSuppliers()
  }, [])

  // Fetch media files when modal opens
  const fetchMediaFiles = async () => {
    try {
      setMediaLoading(true)
      const response = await getMediaFiles({ page: 1, per_page: 50 })
      let filesData: MediaFile[] = []
      if (response?.status && response.data) {
        const data = response.data
        if (Array.isArray(data.data)) {
          filesData = data.data
        } else if (Array.isArray(data)) {
          filesData = data
        }
      } else if (Array.isArray(response)) {
        filesData = response
      }
      // Filter only images
      setMediaFiles(filesData.filter(f => f.mimeType?.startsWith('image/')))
    } catch (error) {
      console.error('Failed to fetch media files:', error)
    } finally {
      setMediaLoading(false)
    }
  }

  const handleMediaModalOpen = () => {
    setMediaModalOpened(true)
    fetchMediaFiles()
  }

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setThumbnailPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleMediaUpload = async (files: FileList) => {
    setUploading(true)
    try {
      await uploadMediaFiles(files)
      notifications.show({
        title: 'Success',
        message: 'Files uploaded successfully',
        color: 'green'
      })
      await fetchMediaFiles()
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to upload files',
        color: 'red'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSelectMediaImage = (mediaFile: MediaFile) => {
    setThumbnailPreview(mediaFile.url)
    setThumbnailFile(null)
    setMediaModalOpened(false)
  }

  const handleRemoveImage = () => {
    setThumbnailPreview(null)
    setThumbnailFile(null)
  }

  const handleAddVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), sku: '', customSku: '', variantName: '', size: '', color: '', unit: '', retailPrice: 0, wholesalePrice: 0, purchaseCost: 0, alertQty: 5 }])
  }

  const handleRemoveVariant = (id: string) => {
    if (variants.length > 1) setVariants(variants.filter((v) => v.id !== id))
    else notifications.show({ title: t('common.warning') || 'Warning', message: 'At least one variant is required', color: 'yellow' })
  }

  const handleVariantChange = (id: string, field: string, value: any) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    notifications.show({ title: t('common.success') || 'Success', message: 'Product saved successfully', color: 'green' })
  }

  // Transform suppliers for MultiSelect
  const supplierOptions = Array.isArray(suppliers) ? suppliers.map((supplier) => ({
    value: supplier.id.toString(),
    label: supplier.name
  })) : []

  return (
    <Box p="md">
      <Stack gap="md">
        <Breadcrumbs>
          <Anchor href="/admin/catalog/products">{t('catalog.products') || 'Products'}</Anchor>
          <Text>{t('catalog.productsCreate.title') || 'Add Product'}</Text>
        </Breadcrumbs>

        <Group justify="space-between">
          <Group>
            <IconPackages size={32} className="text-blue-600" />
            <Title order={1}>{t('catalog.productsCreate.title') || 'Add New Product'}</Title>
          </Group>
        </Group>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Card withBorder p="md" shadow="sm">
              <Stack gap="md">
                <Group>
                  <IconPackages size={20} className="text-blue-600" />
                  <Text className="text-base md:text-lg" fw={600}>
                    {t('catalog.productsCreate.basicInfo') || 'Basic Information'}
                  </Text>
                </Group>
                <Divider />

                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                  <TextInput
                    label={t('catalog.productsCreate.productName') || 'Product Name'}
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.currentTarget.value)}
                    required
                  />
                  <Select
                    label={t('catalog.productsCreate.category') || 'Category'}
                    placeholder="Select category"
                    data={[{ value: '1', label: 'Electronics' }, { value: '2', label: 'Clothing' }]}
                    value={category}
                    onChange={setCategory}
                    required
                    searchable
                  />
                  <Select
                    label={t('catalog.productsCreate.brand') || 'Brand'}
                    placeholder="Select brand"
                    data={[{ value: '1', label: 'Apple' }, { value: '2', label: 'Samsung' }]}
                    value={brand}
                    onChange={setBrand}
                    searchable
                  />
                </SimpleGrid>

                <Textarea
                  label={t('catalog.productsCreate.description') || 'Description'}
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  minRows={3}
                />

                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <TextInput
                    label={t('catalog.productsCreate.videoUrl') || 'Video URL'}
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.currentTarget.value)}
                  />
                  <Select
                    label={t('catalog.productsCreate.status') || 'Status'}
                    data={[
                      { value: 'draft', label: t('catalog.productsPage.status.draft') || 'Draft' },
                      { value: 'published', label: t('catalog.productsPage.status.published') || 'Published' },
                      { value: 'archived', label: t('catalog.productsPage.status.archived') || 'Archived' },
                    ]}
                    value={status}
                    onChange={(value) => setStatus(value || 'draft')}
                  />
                </SimpleGrid>
              </Stack>
            </Card>

            <Card withBorder p="md" shadow="sm">
              <Stack gap="md">
                <Group>
                  <IconUsers size={20} className="text-blue-600" />
                  <Text className="text-base md:text-lg" fw={600}>
                    {t('catalog.productsCreate.supplierInfo') || 'Supplier Information'}
                  </Text>
                </Group>
                <Divider />

                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <MultiSelect
                    label={t('catalog.productsCreate.suppliers') || 'Suppliers'}
                    placeholder="Select suppliers"
                    description="Select multiple suppliers for this product"
                    data={supplierOptions}
                    value={selectedSuppliers}
                    onChange={setSelectedSuppliers}
                    searchable
                    nothingFoundMessage="No suppliers found"
                    disabled={suppliersLoading}
                  />
                  <TextInput
                    label={t('catalog.productsCreate.supplierUrl') || 'Supplier URL'}
                    placeholder="https://supplier.com/product/..."
                    description="Product URL from supplier"
                    value={supplierUrl}
                    onChange={(e) => setSupplierUrl(e.currentTarget.value)}
                  />
                </SimpleGrid>
              </Stack>
            </Card>

            <Card withBorder p="md" shadow="sm">
              <Stack gap="md">
                <Group>
                  <IconPhoto size={20} className="text-blue-600" />
                  <Text className="text-base md:text-lg" fw={600}>
                    {t('catalog.productsCreate.productImage') || 'Product Image'}
                  </Text>
                </Group>
                <Divider />

                <Stack gap="sm">
                  <Group gap="sm">
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconUpload size={14} />}
                      onClick={() => (document.getElementById('thumbnail') as HTMLInputElement)?.click()}
                    >
                      Upload Image
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconFolder size={14} />}
                      onClick={handleMediaModalOpen}
                    >
                      Select from Media
                    </Button>
                  </Group>

                  <input type="file" id="thumbnail" accept="image/*" onChange={handleThumbnailSelect} className="hidden" />

                  {!thumbnailPreview ? (
                    <Paper
                      withBorder
                      p="xl"
                      className="border-dashed"
                      h={200}
                      display="flex"
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Stack align="center" gap="sm">
                        <IconPhoto size={48} className="text-gray-400" />
                        <Text c="dimmed">{t('catalog.productsCreate.noImageSelected') || 'No image selected'}</Text>
                        <Text size="xs" c="dimmed">Upload an image or select from media library</Text>
                      </Stack>
                    </Paper>
                  ) : (
                    <Box pos="relative" className="inline-block">
                      <Paper shadow="sm" p="xs">
                        <img src={thumbnailPreview} alt="Preview" className="w-48 h-48 object-cover rounded-md" />
                      </Paper>
                      <ActionIcon
                        pos="absolute"
                        top={-8}
                        right={-8}
                        color="red"
                        variant="filled"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    </Box>
                  )}
                </Stack>
              </Stack>
            </Card>

            <Card withBorder p="md" shadow="sm">
              <Stack gap="md">
                <Group justify="space-between">
                  <Group>
                    <IconPackages size={20} className="text-blue-600" />
                    <Text className="text-base md:text-lg" fw={600}>
                      {t('catalog.productsCreate.variants') || 'Product Variants'}
                    </Text>
                  </Group>
                  <Button
                    leftSection={<IconPlus size={14} />}
                    size="xs"
                    variant="light"
                    onClick={handleAddVariant}
                  >
                    {t('catalog.productsCreate.addVariant') || 'Add Variant'}
                  </Button>
                </Group>
                <Divider />

                <Stack gap="sm">
                  {variants.map((variant, index) => (
                    <Paper key={variant.id} withBorder p="sm" radius="md">
                      <Stack gap="sm">
                        <Group justify="space-between">
                          <Text className="text-sm md:text-base" fw={600}>
                            {t('catalog.productsCreate.variant')} {index + 1}
                          </Text>
                          {variants.length > 1 && (
                            <ActionIcon
                              color="red"
                              variant="light"
                              size="sm"
                              onClick={() => handleRemoveVariant(variant.id)}
                            >
                              <IconTrash size={14} />
                            </ActionIcon>
                          )}
                        </Group>

                        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
                          <TextInput
                            label="SKU"
                            placeholder="PROD-001"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(variant.id, 'sku', e.currentTarget.value)}
                            required
                          />
                          <TextInput
                            label={t('catalog.productsCreate.customSku') || 'Custom SKU'}
                            placeholder="Owner code"
                            value={variant.customSku}
                            onChange={(e) => handleVariantChange(variant.id, 'customSku', e.currentTarget.value)}
                          />
                          <TextInput
                            label={t('catalog.productsCreate.variantName') || 'Variant Name'}
                            placeholder="Red - XL"
                            value={variant.variantName}
                            onChange={(e) => handleVariantChange(variant.id, 'variantName', e.currentTarget.value)}
                          />
                          <Select
                            label={t('catalog.productsCreate.unit') || 'Unit'}
                            placeholder="Select unit"
                            data={[{ value: 'pcs', label: 'Pieces' }, { value: 'kg', label: 'Kilogram' }]}
                            value={variant.unit}
                            onChange={(value) => handleVariantChange(variant.id, 'unit', value)}
                          />
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
                          <TextInput
                            label={t('catalog.productsCreate.size') || 'Size'}
                            placeholder="XL"
                            value={variant.size}
                            onChange={(e) => handleVariantChange(variant.id, 'size', e.currentTarget.value)}
                          />
                          <TextInput
                            label={t('catalog.productsCreate.color') || 'Color'}
                            placeholder="Red"
                            value={variant.color}
                            onChange={(e) => handleVariantChange(variant.id, 'color', e.currentTarget.value)}
                          />
                          <NumberInput
                            label={t('catalog.productsCreate.retailPrice') || 'Retail Price'}
                            placeholder="0.00"
                            min={0}
                            decimalScale={2}
                            value={variant.retailPrice}
                            onChange={(value) => handleVariantChange(variant.id, 'retailPrice', value)}
                            required
                          />
                          <NumberInput
                            label={t('catalog.productsCreate.wholesalePrice') || 'Wholesale Price'}
                            placeholder="0.00"
                            min={0}
                            decimalScale={2}
                            value={variant.wholesalePrice}
                            onChange={(value) => handleVariantChange(variant.id, 'wholesalePrice', value)}
                          />
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                          <NumberInput
                            label={t('catalog.productsCreate.purchaseCost') || 'Purchase Cost'}
                            placeholder="0.00"
                            min={0}
                            decimalScale={2}
                            value={variant.purchaseCost}
                            onChange={(value) => handleVariantChange(variant.id, 'purchaseCost', value)}
                          />
                          <NumberInput
                            label={t('catalog.productsCreate.alertQty') || 'Alert Quantity'}
                            placeholder="5"
                            min={0}
                            value={variant.alertQty}
                            onChange={(value) => handleVariantChange(variant.id, 'alertQty', value)}
                          />
                        </SimpleGrid>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </Card>

            <Group justify="flex-end" gap="sm">
              <Button
                variant="light"
                onClick={() => { window.location.href = '/admin/catalog/products' }}
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
              >
                {t('catalog.productsCreate.saveProduct') || 'Save Product'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>

      {/* Media Library Modal */}
      <Modal
        opened={mediaModalOpened}
        onClose={() => setMediaModalOpened(false)}
        title={<Text fw={600}>Select from Media Library</Text>}
        size="xl"
      >
        <Stack gap="md">
          {/* Upload button */}
          <Group>
            <Button
              component="label"
              size="sm"
              leftSection={<IconUpload size={16} />}
              loading={uploading}
            >
              Upload New Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const files = e.target.files
                  if (files && files.length > 0) {
                    handleMediaUpload(files)
                  }
                }}
              />
            </Button>
          </Group>

          {/* Media grid */}
          {mediaLoading ? (
            <Text ta="center" c="dimmed" py="xl">Loading media...</Text>
          ) : mediaFiles.length > 0 ? (
            <SimpleGrid cols={{ base: 3, sm: 4, md: 5 }} spacing="sm">
              {mediaFiles.map((file) => (
                <Paper
                  key={file.id}
                  withBorder
                  p="xs"
                  radius="md"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelectMediaImage(file)}
                  className="hover:border-blue-500"
                >
                  <Image
                    src={file.url}
                    alt={file.originalFilename}
                    height={80}
                    fit="contain"
                    radius="md"
                  />
                  <Text size="xs" c="dimmed" mt="xs" lineClamp={1}>
                    {file.originalFilename}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          ) : (
            <Text ta="center" c="dimmed" py="xl">No images found in media library</Text>
          )}
        </Stack>
      </Modal>
    </Box>
  )
}
