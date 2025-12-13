import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, GripVertical, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  useAttributeStore,
  type Attribute,
  type AttributeOption,
  type CreateAttributeData,
  type UpdateAttributeData,
  type CreateOptionData,
  type UpdateOptionData
} from '@/stores/attributeStore';

export default function Attributes() {
  const { t } = useTranslation('attributes');
  const { toast } = useToast();
  const {
    attributes,
    loading,
    fetchAttributes,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    addOption,
    updateOption,
    deleteOption
  } = useAttributeStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddOptionDialogOpen, setIsAddOptionDialogOpen] = useState(false);
  const [isEditOptionDialogOpen, setIsEditOptionDialogOpen] = useState(false);
  const [isDeleteOptionDialogOpen, setIsDeleteOptionDialogOpen] = useState(false);

  // Attribute form state
  const [newAttribute, setNewAttribute] = useState<CreateAttributeData>({
    name: '',
    display_name: '',
    type: 'select',
    is_required: false,
    is_visible: true,
  });

  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [editAttribute, setEditAttribute] = useState<UpdateAttributeData>({});
  const [deletingAttribute, setDeletingAttribute] = useState<Attribute | null>(null);

  // Option form state
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [newOption, setNewOption] = useState<Partial<CreateOptionData>>({
    value: '',
    display_value: '',
    color_code: '',
    is_default: false,
  });
  const [newOptionImage, setNewOptionImage] = useState<File | null>(null);

  const [editingOption, setEditingOption] = useState<AttributeOption | null>(null);
  const [editOption, setEditOption] = useState<Partial<UpdateOptionData>>({});
  const [editOptionImage, setEditOptionImage] = useState<File | null>(null);

  const [deletingOption, setDeletingOption] = useState<{ attributeId: number; optionId: number; value: string } | null>(null);

  const [expandedAttributes, setExpandedAttributes] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  const toggleExpand = (attributeId: number) => {
    const newExpanded = new Set(expandedAttributes);
    if (newExpanded.has(attributeId)) {
      newExpanded.delete(attributeId);
    } else {
      newExpanded.add(attributeId);
    }
    setExpandedAttributes(newExpanded);
  };

  // Create Attribute
  const handleCreateAttribute = async () => {
    if (!newAttribute.name?.trim()) {
      toast({
        title: t('toast.attribute_name_required'),
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await createAttribute(newAttribute);
      toast({
        title: t('toast.attribute_create_success'),
      });
      setIsCreateDialogOpen(false);
      setNewAttribute({
        name: '',
        display_name: '',
        type: 'select',
        is_required: false,
        is_visible: true,
      });
    } catch (error: any) {
      toast({
        title: error.message || t('toast.attribute_create_failed'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Update Attribute
  const handleUpdateAttribute = async () => {
    if (!editingAttribute || !editAttribute.name?.trim()) {
      toast({
        title: t('toast.attribute_name_required'),
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await updateAttribute(editingAttribute.id, editAttribute);
      toast({
        title: t('toast.attribute_update_success'),
      });
      setIsEditDialogOpen(false);
      setEditingAttribute(null);
      setEditAttribute({});
    } catch (error: any) {
      toast({
        title: error.message || t('toast.attribute_update_failed'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Attribute
  const handleDeleteAttribute = async () => {
    if (!deletingAttribute) return;

    setSubmitting(true);
    try {
      await deleteAttribute(deletingAttribute.id);
      toast({
        title: t('toast.attribute_delete_success'),
      });
      setIsDeleteDialogOpen(false);
      setDeletingAttribute(null);
    } catch (error: any) {
      toast({
        title: error.message || t('toast.attribute_delete_failed'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Add Option
  const handleAddOption = async () => {
    if (!selectedAttribute || !newOption.value?.trim()) {
      toast({
        title: t('toast.option_value_required'),
        variant: 'destructive',
      });
      return;
    }

    // Validate color code for color type
    if (selectedAttribute.type === 'color' && newOption.color_code) {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      if (!hexRegex.test(newOption.color_code)) {
        toast({
          title: t('toast.color_code_invalid'),
          variant: 'destructive',
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const optionData: CreateOptionData = {
        attribute_id: selectedAttribute.id,
        value: newOption.value,
        display_value: newOption.display_value,
        color_code: newOption.color_code,
        is_default: newOption.is_default,
      };

      if (newOptionImage) {
        optionData.image = newOptionImage;
      }

      await addOption(optionData);
      toast({
        title: t('toast.option_add_success'),
      });
      setIsAddOptionDialogOpen(false);
      setNewOption({
        value: '',
        display_value: '',
        color_code: '',
        is_default: false,
      });
      setNewOptionImage(null);
      setSelectedAttribute(null);
    } catch (error: any) {
      toast({
        title: error.message || t('toast.option_add_failed'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Update Option
  const handleUpdateOption = async () => {
    if (!editingOption || !editOption.value?.trim()) {
      toast({
        title: t('toast.option_value_required'),
        variant: 'destructive',
      });
      return;
    }

    // Validate color code
    if (editOption.color_code) {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      if (!hexRegex.test(editOption.color_code)) {
        toast({
          title: t('toast.color_code_invalid'),
          variant: 'destructive',
        });
          return;
      }
    }

    setSubmitting(true);
    try {
      const optionData: UpdateOptionData = { ...editOption };

      if (editOptionImage) {
        optionData.image = editOptionImage;
      }

      await updateOption(editingOption.id, optionData);
      toast({
        title: t('toast.option_update_success'),
      });
      setIsEditOptionDialogOpen(false);
      setEditingOption(null);
      setEditOption({});
      setEditOptionImage(null);
    } catch (error: any) {
      toast({
        title: error.message || t('toast.option_update_failed'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Option
  const handleDeleteOption = async () => {
    if (!deletingOption) return;

    setSubmitting(true);
    try {
      await deleteOption(deletingOption.attributeId, deletingOption.optionId);
      toast({
        title: t('toast.option_delete_success'),
      });
      setIsDeleteOptionDialogOpen(false);
      setDeletingOption(null);
    } catch (error: any) {
      toast({
        title: error.message || t('toast.option_delete_failed'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && attributes.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('loading')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('description')}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('new_attribute_button')}
        </Button>
      </div>

      {/* Attributes List */}
      <div className="grid gap-4">
        {attributes.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">
                {t('no_attributes')}
              </p>
            </CardContent>
          </Card>
        ) : (
          attributes.map((attribute) => {
            const isExpanded = expandedAttributes.has(attribute.id);
            const optionsCount = attribute.options?.length || 0;

            return (
              <Card key={attribute.id}>
                <CardHeader className="cursor-pointer" onClick={() => toggleExpand(attribute.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div className="flex items-center gap-2">
                        {attribute.is_visible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        <div>
                          <CardTitle className="text-lg">
                            {attribute.display_name || attribute.name}
                            {attribute.is_required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </CardTitle>
                          <CardDescription>
                            {attribute.type?.toUpperCase()} • {t('attribute_card.option_plural', { count: optionsCount })}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAttribute(attribute);
                          setIsAddOptionDialogOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {t('attribute_card.add_option_button')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingAttribute(attribute);
                          setEditAttribute({
                            name: attribute.name,
                            display_name: attribute.display_name,
                            type: attribute.type,
                            is_required: attribute.is_required,
                            is_visible: attribute.is_visible,
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingAttribute(attribute);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent>
                    {optionsCount === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        {t('attribute_card.no_options')}
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {attribute.options?.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full group hover:bg-gray-200"
                          >
                            {/* Color preview */}
                            {option.color_code && (
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: option.color_code }}
                              />
                            )}
                            {/* Image preview */}
                            {option.image_url && (
                              <img
                                src={option.image_url}
                                alt={option.value}
                                className="w-4 h-4 rounded object-cover"
                              />
                            )}
                            <span className="text-sm font-medium">
                              {option.display_value || option.value}
                            </span>
                            {option.is_default && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                {t('attribute_card.default_badge')}
                              </span>
                            )}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-0.5 hover:bg-white rounded"
                                onClick={() => {
                                  setEditingOption(option);
                                  setEditOption({
                                    value: option.value,
                                    display_value: option.display_value,
                                    color_code: option.color_code,
                                    is_default: option.is_default,
                                  });
                                  setIsEditOptionDialogOpen(true);
                                }}
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                className="p-0.5 hover:bg-white rounded"
                                onClick={() => {
                                  setDeletingOption({
                                    attributeId: attribute.id,
                                    optionId: option.id,
                                    value: option.display_value || option.value,
                                  });
                                  setIsDeleteOptionDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Create Attribute Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('create_attribute_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('create_attribute_dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="attributeName">{t('create_attribute_dialog.form.name_label')}</Label>
              <Input
                id="attributeName"
                placeholder={t('create_attribute_dialog.form.name_placeholder')}
                value={newAttribute.name}
                onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="attributeDisplayName">{t('create_attribute_dialog.form.display_name_label')}</Label>
              <Input
                id="attributeDisplayName"
                placeholder={t('create_attribute_dialog.form.display_name_placeholder')}
                value={newAttribute.display_name}
                onChange={(e) => setNewAttribute({ ...newAttribute, display_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="attributeType">{t('create_attribute_dialog.form.type_label')}</Label>
              <Select
                value={newAttribute.type}
                onValueChange={(value: 'select' | 'color' | 'image') =>
                  setNewAttribute({ ...newAttribute, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">{t('create_attribute_dialog.form.type_select_dropdown')}</SelectItem>
                  <SelectItem value="color">{t('create_attribute_dialog.form.type_color_swatches')}</SelectItem>
                  <SelectItem value="image">{t('create_attribute_dialog.form.type_image_swatches')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isRequired">{t('create_attribute_dialog.form.required_label')}</Label>
              <Switch
                id="isRequired"
                checked={newAttribute.is_required}
                onCheckedChange={(checked) =>
                  setNewAttribute({ ...newAttribute, is_required: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isVisible">{t('create_attribute_dialog.form.visible_label')}</Label>
              <Switch
                id="isVisible"
                checked={newAttribute.is_visible}
                onCheckedChange={(checked) =>
                  setNewAttribute({ ...newAttribute, is_visible: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t('create_attribute_dialog.cancel_button')}
            </Button>
            <Button onClick={handleCreateAttribute} disabled={submitting}>
              {submitting ? t('create_attribute_dialog.creating_button') : t('create_attribute_dialog.create_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Attribute Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('edit_attribute_dialog.title')}</DialogTitle>
            <DialogDescription>{t('edit_attribute_dialog.description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="editAttributeName">{t('edit_attribute_dialog.form.name_label')}</Label>
              <Input
                id="editAttributeName"
                value={editAttribute.name || ''}
                onChange={(e) => setEditAttribute({ ...editAttribute, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editAttributeDisplayName">{t('edit_attribute_dialog.form.display_name_label')}</Label>
              <Input
                id="editAttributeDisplayName"
                placeholder={t('edit_attribute_dialog.form.display_name_placeholder')}
                value={editAttribute.display_name || ''}
                onChange={(e) => setEditAttribute({ ...editAttribute, display_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editAttributeType">{t('edit_attribute_dialog.form.type_label')}</Label>
              <Select
                value={editAttribute.type}
                onValueChange={(value: 'select' | 'color' | 'image') =>
                  setEditAttribute({ ...editAttribute, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">{t('edit_attribute_dialog.form.type_select_dropdown')}</SelectItem>
                  <SelectItem value="color">{t('edit_attribute_dialog.form.type_color_swatches')}</SelectItem>
                  <SelectItem value="image">{t('edit_attribute_dialog.form.type_image_swatches')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="editIsRequired">{t('edit_attribute_dialog.form.required_label')}</Label>
              <Switch
                id="editIsRequired"
                checked={editAttribute.is_required}
                onCheckedChange={(checked) =>
                  setEditAttribute({ ...editAttribute, is_required: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="editIsVisible">{t('edit_attribute_dialog.form.visible_label')}</Label>
              <Switch
                id="editIsVisible"
                checked={editAttribute.is_visible}
                onCheckedChange={(checked) =>
                  setEditAttribute({ ...editAttribute, is_visible: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t('edit_attribute_dialog.cancel_button')}
            </Button>
            <Button onClick={handleUpdateAttribute} disabled={submitting}>
              {submitting ? t('edit_attribute_dialog.updating_button') : t('edit_attribute_dialog.update_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Attribute Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('delete_attribute_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('delete_attribute_dialog.description', { name: deletingAttribute?.display_name || deletingAttribute?.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('delete_attribute_dialog.cancel_button')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteAttribute} disabled={submitting}>
              {submitting ? t('delete_attribute_dialog.deleting_button') : t('delete_attribute_dialog.delete_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Option Dialog */}
      <Dialog open={isAddOptionDialogOpen} onOpenChange={setIsAddOptionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('add_option_dialog.title', { attributeName: selectedAttribute?.display_name || selectedAttribute?.name })}</DialogTitle>
            <DialogDescription>
              {t('add_option_dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="optionValue">{t('add_option_dialog.form.value_label')}</Label>
              <Input
                id="optionValue"
                placeholder={t('add_option_dialog.form.value_placeholder')}
                value={newOption.value}
                onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="optionDisplayValue">{t('add_option_dialog.form.display_value_label')}</Label>
              <Input
                id="optionDisplayValue"
                placeholder={t('add_option_dialog.form.display_value_placeholder')}
                value={newOption.display_value}
                onChange={(e) => setNewOption({ ...newOption, display_value: e.target.value })}
              />
            </div>

            {selectedAttribute?.type === 'color' && (
              <div>
                <Label htmlFor="optionColorCode">{t('add_option_dialog.form.color_code_label')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="optionColorCode"
                    placeholder={t('add_option_dialog.form.color_code_placeholder')}
                    value={newOption.color_code}
                    onChange={(e) => setNewOption({ ...newOption, color_code: e.target.value })}
                  />
                  <input
                    type="color"
                    className="w-12 h-10 rounded border"
                    value={newOption.color_code || '#000000'}
                    onChange={(e) => setNewOption({ ...newOption, color_code: e.target.value })}
                  />
                </div>
              </div>
            )}

            {selectedAttribute?.type === 'image' && (
              <div>
                <Label htmlFor="optionImage">{t('add_option_dialog.form.image_label')}</Label>
                <Input
                  id="optionImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewOptionImage(e.target.files?.[0] || null)}
                />
                {newOptionImage && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('add_option_dialog.form.image_selected', { imageName: newOptionImage.name })}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="optionIsDefault">{t('add_option_dialog.form.set_default_label')}</Label>
              <Switch
                id="optionIsDefault"
                checked={newOption.is_default}
                onCheckedChange={(checked) =>
                  setNewOption({ ...newOption, is_default: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOptionDialogOpen(false)}>
              {t('add_option_dialog.cancel_button')}
            </Button>
            <Button onClick={handleAddOption} disabled={submitting}>
              {submitting ? t('add_option_dialog.adding_button') : t('add_option_dialog.add_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Option Dialog */}
      <Dialog open={isEditOptionDialogOpen} onOpenChange={setIsEditOptionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('edit_option_dialog.title')}</DialogTitle>
            <DialogDescription>{t('edit_option_dialog.description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="editOptionValue">{t('edit_option_dialog.form.value_label')}</Label>
              <Input
                id="editOptionValue"
                value={editOption.value || ''}
                onChange={(e) => setEditOption({ ...editOption, value: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editOptionDisplayValue">{t('edit_option_dialog.form.display_value_label')}</Label>
              <Input
                id="editOptionDisplayValue"
                placeholder={t('edit_option_dialog.form.display_value_placeholder')}
                value={editOption.display_value || ''}
                onChange={(e) => setEditOption({ ...editOption, display_value: e.target.value })}
              />
            </div>

            {editingOption?.color_code !== undefined && (
              <div>
                <Label htmlFor="editOptionColorCode">{t('edit_option_dialog.form.color_code_label')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="editOptionColorCode"
                    placeholder={t('edit_option_dialog.form.color_code_placeholder')}
                    value={editOption.color_code || ''}
                    onChange={(e) => setEditOption({ ...editOption, color_code: e.target.value })}
                  />
                  <input
                    type="color"
                    className="w-12 h-10 rounded border"
                    value={editOption.color_code || '#000000'}
                    onChange={(e) => setEditOption({ ...editOption, color_code: e.target.value })}
                  />
                </div>
              </div>
            )}

            {editingOption?.image_url !== undefined && (
              <div>
                <Label htmlFor="editOptionImage">{t('edit_option_dialog.form.image_label')}</Label>
                {editingOption.image_url && !editOptionImage && (
                  <div className="mb-2">
                    <img
                      src={editingOption.image_url}
                      alt="Current"
                      className="w-16 h-16 rounded object-cover"
                    />
                  </div>
                )}
                <Input
                  id="editOptionImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditOptionImage(e.target.files?.[0] || null)}
                />
                {editOptionImage && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('edit_option_dialog.form.image_new_file', { imageName: editOptionImage.name })}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="editOptionIsDefault">{t('edit_option_dialog.form.set_default_label')}</Label>
              <Switch
                id="editOptionIsDefault"
                checked={editOption.is_default}
                onCheckedChange={(checked) =>
                  setEditOption({ ...editOption, is_default: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOptionDialogOpen(false)}>
              {t('edit_option_dialog.cancel_button')}
            </Button>
            <Button onClick={handleUpdateOption} disabled={submitting}>
              {submitting ? t('edit_option_dialog.updating_button') : t('edit_option_dialog.update_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Option Dialog */}
      <Dialog open={isDeleteOptionDialogOpen} onOpenChange={setIsDeleteOptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('delete_option_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('delete_option_dialog.description', { value: deletingOption?.value })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOptionDialogOpen(false)}>
              {t('delete_option_dialog.cancel_button')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteOption} disabled={submitting}>
              {submitting ? t('delete_option_dialog.deleting_button') : t('delete_option_dialog.delete_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
