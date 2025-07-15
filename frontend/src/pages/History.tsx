import { useState } from "react"
import { History as HistoryIcon, TrendingUp, TrendingDown, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCafe } from "@/context/CafeContext"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function History() {
  const { priceHistory, rawMaterials } = useCafe()
  const [sortBy, setSortBy] = useState<'date' | 'material' | 'change'>('date')

  const getMaterialName = (materialId: string) => {
    const material = rawMaterials.find(m => m.id === materialId)
    return material ? material.name : "Material removido"
  }

  const getMaterialUnit = (materialId: string) => {
    const material = rawMaterials.find(m => m.id === materialId)
    return material ? material.unit : ""
  }

  const sortedHistory = [...priceHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.date.getTime() - a.date.getTime()
      case 'material':
        return getMaterialName(a.materialId).localeCompare(getMaterialName(b.materialId))
      case 'change':
        const changeA = ((a.newPrice - a.oldPrice) / a.oldPrice) * 100
        const changeB = ((b.newPrice - b.oldPrice) / b.oldPrice) * 100
        return Math.abs(changeB) - Math.abs(changeA)
      default:
        return 0
    }
  })

  const totalChanges = priceHistory.length
  const priceIncreases = priceHistory.filter(h => h.newPrice > h.oldPrice).length
  const priceDecreases = priceHistory.filter(h => h.newPrice < h.oldPrice).length

  const getChangeInfo = (history: any) => {
    const change = history.newPrice - history.oldPrice
    const percentChange = ((change / history.oldPrice) * 100)
    const isIncrease = change > 0
    
    return {
      change,
      percentChange,
      isIncrease,
      icon: isIncrease ? TrendingUp : TrendingDown,
      color: isIncrease ? "text-red-600" : "text-green-600",
      bgColor: isIncrease ? "bg-red-50" : "bg-green-50",
      borderColor: isIncrease ? "border-red-200" : "border-green-200"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Histórico de Preços</h1>
        <p className="text-muted-foreground">Acompanhe todas as alterações de preços das matérias primas</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alterações</CardTitle>
            <HistoryIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChanges}</div>
            <p className="text-xs text-muted-foreground">Mudanças registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aumentos de Preço</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{priceIncreases}</div>
            <p className="text-xs text-muted-foreground">
              {totalChanges > 0 ? `${((priceIncreases / totalChanges) * 100).toFixed(1)}%` : '0%'} do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diminuições de Preço</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{priceDecreases}</div>
            <p className="text-xs text-muted-foreground">
              {totalChanges > 0 ? `${((priceDecreases / totalChanges) * 100).toFixed(1)}%` : '0%'} do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sorting Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={sortBy === 'date' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('date')}
        >
          Por Data
        </Button>
        <Button
          variant={sortBy === 'material' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('material')}
        >
          Por Material
        </Button>
        <Button
          variant={sortBy === 'change' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('change')}
        >
          Por Variação
        </Button>
      </div>

      {/* History List */}
      {priceHistory.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HistoryIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma alteração registrada</h3>
            <p className="text-muted-foreground text-center">
              As alterações de preços das matérias primas aparecerão aqui automaticamente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedHistory.map((history) => {
            const changeInfo = getChangeInfo(history)
            
            return (
              <Card key={history.id} className={`border-l-4 ${changeInfo.borderColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${changeInfo.bgColor}`}>
                        <changeInfo.icon className={`h-5 w-5 ${changeInfo.color}`} />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{getMaterialName(history.materialId)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(history.date, "PPP 'às' p", { locale: ptBR })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          R$ {history.oldPrice.toFixed(2)}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-lg font-bold">
                          R$ {history.newPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-end space-x-2 mt-1">
                        <Badge 
                          variant={changeInfo.isIncrease ? "destructive" : "default"}
                          className={changeInfo.isIncrease ? "" : "bg-green-100 text-green-800"}
                        >
                          {changeInfo.isIncrease ? "+" : ""}
                          {changeInfo.percentChange.toFixed(1)}%
                        </Badge>
                        
                        <span className="text-sm text-muted-foreground">
                          (R$ {changeInfo.isIncrease ? "+" : ""}{changeInfo.change.toFixed(2)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {history.reason && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        <strong>Motivo:</strong> {history.reason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}