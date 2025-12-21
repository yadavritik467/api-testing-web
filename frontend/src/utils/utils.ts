import { AxiosError, AxiosResponse } from 'axios'
import { ApiResponse } from '../context/Collection'

export interface ApiHandlerParameter<T> {
  loadingOn: () => void
  loadingOff: () => void
  apiCall: () => Promise<AxiosResponse<T>>
  setter: (data: ApiResponse<T>) => void
}

export const ApiHandler = async <T>({
  loadingOn,
  loadingOff,
  apiCall,
  setter,
}: ApiHandlerParameter<T>) => {
  const start = performance.now()
  try {
    loadingOn()
    const response = await apiCall()
    const end = performance.now()
    // Success State
    setter({
      ...response,
      time: Math.round(end - start),
    })
    loadingOff()
  } catch (err) {
    const error = err as AxiosError<T>
    if (error?.response) {
      // Server Error with response
      const errorData = error.response as ApiResponse<T>
      errorData.time = 0
      setter(errorData)
    } else {
      // Network or other errors
      setter(error as unknown as ApiResponse<T>)
    }
    loadingOff()
  }
}
