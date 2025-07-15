import { BarChart3, TrendingUp, Package, ChefHat } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCafe } from "@/context/CafeContext"

export function Reports() {
  const { rawMaterials, recipes, priceHistory } = useCafe()

  // Calculate statistics
  const totalMaterials = rawMaterials.length
  const totalRecipes = recipes.length
  const totalInventoryValue = rawMaterials.reduce((sum, material) => sum + material.price, 0)
  const averageMaterialPrice = totalMaterials > 0 ? totalInventoryValue / totalMaterials : 0
  
  const averageRecipeCost = recipes.length > 0 
    ? recipes.reduce((sum, recipe) => sum + recipe.totalCost, 0) / recipes.length 
    : 0

  // Most expensive materials
  const expensiveMaterials = [...rawMaterials]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)

  // Most expensive recipes
  const expensiveRecipes = [...recipes]
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, 5)

  // Recent price changes
  const recentChanges = priceHistory
    .slice(-10)
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const getMaterialName = (materialId: string) => {
    const material = rawMaterials.find(m => m.id === materialId)
    return material ? material.name : "Material não encontrado"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground">Análises e estatísticas do sistema</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Matérias Primas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterials}</div>
            <p className="text-xs text-muted-foreground">Ingredientes cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecipes}</div>
            <p className="text-xs text-muted-foreground">Produtos disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço Médio - Materiais</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageMaterialPrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Por matéria prima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Médio - Receitas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageRecipeCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Por receita</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Expensive Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Matérias Primas Mais Caras</CardTitle>
            <CardDescription>Top 5 ingredientes com maior preço</CardDescription>
          </CardHeader>
          <CardContent>
            {expensiveMaterials.length > 0 ? (
              <div className="space-y-3">
                {expensiveMaterials.map((material, index) => (
                  <div key={material.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{material.name}</p>
                        <p className="text-sm text-muted-foreground">{material.unit}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-primary">R$ {material.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma matéria prima cadastrada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Most Expensive Recipes */}
        <Card>
          <CardHeader>
            <CardTitle>Receitas Mais Caras</CardTitle>
            <CardDescription>Top 5 produtos com maior custo</CardDescription>
          </CardHeader>
          <CardContent>
            {expensiveRecipes.length > 0 ? (
              <div className="space-y-3">
                {expensiveRecipes.map((recipe, index) => (
                  <div key={recipe.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{recipe.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {recipe.ingredients.length} ingredientes
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-primary">R$ {recipe.totalCost.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma receita cadastrada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Price Changes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alterações de Preço Recentes</CardTitle>
            <CardDescription>Últimas 10 mudanças de preços registradas</CardDescription>
          </CardHeader>
          <CardContent>
            {recentChanges.length > 0 ? (
              <div className="space-y-3">
                {recentChanges.map((change) => {
                  const priceChange = change.newPrice - change.oldPrice
                  const isIncrease = priceChange > 0
                  const percentChange = ((priceChange / change.oldPrice) * 100)
                  
                  return (
                    <div key={change.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{getMaterialName(change.materialId)}</p>
                        <p className="text-sm text-muted-foreground">
                          {change.date.toLocaleDateString('pt-BR')} às {change.date.toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">R$ {change.oldPrice.toFixed(2)}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-semibold">R$ {change.newPrice.toFixed(2)}</span>
                        </div>
                        <Badge 
                          variant={isIncrease ? "destructive" : "default"}
                          className={isIncrease ? "" : "bg-green-100 text-green-800"}
                        >
                          {isIncrease ? "+" : ""}{percentChange.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma alteração de preço registrada
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Information */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
          <CardDescription>Informações consolidadas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Valor Total do Estoque</h3>
              <p className="text-2xl font-bold text-primary">R$ {totalInventoryValue.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Baseado nos preços atuais das matérias primas
              </p>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Alterações de Preço</h3>
              <p className="text-2xl font-bold text-primary">{priceHistory.length}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Total de mudanças registradas
              </p>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Utilização de Ingredientes</h3>
              <p className="text-2xl font-bold text-primary">
                {rawMaterials.filter(material => 
                  recipes.some(recipe => 
                    recipe.ingredients.some(ing => ing.materialId === material.id)
                  )
                ).length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Matérias primas utilizadas em receitas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}