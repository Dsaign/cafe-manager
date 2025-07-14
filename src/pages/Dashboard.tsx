import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ChefHat, TrendingUp, DollarSign } from "lucide-react"
import { useCafe } from "@/context/CafeContext"

export function Dashboard() {
  const { rawMaterials, recipes, priceHistory } = useCafe()

  const totalMaterials = rawMaterials.length
  const totalRecipes = recipes.length
  const recentPriceChanges = priceHistory.slice(-5).length
  const totalInventoryValue = rawMaterials.reduce((sum, material) => sum + material.price, 0)

  const stats = [
    {
      title: "Matérias Primas",
      value: totalMaterials,
      description: "Total de ingredientes cadastrados",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Receitas",
      value: totalRecipes,
      description: "Produtos disponíveis",
      icon: ChefHat,
      color: "text-green-600"
    },
    {
      title: "Valor do Estoque",
      value: `R$ ${totalInventoryValue.toFixed(2)}`,
      description: "Valor total das matérias primas",
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: "Alterações Recentes",
      value: recentPriceChanges,
      description: "Mudanças de preço recentes",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema financeiro da cafeteria</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Matérias Primas Recentes</CardTitle>
            <CardDescription>Últimos ingredientes adicionados</CardDescription>
          </CardHeader>
          <CardContent>
            {rawMaterials.length > 0 ? (
              <div className="space-y-3">
                {rawMaterials.slice(-5).map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-muted-foreground">{material.unit}</p>
                    </div>
                    <p className="font-semibold text-primary">R$ {material.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma matéria prima cadastrada ainda
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas Populares</CardTitle>
            <CardDescription>Produtos com maior custo</CardDescription>
          </CardHeader>
          <CardContent>
            {recipes.length > 0 ? (
              <div className="space-y-3">
                {recipes
                  .sort((a, b) => b.totalCost - a.totalCost)
                  .slice(0, 5)
                  .map((recipe) => (
                    <div key={recipe.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{recipe.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {recipe.ingredients.length} ingredientes
                        </p>
                      </div>
                      <p className="font-semibold text-primary">R$ {recipe.totalCost.toFixed(2)}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma receita cadastrada ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}