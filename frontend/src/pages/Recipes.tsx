import { useState } from "react"
import { Plus, Edit, Trash2, ChefHat, Package } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCafe, Recipe, RecipeIngredient } from "@/context/CafeContext"
import { useToast } from "@/hooks/use-toast"

export function Recipes() {
  const { recipes, rawMaterials, addRecipe, updateRecipe, deleteRecipe, calculateRecipeCost } = useCafe()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ingredients: [] as RecipeIngredient[]
  })
  const [newIngredient, setNewIngredient] = useState({
    materialId: "",
    quantity: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || formData.ingredients.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome e adicione pelo menos um ingrediente.",
        variant: "destructive"
      })
      return
    }

    const recipeData = {
      name: formData.name,
      description: formData.description || undefined,
      ingredients: formData.ingredients
    }

    if (editingRecipe) {
      updateRecipe(editingRecipe.id, recipeData)
      toast({
        title: "Sucesso",
        description: "Receita atualizada com sucesso!"
      })
      setIsEditDialogOpen(false)
      setEditingRecipe(null)
    } else {
      addRecipe(recipeData)
      toast({
        title: "Sucesso",
        description: "Receita adicionada com sucesso!"
      })
      setIsAddDialogOpen(false)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", ingredients: [] })
    setNewIngredient({ materialId: "", quantity: "" })
  }

  const handleAddIngredient = () => {
    if (!newIngredient.materialId || !newIngredient.quantity) {
      toast({
        title: "Erro",
        description: "Selecione um ingrediente e informe a quantidade.",
        variant: "destructive"
      })
      return
    }

    const quantity = parseFloat(newIngredient.quantity)
    if (quantity <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero.",
        variant: "destructive"
      })
      return
    }

    // Check if ingredient already exists
    const existingIndex = formData.ingredients.findIndex(
      ing => ing.materialId === newIngredient.materialId
    )

    if (existingIndex >= 0) {
      // Update existing ingredient
      const updatedIngredients = [...formData.ingredients]
      updatedIngredients[existingIndex].quantity = quantity
      setFormData({ ...formData, ingredients: updatedIngredients })
    } else {
      // Add new ingredient
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, {
          materialId: newIngredient.materialId,
          quantity
        }]
      })
    }

    setNewIngredient({ materialId: "", quantity: "" })
  }

  const handleRemoveIngredient = (materialId: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter(ing => ing.materialId !== materialId)
    })
  }

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setFormData({
      name: recipe.name,
      description: recipe.description || "",
      ingredients: recipe.ingredients
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteRecipe(id)
    toast({
      title: "Sucesso",
      description: "Receita removida com sucesso!"
    })
  }

  const getMaterialName = (materialId: string) => {
    const material = rawMaterials.find(m => m.id === materialId)
    return material ? material.name : "Material não encontrado"
  }

  const getMaterialUnit = (materialId: string) => {
    const material = rawMaterials.find(m => m.id === materialId)
    return material ? material.unit : ""
  }

  const RecipeForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Receita *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Suco de Laranja, Café com Leite..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva a receita (opcional)"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <Label>Ingredientes *</Label>
        
        {/* Add ingredient form */}
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Adicionar Ingrediente</h4>
          <div className="grid grid-cols-2 gap-3">
            <Select value={newIngredient.materialId} onValueChange={(value) => 
              setNewIngredient({ ...newIngredient, materialId: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ingrediente" />
              </SelectTrigger>
              <SelectContent>
                {rawMaterials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} ({material.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex space-x-2">
              <Input
                type="number"
                step="0.01"
                value={newIngredient.quantity}
                onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                placeholder="Quantidade"
              />
              <Button type="button" onClick={handleAddIngredient} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Ingredients list */}
        {formData.ingredients.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Ingredientes da Receita:</h4>
            <div className="space-y-2">
              {formData.ingredients.map((ingredient) => (
                <div key={ingredient.materialId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <span className="font-medium">{getMaterialName(ingredient.materialId)}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {ingredient.quantity} {getMaterialUnit(ingredient.materialId)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveIngredient(ingredient.materialId)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t">
              <span className="text-sm font-medium">
                Custo estimado: R$ {calculateRecipeCost(formData.ingredients).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <Button type="submit" className="w-full" disabled={rawMaterials.length === 0}>
        {editingRecipe ? "Atualizar" : "Adicionar"} Receita
      </Button>
      
      {rawMaterials.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Você precisa cadastrar matérias primas antes de criar receitas.
        </p>
      )}
    </form>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receitas</h1>
          <p className="text-muted-foreground">Gerencie os produtos da cafeteria</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={rawMaterials.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Receita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Receita</DialogTitle>
              <DialogDescription>
                Crie uma nova receita combinando matérias primas cadastradas.
              </DialogDescription>
            </DialogHeader>
            <RecipeForm />
          </DialogContent>
        </Dialog>
      </div>

      {rawMaterials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma matéria prima cadastrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Você precisa cadastrar matérias primas antes de criar receitas.
            </p>
          </CardContent>
        </Card>
      ) : recipes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma receita cadastrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando suas primeiras receitas usando as matérias primas cadastradas.
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Receita
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Receita</DialogTitle>
                  <DialogDescription>
                    Crie uma nova receita combinando matérias primas cadastradas.
                  </DialogDescription>
                </DialogHeader>
                <RecipeForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5" />
                    <span>{recipe.name}</span>
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(recipe)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(recipe.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Atualizado em {recipe.lastUpdated.toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipe.description && (
                    <p className="text-sm text-muted-foreground">{recipe.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Custo Total</span>
                    <span className="text-lg font-bold text-primary">
                      R$ {recipe.totalCost.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Ingredientes:</span>
                    <div className="space-y-1">
                      {recipe.ingredients.map((ingredient) => (
                        <div key={ingredient.materialId} className="flex items-center justify-between text-sm">
                          <span>{getMaterialName(ingredient.materialId)}</span>
                          <Badge variant="outline">
                            {ingredient.quantity} {getMaterialUnit(ingredient.materialId)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Receita</DialogTitle>
            <DialogDescription>
              Atualize as informações da receita.
            </DialogDescription>
          </DialogHeader>
          <RecipeForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}