import React, { createContext, useContext, useState, useEffect } from 'react'

export interface RawMaterial {
  id: string
  name: string
  price: number
  unit: string
  supplier?: string
  lastUpdated: Date
}

export interface RecipeIngredient {
  materialId: string
  quantity: number
}

export interface Recipe {
  id: string
  name: string
  description?: string
  ingredients: RecipeIngredient[]
  totalCost: number
  lastUpdated: Date
}

export interface PriceHistory {
  id: string
  materialId: string
  oldPrice: number
  newPrice: number
  date: Date
  reason?: string
}

interface CafeContextType {
  rawMaterials: RawMaterial[]
  recipes: Recipe[]
  priceHistory: PriceHistory[]
  addRawMaterial: (material: Omit<RawMaterial, 'id' | 'lastUpdated'>) => void
  updateRawMaterial: (id: string, updates: Partial<RawMaterial>) => void
  deleteRawMaterial: (id: string) => void
  addRecipe: (recipe: Omit<Recipe, 'id' | 'totalCost' | 'lastUpdated'>) => void
  updateRecipe: (id: string, updates: Partial<Recipe>) => void
  deleteRecipe: (id: string) => void
  calculateRecipeCost: (ingredients: RecipeIngredient[]) => number
}

const CafeContext = createContext<CafeContextType | undefined>(undefined)

export function CafeProvider({ children }: { children: React.ReactNode }) {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMaterials = localStorage.getItem('rawMaterials')
    const savedRecipes = localStorage.getItem('recipes')
    const savedHistory = localStorage.getItem('priceHistory')

    if (savedMaterials) {
      setRawMaterials(JSON.parse(savedMaterials).map((m: any) => ({
        ...m,
        lastUpdated: new Date(m.lastUpdated)
      })))
    }
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes).map((r: any) => ({
        ...r,
        lastUpdated: new Date(r.lastUpdated)
      })))
    }
    if (savedHistory) {
      setPriceHistory(JSON.parse(savedHistory).map((h: any) => ({
        ...h,
        date: new Date(h.date)
      })))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('rawMaterials', JSON.stringify(rawMaterials))
  }, [rawMaterials])

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes))
  }, [recipes])

  useEffect(() => {
    localStorage.setItem('priceHistory', JSON.stringify(priceHistory))
  }, [priceHistory])

  const calculateRecipeCost = (ingredients: RecipeIngredient[]): number => {
    return ingredients.reduce((total, ingredient) => {
      const material = rawMaterials.find(m => m.id === ingredient.materialId)
      return total + (material ? material.price * ingredient.quantity : 0)
    }, 0)
  }

  const addRawMaterial = (material: Omit<RawMaterial, 'id' | 'lastUpdated'>) => {
    const newMaterial: RawMaterial = {
      ...material,
      id: crypto.randomUUID(),
      lastUpdated: new Date()
    }
    setRawMaterials(prev => [...prev, newMaterial])
  }

  const updateRawMaterial = (id: string, updates: Partial<RawMaterial>) => {
    setRawMaterials(prev => prev.map(material => {
      if (material.id === id) {
        const oldPrice = material.price
        const newPrice = updates.price ?? material.price
        
        // Record price change in history
        if (oldPrice !== newPrice) {
          const historyEntry: PriceHistory = {
            id: crypto.randomUUID(),
            materialId: id,
            oldPrice,
            newPrice,
            date: new Date()
          }
          setPriceHistory(prevHistory => [...prevHistory, historyEntry])
        }

        return { ...material, ...updates, lastUpdated: new Date() }
      }
      return material
    }))

    // Update recipe costs that use this material
    setRecipes(prev => prev.map(recipe => {
      const usesThisMaterial = recipe.ingredients.some(ing => ing.materialId === id)
      if (usesThisMaterial) {
        return {
          ...recipe,
          totalCost: calculateRecipeCost(recipe.ingredients),
          lastUpdated: new Date()
        }
      }
      return recipe
    }))
  }

  const deleteRawMaterial = (id: string) => {
    setRawMaterials(prev => prev.filter(material => material.id !== id))
    // Remove recipes that use this material
    setRecipes(prev => prev.filter(recipe => 
      !recipe.ingredients.some(ing => ing.materialId === id)
    ))
  }

  const addRecipe = (recipe: Omit<Recipe, 'id' | 'totalCost' | 'lastUpdated'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: crypto.randomUUID(),
      totalCost: calculateRecipeCost(recipe.ingredients),
      lastUpdated: new Date()
    }
    setRecipes(prev => [...prev, newRecipe])
  }

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id === id) {
        const updatedRecipe = { ...recipe, ...updates, lastUpdated: new Date() }
        if (updates.ingredients) {
          updatedRecipe.totalCost = calculateRecipeCost(updates.ingredients)
        }
        return updatedRecipe
      }
      return recipe
    }))
  }

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id))
  }

  return (
    <CafeContext.Provider value={{
      rawMaterials,
      recipes,
      priceHistory,
      addRawMaterial,
      updateRawMaterial,
      deleteRawMaterial,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      calculateRecipeCost
    }}>
      {children}
    </CafeContext.Provider>
  )
}

export function useCafe() {
  const context = useContext(CafeContext)
  if (context === undefined) {
    throw new Error('useCafe must be used within a CafeProvider')
  }
  return context
}