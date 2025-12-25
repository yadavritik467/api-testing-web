import axios, { AxiosError, AxiosResponse } from 'axios'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Collection, Request } from '../layouts/Sidebar'
import { ApiHandler } from '../utils/utils'

export interface KeyValueItem {
  type?: 'text' | 'file'
  key: string
  value: string | File
  enabled: boolean
}

export interface ApiResponse<T = unknown> extends Partial<AxiosResponse<T>> {
  time?: number
  size?: number
}

export interface CollectionState {
  method: string
  baseUrl: string
  finalUrl: string
  activeTab: string
  params: KeyValueItem[]
  formData: KeyValueItem[]
  formattedHeaders: Record<string, string>
  headers: KeyValueItem[]
  body: string
  showResponse: ApiResponse | null
  bodyMode: 'raw' | 'formData'
  loading: boolean
}

export interface CollectionContextType {
  // all state
  method: string
  envVal: string
  baseUrl: string
  finalUrl: string
  activeTab: string
  params: KeyValueItem[]
  formData: KeyValueItem[]
  formattedHeaders: Record<string, string>
  headers: KeyValueItem[]
  globalHeaders: KeyValueItem[]
  environments: KeyValueItem[]
  body: string
  showResponse: ApiResponse | null
  bodyMode: 'raw' | 'formData'
  requestArr: Request[]
  collection: Collection[]

  // update functions
  setMethod: React.Dispatch<React.SetStateAction<string>>
  setEnvVal: React.Dispatch<React.SetStateAction<string>>
  setBaseUrl: React.Dispatch<React.SetStateAction<string>>
  setFinalUrl: React.Dispatch<React.SetStateAction<string>>
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  setParams: React.Dispatch<React.SetStateAction<KeyValueItem[]>>
  setFormData: React.Dispatch<React.SetStateAction<KeyValueItem[]>>
  setFormattedHeaders: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >
  setHeaders: React.Dispatch<React.SetStateAction<KeyValueItem[]>>
  setGlobalHeaders: React.Dispatch<React.SetStateAction<KeyValueItem[]>>
  setEnvironments: React.Dispatch<React.SetStateAction<KeyValueItem[]>>
  setBody: React.Dispatch<React.SetStateAction<string>>
  setShowResponse: React.Dispatch<React.SetStateAction<ApiResponse | null>>
  setBodyMode: React.Dispatch<React.SetStateAction<'raw' | 'formData'>>
  setRequestArr: React.Dispatch<React.SetStateAction<Request[]>>
  setCollection: React.Dispatch<React.SetStateAction<Collection[]>>

  isGlobalHeaders: () => boolean

  //api controller functions
  GetMethod: () => Promise<void>
  PostMethod: () => Promise<void>
  PutMethod: () => Promise<void>
  PatchMethod: () => Promise<void>
  DeleteMethod: () => Promise<void>
}

export const CollectionContext = createContext<CollectionContextType | null>(
  null
)

export const useCollection = () => {
  const context = useContext(CollectionContext)
  if (!context) {
    throw new Error('useCollection must be used within an CollectionProvider')
  }
  return context
}

export const CollectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [collection, setCollection] = useState<Collection[]>([])
  const [method, setMethod] = useState('GET')
  const [envVal, setEnvVal] = useState('')
  // const [baseUrl, setBaseUrl] = useState('https://dummyjson.com/products')
  const [baseUrl, setBaseUrl] = useState('')
  const [finalUrl, setFinalUrl] = useState(baseUrl)
  const [activeTab, setActiveTab] = useState('params')
  const [params, setParams] = useState<KeyValueItem[]>([
    { key: '', value: '', enabled: false },
  ])
  const [formData, setFormData] = useState<KeyValueItem[]>([
    { type: 'text', key: '', value: '', enabled: false },
  ])
  const [formattedHeaders, setFormattedHeaders] = useState<
    Record<string, string>
  >({})
  const [headers, setHeaders] = useState<KeyValueItem[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true },
    {
      key: 'Authorization',
      value:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MDRmMTc4Yy04NGIyLTQxZGItODA3Ni03MThlY2Y3ODRiYzkiLCJuYW1lIjoicml0aWsgc2VydmljZWhpdmUiLCJ1c2VybmFtZSI6InlhZGF2cml0aWs0NDUiLCJpYXQiOjE3NjUyMDcyMjcsImV4cCI6MTc2NTI5MzYyN30.YRGy0g006-m4QfqpRK2FBuwIXGJyhiz9liXmO4dNxQg',
      enabled: true,
    },
  ])
  const [globalHeaders, setGlobalHeaders] = useState<KeyValueItem[]>(
    JSON.parse(localStorage.getItem('globalHeaders') as string) || [
      {
        key: '',
        value: '',
        enabled: false,
      },
    ]
  )
  const [environments, setEnvironments] = useState<KeyValueItem[]>(
    JSON.parse(localStorage.getItem('environments') as string) || [
      {
        key: 'PROD_URL',
        value: 'https://prod.com',
        enabled: true,
      },
      {
        key: 'DEV_URL',
        value: 'https://dev.com',
        enabled: true,
      },
    ]
  )
  const [body, setBody] = useState('')
  const [showResponse, setShowResponse] = useState<
    ApiResponse | AxiosError | null
  >(null)
  const [bodyMode, setBodyMode] = useState<'raw' | 'formData'>('raw')

  const [requestArr, setRequestArr] = useState<Request[]>([])

  const [loading, setLoading] = useState<boolean>(false)

  const createFormData = () => {
    const valid = formData.filter((f) => f.enabled && f.key.trim() !== '')

    if (valid.length === 0) return null

    const fd = new FormData()

    valid.forEach((f) => {
      fd.append(f.key, f.value)
    })

    return fd
  }

  const sendBodyInAPi = () => {
    return bodyMode === 'raw' ? { ...JSON.parse(body) } : createFormData()
  }

  const getHeaders = (isFormData = false) => {
    return {
      ...formattedHeaders,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    }
  }

  const isGlobalHeaders = () => {
    return globalHeaders.filter((h) => h.enabled === true)?.length > 0
  }

  useEffect(() => {
    if (globalHeaders?.length) {
      localStorage.setItem('globalHeaders', JSON.stringify(globalHeaders))
    }
    if (environments?.length) {
      localStorage.setItem('environments', JSON.stringify(environments))
    }
  }, [globalHeaders, environments])

  const generateUrlWithEnv = () => {
    return envVal !== '' ? envVal + finalUrl : finalUrl
  }

  //   api handler
  const GetMethod = async () => {
    await ApiHandler({
      apiCall: () => axios.get(generateUrlWithEnv(), { headers: getHeaders() }),
      loadingOn: () => setLoading(true),
      loadingOff: () => setLoading(false),
      setter: setShowResponse,
    })
  }

  const PostMethod = async () => {
    const payload = sendBodyInAPi()
    const isFormData = payload instanceof FormData
    await ApiHandler({
      apiCall: () =>
        axios.post(generateUrlWithEnv(), payload, {
          headers: getHeaders(isFormData),
        }),
      loadingOn: () => setLoading(true),
      loadingOff: () => setLoading(false),
      setter: setShowResponse,
    })
  }

  const PutMethod = async () => {
    const payload = sendBodyInAPi()
    const isFormData = payload instanceof FormData
    await ApiHandler({
      apiCall: () =>
        axios.put(generateUrlWithEnv(), payload, {
          headers: getHeaders(isFormData),
        }),
      loadingOn: () => setLoading(true),
      loadingOff: () => setLoading(false),
      setter: setShowResponse,
    })
  }

  const PatchMethod = async () => {
    const payload = sendBodyInAPi()
    const isFormData = payload instanceof FormData
    await ApiHandler({
      apiCall: () =>
        axios.patch(generateUrlWithEnv(), payload, {
          headers: getHeaders(isFormData),
        }),
      loadingOn: () => setLoading(true),
      loadingOff: () => setLoading(false),
      setter: setShowResponse,
    })
  }

  const DeleteMethod = async () => {
    await ApiHandler({
      apiCall: () =>
        axios.delete(generateUrlWithEnv(), {
          headers: getHeaders(),
        }),
      loadingOn: () => setLoading(true),
      loadingOff: () => setLoading(false),
      setter: setShowResponse,
    })
  }

  const all_states = {
    method,
    envVal,
    baseUrl,
    finalUrl,
    activeTab,
    params,
    formData,
    formattedHeaders,
    headers,
    globalHeaders,
    body,
    showResponse,
    bodyMode,
    loading,
    requestArr,
    collection,
    environments,
  }
  const all_states_update_func = {
    setMethod,
    setEnvVal,
    setBaseUrl,
    setFinalUrl,
    setActiveTab,
    setParams,
    setFormData,
    setFormattedHeaders,
    setHeaders,
    setGlobalHeaders,
    setBody,
    setShowResponse,
    setBodyMode,
    setRequestArr,
    setCollection,
    isGlobalHeaders,
    setEnvironments,
  }

  const all_api_controllers = {
    GetMethod,
    PostMethod,
    PutMethod,
    PatchMethod,
    DeleteMethod,
  }
  return (
    <CollectionContext.Provider
      value={{
        ...all_states,
        ...all_states_update_func,
        ...all_api_controllers,
      }}
    >
      {children}
    </CollectionContext.Provider>
  )
}
