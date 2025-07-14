import { useState } from "react"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

    setFormData({ name: "", price: "", unit: "", supplier: "" })
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

  const MaterialForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Açúcar, Café, Leite..."
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit">Unidade *</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="kg, L, un..."
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="supplier">Fornecedor</Label>
        <Input
          id="supplier"
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          placeholder="Nome do fornecedor (opcional)"
        />
      </div>
      
      <Button type="submit" className="w-full">
        {editingMaterial ? "Atualizar" : "Adicionar"} Matéria Prima
      </Button>
    </form>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Matérias Primas</h1>
          <p className="text-muted-foreground">Gerencie os ingredientes e seus preços</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Matéria Prima
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Matéria Prima</DialogTitle>
              <DialogDescription>
                Cadastre um novo ingrediente com seu preço e unidade de medida.
              </DialogDescription>
            </DialogHeader>
            <MaterialForm />
          </DialogContent>
        </Dialog>
      </div>

      {rawMaterials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma matéria prima cadastrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece adicionando seus primeiros ingredientes para criar receitas.
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Matéria Prima
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Matéria Prima</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo ingrediente com seu preço e unidade de medida.
                  </DialogDescription>
                </DialogHeader>
                <MaterialForm />
              </DialogContent>
            </Dialog>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Matéria Prima</DialogTitle>
            <DialogDescription>
              Atualize as informações da matéria prima.
            </DialogDescription>
          </DialogHeader>
          <MaterialForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}