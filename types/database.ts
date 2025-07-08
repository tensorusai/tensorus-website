export interface DataFile {
  id: string
  name: string
  size: number
  type: string
  description: string
  timestamp: string
}

export interface TensorData {
  id: string
  originalFile: string
  dimensions: number
  shape: number[]
  dataType: string
  sparsity: number
  transformationMethod: string
  timestamp: string
  tensor?: number[][] | number[][][]
  fields?: string[]
  stats?: {
    min: number[]
    max: number[]
    mean: number[]
    stdDev: number[]
    fields: string[]
  }
}

export interface AgentMessage {
  id: string
  agent: string
  message: string
  timestamp: string
}

export interface QueryResult {
  id: string
  query: string
  result: string
  timestamp: string
  visualData?: any
}
