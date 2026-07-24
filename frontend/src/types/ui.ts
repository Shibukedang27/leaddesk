export interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}

export interface Feature {
  title: string
  description: string
}
