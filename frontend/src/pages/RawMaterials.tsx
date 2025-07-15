import { useState, useEffect, useRef } from "react"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Modal, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCafe, RawMaterial } from "@/context/CafeContext"
import { useToast } from "@/hooks/use-toast"

export function RawMaterials() {
  const { rawMaterials, addRawMaterial, updateRawMaterial, deleteRawMaterial } = useCafe()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    unit: "",
    supplier: ""
  })

  const resetForm = () => {
    setFormData({ name: "", price: "", unit: "", supplier: "" })
    setEditingMaterial(null)
  }

  const handleAddDialogChange = (open: boolean) => {
    if (open && isEditDialogOpen) {
      // Close edit dialog if add dialog is opening
      setIsEditDialogOpen(false)
      resetForm()
    }
    setIsAddDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    if (open && isAddDialogOpen) {
      // Close add dialog if edit dialog is opening
      setIsAddDialogOpen(false)
      resetForm()
    }
    setIsEditDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.unit) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }

    const materialData = {
      name: formData.name,
      price: parseFloat(formData.price),
      unit: formData.unit,
      supplier: formData.supplier || undefined
    }

    if (editingMaterial) {
      updateRawMaterial(editingMaterial.id, materialData)
      toast({
        title: "Sucesso",
        description: "Matéria prima atualizada com sucesso!"
      })
      setIsEditDialogOpen(false)
      setEditingMaterial(null)
    } else {
      addRawMaterial(materialData)
      toast({
        title: "Sucesso",
        description: "Matéria prima adicionada com sucesso!"
      })
      setIsAddDialogOpen(false)
    }

    resetForm()
  }

  const handleEdit = (material: RawMaterial) => {
    setEditingMaterial(material)
    setFormData({
      name: material.name,
      price: material.price.toString(),
      unit: material.unit,
      supplier: material.supplier || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteRawMaterial(id)
    toast({
      title: "Sucesso",
      description: "Matéria prima removida com sucesso!"
    })
  }

  const MaterialForm = () => {
    const firstInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      // Focus the first input when the form mounts/dialog opens
      const timer = setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus()
        }
      }, 100) // Small delay to ensure dialog is fully rendered

      return () => clearTimeout(timer)
    }, [])

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleSubmit(e)
    }

    return (
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${editingMaterial ? 'edit' : 'add'}`}>Nome *</Label>
          <Input
            ref={firstInputRef}
            id={`name-${editingMaterial ? 'edit' : 'add'}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Açúcar, Café, Leite..."
            autoComplete="off"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`price-${editingMaterial ? 'edit' : 'add'}`}>Preço (R$) *</Label>
            <Input
              id={`price-${editingMaterial ? 'edit' : 'add'}`}
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              autoComplete="off"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`unit-${editingMaterial ? 'edit' : 'add'}`}>Unidade *</Label>
            <Input
              id={`unit-${editingMaterial ? 'edit' : 'add'}`}
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="kg, L, un..."
              autoComplete="off"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`supplier-${editingMaterial ? 'edit' : 'add'}`}>Fornecedor</Label>
          <Input
            id={`supplier-${editingMaterial ? 'edit' : 'add'}`}
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="Nome do fornecedor (opcional)"
            autoComplete="off"
          />
        </div>
        
        <Button type="submit" className="w-full">
          {editingMaterial ? "Atualizar" : "Adicionar"} Matéria Prima
        </Button>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Matérias Primas</h1>
          <p className="text-muted-foreground">Gerencie os ingredientes e seus preços</p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Matéria Prima
        </Button>

        <Modal isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
          <ModalHeader>
            <ModalTitle>Adicionar Nova Matéria Prima</ModalTitle>
            <ModalDescription>
              Cadastre um novo ingrediente com seu preço e unidade de medida.
            </ModalDescription>
          </ModalHeader>
          <MaterialForm />
        </Modal>
      </div>

      {rawMaterials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma matéria prima cadastrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece adicionando seus primeiros ingredientes para criar receitas.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Matéria Prima
            </Button>

            <Modal isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
              <ModalHeader>
                <ModalTitle>Adicionar Nova Matéria Prima</ModalTitle>
                <ModalDescription>
                  Cadastre um novo ingrediente com seu preço e unidade de medida.
                </ModalDescription>
              </ModalHeader>
              <MaterialForm />
            </Modal>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rawMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>{material.name}</span>
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(material)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(material.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Atualizado em {material.lastUpdated.toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Preço</span>
                    <span className="text-lg font-bold text-primary">
                      R$ {material.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Unidade</span>
                    <Badge variant="secondary">{material.unit}</Badge>
                  </div>
                  
                  {material.supplier && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fornecedor</span>
                      <span className="text-sm">{material.supplier}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <ModalHeader>
          <ModalTitle>Editar Matéria Prima</ModalTitle>
          <ModalDescription>
            Atualize as informações da matéria prima.
          </ModalDescription>
        </ModalHeader>
        <MaterialForm />
      </Modal>
    </div>
  )
}